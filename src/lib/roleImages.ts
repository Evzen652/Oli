const p = (prompt: string, seed: number) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&model=flux&nologo=true&seed=${seed}`;

export const ROLE_IMAGES = {
  parent: p(
    "friendly adult parent smiling warmly, Pixar 3D cartoon style, soft emerald green background, centered character portrait, no text, no words, clean simple illustration",
    42
  ),
  child: p(
    "cute cheerful schoolchild with purple backpack, Pixar 3D cartoon style, soft violet purple background, centered character portrait, no text, no words, clean simple illustration",
    7
  ),
};
