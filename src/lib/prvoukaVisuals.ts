/**
 * Visual metadata (emoji + color + optional AI image) for all subject categories and topics.
 * Used by TopicBrowser to render colorful cards.
 */

export interface PrvoukaVisual {
  emoji: string;
  colorClass: string;      // border + text accent
  bgClass: string;         // background tint
  gradientClass: string;   // gradient for card
  imageKey?: string;        // storage key for AI-generated image
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function imageUrl(key: string, ext: string = "png"): string {
  return `${SUPABASE_URL}/storage/v1/object/public/prvouka-images/${key}.${ext}`;
}

// ── PRVOUKA CATEGORIES ──────────────────────────────────────

const PRVOUKA_CATEGORY_VISUALS: Record<string, PrvoukaVisual> = {
  "Člověk a jeho tělo": {
    emoji: "🧒",
    colorClass: "border-[hsl(var(--prvouka-body))]",
    bgClass: "bg-[hsl(var(--prvouka-body-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--prvouka-body-bg))]",
    imageKey: "cat-clovek-a-jeho-telo",
  },
  "Příroda kolem nás": {
    emoji: "🌿",
    colorClass: "border-[hsl(var(--prvouka-nature))]",
    bgClass: "bg-[hsl(var(--prvouka-nature-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--prvouka-nature-bg))]",
    imageKey: "cat-priroda-kolem-nas",
  },
  "Lidé a společnost": {
    emoji: "🏘️",
    colorClass: "border-[hsl(var(--prvouka-society))]",
    bgClass: "bg-[hsl(var(--prvouka-society-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--prvouka-society-bg))]",
    imageKey: "cat-lide-a-spolecnost",
  },
  "Orientace v prostoru a čase": {
    emoji: "🧭",
    colorClass: "border-[hsl(var(--prvouka-space))]",
    bgClass: "bg-[hsl(var(--prvouka-space-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--prvouka-space-bg))]",
    imageKey: "cat-orientace-v-prostoru-a-case",
  },
};

const PRVOUKA_TOPIC_VISUALS: Record<string, { emoji: string; imageKey: string; ext?: string }> = {
  "Lidské tělo": { emoji: "🦴", imageKey: "topic-lidske-telo" },
  "Smysly": { emoji: "👁️", imageKey: "topic-smysly" },
  "Zdraví a hygiena": { emoji: "🧼", imageKey: "topic-zdravi-a-hygiena" },
  "Rostliny": { emoji: "🌱", imageKey: "topic-rostliny" },
  "Zvířata": { emoji: "🐾", imageKey: "topic-zvirata" },
  "Roční období a počasí": { emoji: "🌦️", imageKey: "topic-rocni-obdobi-a-pocasi" },
  "Naše země": { emoji: "🏛️", imageKey: "topic-nase-zeme" },
  "Rodina a společnost": { emoji: "👨‍👩‍👧", imageKey: "topic-rodina-a-spolecnost" },
  "Rodina a pravidla chování": { emoji: "👨‍👩‍👧", imageKey: "topic-rodina-a-pravidla-chovani" },
  "Obec a město": { emoji: "🏛️", imageKey: "topic-obec-a-mesto" },
  "Česká republika": { emoji: "🇨🇿", imageKey: "topic-ceska-republika" },
  "Světové strany a mapa": { emoji: "🗺️", imageKey: "topic-svetove-strany-a-mapa" },
  "Čas a kalendář": { emoji: "⏰", imageKey: "topic-cas-a-kalendar" },
};

// ── MATEMATIKA CATEGORIES ───────────────────────────────────

const MATH_CATEGORY_VISUALS: Record<string, PrvoukaVisual> = {
  "Čísla a operace": {
    emoji: "🔢",
    colorClass: "border-[hsl(var(--math-numbers))]",
    bgClass: "bg-[hsl(var(--math-numbers-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-numbers-bg))]",
    imageKey: "cat-math-cisla-a-operace",
  },
  "Zlomky": {
    emoji: "🍕",
    colorClass: "border-[hsl(var(--math-fractions))]",
    bgClass: "bg-[hsl(var(--math-fractions-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-fractions-bg))]",
    imageKey: "cat-math-zlomky",
  },
  "Geometrie": {
    emoji: "📐",
    colorClass: "border-[hsl(var(--math-geometry))]",
    bgClass: "bg-[hsl(var(--math-geometry-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-geometry-bg))]",
    imageKey: "cat-math-geometrie",
  },
  // ── II. stupeň + bridge (4.-9. ročník) ──
  "Měření": {
    emoji: "📏",
    colorClass: "border-[hsl(var(--math-numbers))]",
    bgClass: "bg-[hsl(var(--math-numbers-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-numbers-bg))]",
    imageKey: "cat-math-cisla-a-operace", // fallback — stejný asset jako čísla
  },
  "Poměr a procenta": {
    emoji: "%",
    colorClass: "border-[hsl(var(--math-fractions))]",
    bgClass: "bg-[hsl(var(--math-fractions-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-fractions-bg))]",
    imageKey: "cat-math-zlomky", // procenta jsou blízko zlomkům
  },
  "Algebra": {
    emoji: "𝑥",
    colorClass: "border-[hsl(var(--math-numbers))]",
    bgClass: "bg-[hsl(var(--math-numbers-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-numbers-bg))]",
    imageKey: "cat-math-cisla-a-operace",
  },
  "Slovní úlohy": {
    emoji: "📖",
    colorClass: "border-[hsl(var(--math-numbers))]",
    bgClass: "bg-[hsl(var(--math-numbers-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-numbers-bg))]",
    imageKey: "cat-math-cisla-a-operace",
  },
};

const MATH_TOPIC_VISUALS: Record<string, { emoji: string; imageKey: string; ext?: string }> = {
  "Porovnávání přirozených čísel do 100": { emoji: "⚖️", imageKey: "topic-math-porovnavani-prirozenych-cisel" },
  "Sčítání a odčítání do 100": { emoji: "➕", imageKey: "topic-math-scitani-a-odcitani-do-100" },
  "Násobení a dělení": { emoji: "✖️", imageKey: "topic-math-nasobeni-a-deleni" },
  "Zaokrouhlování": { emoji: "🎯", imageKey: "topic-math-zaokrouhlovani" },
  "Řazení čísel": { emoji: "📊", imageKey: "topic-math-razeni-cisel" },
  "Porovnávání zlomků": { emoji: "⚖️", imageKey: "topic-math-porovnavani-zlomku" },
  "Krácení zlomků": { emoji: "✂️", imageKey: "topic-math-kraceni-zlomku" },
  "Rozšiřování zlomků": { emoji: "🔍", imageKey: "topic-math-rozsireni-zlomku" },
  "Sčítání zlomků": { emoji: "➕", imageKey: "topic-math-scitani-zlomku" },
  "Odčítání zlomků": { emoji: "➖", imageKey: "topic-math-odcitani-zlomku" },
  "Smíšená čísla": { emoji: "🧩", imageKey: "topic-math-smisena-cisla" },
  "Zlomek z čísla": { emoji: "🍎", imageKey: "topic-math-zlomek-z-cisla" },
  "Násobení zlomku celým číslem": { emoji: "✖️", imageKey: "topic-math-nasobeni-zlomku-celym-cislem" },
  "Geometrické tvary": { emoji: "🔷", imageKey: "topic-math-geometricke-tvary" },
  // ── 4. ročník — bridge do II. stupně ──
  "Sčítání a odčítání do 10 000": { emoji: "➕", imageKey: "topic-math-scitani-a-odcitani-do-100" },
  "Písemné násobení": { emoji: "✖️", imageKey: "topic-math-nasobeni-a-deleni" },
  "Dělení se zbytkem": { emoji: "➗", imageKey: "topic-math-nasobeni-a-deleni" },
  "Zaokrouhlování na desítky, stovky a tisíce": { emoji: "🎯", imageKey: "topic-math-zaokrouhlovani" },
  "Zlomek jako část celku": { emoji: "🍕", imageKey: "topic-math-zlomek-z-cisla" },
  "Převody jednotek": { emoji: "📏", imageKey: "topic-math-zaokrouhlovani" },
  "Obvod vícehranu": { emoji: "📐", imageKey: "topic-math-geometricke-tvary" },
  // ── 7.-9. ročník ──
  "Procenta": { emoji: "%", imageKey: "topic-math-zlomek-z-cisla" },
  "Celá čísla": { emoji: "±", imageKey: "topic-math-scitani-a-odcitani-do-100" },
  "Lineární rovnice": { emoji: "𝑥", imageKey: "topic-math-nasobeni-a-deleni" },
  // ── 5. ročník ──
  "Čísla do milionu": { emoji: "🔢", imageKey: "topic-math-porovnavani-prirozenych-cisel" },
  "Desetinná čísla": { emoji: "🔟", imageKey: "topic-math-zaokrouhlovani" },
  "Zlomky se stejným jmenovatelem": { emoji: "🍕", imageKey: "topic-math-scitani-zlomku" },
  "Písemné dělení": { emoji: "➗", imageKey: "topic-math-nasobeni-a-deleni" },
  "Obsah": { emoji: "🟦", imageKey: "topic-math-geometricke-tvary" },
  "Záporná čísla": { emoji: "➖", imageKey: "topic-math-scitani-a-odcitani-do-100" },
  // ── 6. ročník ──
  "Dělitelnost": { emoji: "🔢", imageKey: "topic-math-nasobeni-a-deleni" },
  "Úhly": { emoji: "📐", imageKey: "topic-math-geometricke-tvary" },
  "Trojúhelníky": { emoji: "🔺", imageKey: "topic-math-geometricke-tvary" },
  "Obvod": { emoji: "📏", imageKey: "topic-math-obvod" },
  "Měření délky a odhad": { emoji: "📏", imageKey: "topic-math-mereni-delky" },
  "Základní jednotky a vztahy": { emoji: "📐", imageKey: "topic-math-zakladni-jednotky" },
  "Převody mezi jednotkami": { emoji: "🔄", imageKey: "topic-math-prevody-jednotek" },
  "Odhad a porovnávání délek": { emoji: "🤔", imageKey: "topic-math-odhad-delek" },
  "Jednotky hmotnosti": { emoji: "⚖️", imageKey: "topic-math-jednotky-hmotnosti" },
  "Slovní úlohy s délkami": { emoji: "📝", imageKey: "topic-math-slovni-ulohy-delky" },
  "Objem — mililitr a litr": { emoji: "🧪", imageKey: "topic-math-objem-ml-l" },
  // 4. ročník
  "Čísla do 10 000": { emoji: "🔢", imageKey: "topic-math-porovnavani-prirozenych-cisel" },
  "Písemné sčítání a odčítání": { emoji: "✍️", imageKey: "topic-math-scitani-a-odcitani-do-100" },
  "Násobení a dělení (rozšíření)": { emoji: "✖️", imageKey: "topic-math-nasobeni-a-deleni" },
  "Úhly": { emoji: "📐", imageKey: "topic-math-geometricke-tvary" },
  "Osová souměrnost": { emoji: "🦋", imageKey: "topic-math-geometricke-tvary" },
};

// ── ČEŠTINA CATEGORIES ──────────────────────────────────────

const CZ_CATEGORY_VISUALS: Record<string, PrvoukaVisual> = {
  "Vyjmenovaná slova": {
    emoji: "📖",
    colorClass: "border-[hsl(var(--cz-vyjm))]",
    bgClass: "bg-[hsl(var(--cz-vyjm-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--cz-vyjm-bg))]",
    imageKey: "cat-cz-vyjmenovana-slova",
  },
  "Pravopis": {
    emoji: "✏️",
    colorClass: "border-[hsl(var(--cz-pravopis))]",
    bgClass: "bg-[hsl(var(--cz-pravopis-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--cz-pravopis-bg))]",
    imageKey: "cat-cz-pravopis",
  },
  "Mluvnice": {
    emoji: "📝",
    colorClass: "border-[hsl(var(--cz-mluvnice))]",
    bgClass: "bg-[hsl(var(--cz-mluvnice-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--cz-mluvnice-bg))]",
    imageKey: "cat-cz-mluvnice",
  },
  "Diktát": {
    emoji: "🎧",
    colorClass: "border-[hsl(var(--cz-diktat))]",
    bgClass: "bg-[hsl(var(--cz-diktat-bg))]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--cz-diktat-bg))]",
    imageKey: "cat-cz-diktat",
  },
};

const CZ_TOPIC_VISUALS: Record<string, { emoji: string; imageKey: string; ext?: string }> = {
  "Vyjmenovaná slova po B": { emoji: "🅱️", imageKey: "topic-cz-vyjm-b" },
  "Vyjmenovaná slova po L": { emoji: "🇱", imageKey: "topic-cz-vyjm-l" },
  "Vyjmenovaná slova po M": { emoji: "Ⓜ️", imageKey: "topic-cz-vyjm-m" },
  "Vyjmenovaná slova po P": { emoji: "🅿️", imageKey: "topic-cz-vyjm-p" },
  "Vyjmenovaná slova po S": { emoji: "🔤", imageKey: "topic-cz-vyjm-s" },
  "Vyjmenovaná slova po V": { emoji: "✌️", imageKey: "topic-cz-vyjm-v" },
  "Vyjmenovaná slova po Z": { emoji: "💤", imageKey: "topic-cz-vyjm-z" },
  "Párové souhlásky": { emoji: "🔀", imageKey: "topic-cz-parove-souhlasky" },
  "Tvrdé a měkké souhlásky": { emoji: "🧊", imageKey: "topic-cz-tvrde-mekke" },
  "Psaní velkých písmen": { emoji: "🔠", imageKey: "topic-cz-velka-pismena" },
  "Slovní druhy": { emoji: "🏷️", imageKey: "topic-cz-slovni-druhy" },
  "Rod a číslo podstatných jmen": { emoji: "👤", imageKey: "topic-cz-rod-cislo" },
  "Určování sloves": { emoji: "🏃", imageKey: "topic-cz-slovesa-urcovani" },
  "Základ věty": { emoji: "📋", imageKey: "topic-cz-zaklad-vety" },
  "Doplňovací diktát": { emoji: "✍️", imageKey: "topic-cz-diktat" },
  // 4. ročník
  "Pády podstatných jmen": { emoji: "📝", imageKey: "topic-cz-pady", ext: "jpg" },
  "Vzory podstatných jmen": { emoji: "📖", imageKey: "topic-cz-vzory", ext: "jpg" },
  "Stavba slova": { emoji: "🧱", imageKey: "topic-cz-stavba-slova", ext: "jpg" },
  "Koncovky podstatných jmen": { emoji: "🎯", imageKey: "topic-cz-pravopis" },
};

// ── PŘÍRODOVĚDA CATEGORIES (4. ročník) ──────────────────────

const PRIRODOVEDA_CATEGORY_VISUALS: Record<string, PrvoukaVisual> = {
  "Živá příroda": {
    emoji: "🌳",
    colorClass: "border-[hsl(140,50%,45%)]",
    bgClass: "bg-[hsl(140,60%,95%)]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(140,60%,95%)]",
  },
  "Neživá příroda": {
    emoji: "🪨",
    colorClass: "border-[hsl(200,40%,50%)]",
    bgClass: "bg-[hsl(200,50%,95%)]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(200,50%,95%)]",
  },
};

const PRIRODOVEDA_TOPIC_VISUALS: Record<string, { emoji: string; imageKey: string; ext?: string }> = {
  "Ekosystémy": { emoji: "🌳", imageKey: "topic-zvirata" },
  "Potravní řetězce": { emoji: "🔗", imageKey: "topic-pr-potravni-retezce", ext: "jpg" },
  "Voda a její skupenství": { emoji: "💧", imageKey: "topic-pr-kolob-vody", ext: "jpg" },
  "Horniny a nerosty": { emoji: "🪨", imageKey: "topic-pr-horniny", ext: "jpg" },
};

// ── VLASTIVĚDA CATEGORIES (4. ročník) ───────────────────────

const VLASTIVEDA_CATEGORY_VISUALS: Record<string, PrvoukaVisual> = {
  "Zeměpis ČR": {
    emoji: "🗺️",
    colorClass: "border-[hsl(38,60%,50%)]",
    bgClass: "bg-[hsl(38,70%,95%)]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(38,70%,95%)]",
  },
  "Historie a kultura": {
    emoji: "🏰",
    colorClass: "border-[hsl(25,55%,50%)]",
    bgClass: "bg-[hsl(25,60%,95%)]",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(25,60%,95%)]",
  },
};

