import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Seed curriculum tables from a flat topic list posted in the body.
 * Expects: POST { topics: Array<{ id, title, subject, category, topic, keywords, goals, boundaries, gradeRange, inputType, defaultLevel, briefDescription, helpTemplate }> }
 * Only admin can call this.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { topics } = await req.json();
    if (!Array.isArray(topics) || topics.length === 0) {
      return new Response(JSON.stringify({ error: "No topics provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const toSlug = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Collect unique hierarchy
    const subjectMap = new Map<string, string>(); // slug → id
    const categoryMap = new Map<string, string>(); // "subject|category" → id
    const topicMap = new Map<string, string>(); // "subject|category|topic" → id

    let subjectOrder = 0;
    let categoryOrder = 0;
    let topicOrder = 0;
    let skillOrder = 0;

    // Phase 1: Upsert subjects
    const uniqueSubjects = [...new Set(topics.map((t: any) => t.subject))];
    for (const subjectName of uniqueSubjects) {
      const slug = toSlug(subjectName);
      const { data: existing } = await supabase
        .from("curriculum_subjects")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        subjectMap.set(slug, existing.id);
      } else {
        const { data: inserted, error } = await supabase
          .from("curriculum_subjects")
          .insert({ name: subjectName, slug, sort_order: subjectOrder++ })
          .select("id")
          .single();
        if (error) throw error;
        subjectMap.set(slug, inserted.id);
      }
    }

    // Phase 2: Upsert categories
    for (const t of topics) {
      const catKey = `${t.subject}|${t.category}`;
      if (categoryMap.has(catKey)) continue;

      const subjectSlug = toSlug(t.subject);
      const subjectId = subjectMap.get(subjectSlug)!;
      const catSlug = toSlug(t.category);

      const { data: existing } = await supabase
        .from("curriculum_categories")
        .select("id")
        .eq("subject_id", subjectId)
        .eq("slug", catSlug)
        .maybeSingle();

      if (existing) {
        categoryMap.set(catKey, existing.id);
      } else {
        const { data: inserted, error } = await supabase
          .from("curriculum_categories")
          .insert({ name: t.category, slug: catSlug, subject_id: subjectId, sort_order: categoryOrder++ })
          .select("id")
          .single();
        if (error) throw error;
        categoryMap.set(catKey, inserted.id);
      }
    }

    // Phase 3: Upsert topics
    for (const t of topics) {
      const topicKey = `${t.subject}|${t.category}|${t.topic}`;
      if (topicMap.has(topicKey)) continue;

      const catKey = `${t.subject}|${t.category}`;
      const categoryId = categoryMap.get(catKey)!;
      const topicSlug = toSlug(t.topic);

      const { data: existing } = await supabase
        .from("curriculum_topics")
        .select("id")
        .eq("category_id", categoryId)
        .eq("slug", topicSlug)
        .maybeSingle();

      if (existing) {
        topicMap.set(topicKey, existing.id);
      } else {
        const { data: inserted, error } = await supabase
          .from("curriculum_topics")
          .insert({
            name: t.topic,
            slug: topicSlug,
            category_id: categoryId,
            description: t.topicDescription || null,
            sort_order: topicOrder++,
          })
          .select("id")
          .single();
        if (error) throw error;
        topicMap.set(topicKey, inserted.id);
      }
    }

    // Phase 4: Upsert skills
    let skillsCreated = 0;
    let skillsSkipped = 0;
    for (const t of topics) {
      const topicKey = `${t.subject}|${t.category}|${t.topic}`;
      const topicId = topicMap.get(topicKey)!;

      // Check if skill already exists
      const { data: existing } = await supabase
        .from("curriculum_skills")
        .select("id")
        .eq("topic_id", topicId)
        .eq("code_skill_id", t.id)
        .maybeSingle();

      if (existing) {
        skillsSkipped++;
        continue;
      }

      const help = t.helpTemplate || {};
      const { error } = await supabase
        .from("curriculum_skills")
        .insert({
          topic_id: topicId,
          code_skill_id: t.id,
          name: t.title,
          brief_description: t.briefDescription || null,
          grade_min: t.gradeRange?.[0] ?? 3,
          grade_max: t.gradeRange?.[1] ?? 9,
          input_type: t.inputType || "text",
          default_level: t.defaultLevel || 1,
          help_hint: help.hint || null,
          help_steps: help.steps || [],
          help_example: help.example || null,
          help_common_mistake: help.commonMistake || null,
          help_visual_examples: help.visualExamples || [],
          keywords: t.keywords || [],
          goals: t.goals || [],
          boundaries: t.boundaries || [],
          is_active: true,
          sort_order: skillOrder++,
        });

      if (error) throw error;
      skillsCreated++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        subjects: uniqueSubjects.length,
        categories: categoryMap.size,
        topics: topicMap.size,
        skills_created: skillsCreated,
        skills_skipped: skillsSkipped,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Seed error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
