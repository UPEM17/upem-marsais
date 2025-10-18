// upem-app/lib/content.ts
import fs from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  date: string;        // ISO
  image?: string;
  excerpt?: string;
  body?: string;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "upem-app", "content");

function readDirSafe(p: string) {
  try { return fs.readdirSync(p); } catch { return []; }
}

function readFileSafe(p: string) {
  try { return fs.readFileSync(p, "utf8"); } catch { return ""; }
}

function parseFrontmatter(src: string) {
  // très simple: lit un frontmatter YAML minimal entre --- ... ---
  const m = src.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!m) return { data: {} as any, body: src };
  const yaml = Object.fromEntries(
    m[1]
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => {
        const i = l.indexOf(":");
        if (i === -1) return ["", ""];
        const k = l.slice(0, i).trim();
        const v = l.slice(i + 1).trim().replace(/^"|"$/g, "");
        return [k, v];
      })
  );
  return { data: yaml, body: m[2] };
}

function loadCollection(folder: string): Post[] {
  const dir = path.join(CONTENT_DIR, folder);
  const files = readDirSafe(dir).filter(f => f.endsWith(".md"));
  const items: Post[] = files.map(filename => {
    const slug = filename.replace(/\.md$/, "");
    const raw = readFileSafe(path.join(dir, filename));
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: (data.title || slug) as string,
      date: (data.date || new Date().toISOString()) as string,
      image: data.image as string | undefined,
      excerpt: data.excerpt as string | undefined,
      body,
    };
  });
  // tri du plus récent au plus ancien
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Collections */
export function getPosts(): Post[] {
  return loadCollection("posts");
}

export function getEvents(): Post[] {
  return loadCollection("events");
}

export function getMinutes(): Post[] {
  return loadCollection("minutes");
}

export function getCommandes(): Post[] {
  return loadCollection("commandes");
}

export function getGalerie(): Post[] {
  return loadCollection("galerie");
}

/** Articles par slug (toutes collections confondues) */
export function getAllArticles(): Post[] {
  return [
    ...getPosts(),
    ...getEvents(),
    ...getMinutes(),
    ...getCommandes(),
  ];
}

export function getArticleBySlug(slug: string): Post | undefined {
  return getAllArticles().find(p => p.slug === slug);
}

/** Les slugs pour /article/[slug] */
export function getAllSlugs(): string[] {
  return getAllArticles().map(p => p.slug);
}