const VLASTIVEDA_TOPIC_VISUALS: Record<string, { emoji: string; imageKey: string; ext?: string }> = {
  "Kraje České republiky": { emoji: "🗺️", imageKey: "topic-ceska-republika" },
  "Orientace na mapě": { emoji: "🧭", imageKey: "topic-svetove-strany-a-mapa" },
  "České pověsti a osobnosti": { emoji: "🏰", imageKey: "topic-vl-povesti", ext: "jpg" },
  "Státní symboly ČR": { emoji: "🇨🇿", imageKey: "topic-vl-symboly", ext: "jpg" },
};

// ── ALL SUBJECTS MAP ───────────────────────────────────────

const CATEGORY_VISUALS_BY_SUBJECT: Record<string, Record<string, PrvoukaVisual>> = {
  "prvouka": PRVOUKA_CATEGORY_VISUALS,
  "matematika": MATH_CATEGORY_VISUALS,
  "čeština": CZ_CATEGORY_VISUALS,
  "přírodověda": PRIRODOVEDA_CATEGORY_VISUALS,
  "vlastivěda": VLASTIVEDA_CATEGORY_VISUALS,
};

const TOPIC_VISUALS_BY_SUBJECT: Record<string, Record<string, { emoji: string; imageKey: string; ext?: string }>> = {
  "prvouka": PRVOUKA_TOPIC_VISUALS,
  "matematika": MATH_TOPIC_VISUALS,
  "čeština": CZ_TOPIC_VISUALS,
  "přírodověda": PRIRODOVEDA_TOPIC_VISUALS,
  "vlastivěda": VLASTIVEDA_TOPIC_VISUALS,
};

