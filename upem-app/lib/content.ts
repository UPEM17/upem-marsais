// upem-app/lib/content.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type Doc = {
  slug: string;
  title: string;
  date?: string | null;
  image?: string | null;
  body?: string;
};

function ensureDir(dir: string) {
  const full = path.join(ROOT, dir);
  return fs.existsSync(full) ? full : null;
}

function listMdFiles(dir: string): string[] {
  const full = ensureDir(dir);
  if (!full) return [];
  return fs.readdirSync(full).filter((f) => f.toLowerCase().endsWith(".md"));
}

function readOne(dir: string, file: string): Doc {
  const full = path.join(ROOT, dir, file);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/i, "");

  return {
    slug,
    title: (data.title ?? data.Titre ?? "Sans titre").toString(),
    date: (data.date ?? data.Date ?? null) as string | null,
    image: (data.image ?? data.Image ?? null) as string | null,
    body: content,
  };
}

export function getCollection(
  dir: "events" | "minutes" | "posts" | "commandes" | "galerie"
): Doc[] {
  const files = listMdFiles(dir);
  const docs = files.map((f) => readOne(dir, f));
  // tri décroissant par date si présente
  return docs.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}