// ── PUBLIC API ──────────────────────────────────────────────

export function getPrvoukaCategoryVisual(subject: string, category: string): PrvoukaVisual | null {
  return CATEGORY_VISUALS_BY_SUBJECT[subject]?.[category] ?? null;
}

export function getPrvoukaTopicEmoji(subject: string, category: string, topic: string): string | null {
  const topicVisuals = TOPIC_VISUALS_BY_SUBJECT[subject];
  const categoryVisuals = CATEGORY_VISUALS_BY_SUBJECT[subject];
  return topicVisuals?.[topic]?.emoji ?? categoryVisuals?.[category]?.emoji ?? null;
}

export function getPrvoukaTopicImageUrl(subject: string, topic: string): string | null {
  const topicVisuals = TOPIC_VISUALS_BY_SUBJECT[subject];
  const visual = topicVisuals?.[topic];
  return visual ? imageUrl(visual.imageKey, visual.ext ?? "png") : null;
}

export function getPrvoukaCategoryImageUrl(subject: string, category: string): string | null {
  const categoryVisuals = CATEGORY_VISUALS_BY_SUBJECT[subject];
  const visual = categoryVisuals?.[category];
  return visual?.imageKey ? imageUrl(visual.imageKey) : null;
}

export function getPrvoukaTopicVisual(subject: string, category: string): PrvoukaVisual | null {
  return getPrvoukaCategoryVisual(subject, category);
}

export function getTopicIllustrationUrl(topic: { subject: string; category: string; topic: string }): string | null {
  return getPrvoukaTopicImageUrl(topic.subject, topic.topic)
    ?? getPrvoukaCategoryImageUrl(topic.subject, topic.category);
}
