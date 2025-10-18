import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date?: string;
  image?: string;     // alias historique
  cover?: string;     // utilisé par les pages -> on le remplit depuis image si besoin
  lieu?: string;      // optionnel (événements)
  excerpt?: string;
  body?: string;      // HTML rendu pour la page détail
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "upem-app", "content");

function readCollection(dirName: string): Post[] {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const full = path.join(dir, f);
      const file = fs.readFileSync(full, "utf8");
      const { data, content } = matter(file);

      const slug = f.replace(/\.md$/, "");
      const title: string = (data.title ?? slug).toString();
      const date: string | undefined = data.date ? String(data.date) : undefined;
      const image: string | undefined = data.image ? String(data.image) : undefined;
      const cover: string | undefined = data.cover ? String(data.cover) : image; // cover tombe à image

      const lieu: string | undefined = data.lieu ? String(data.lieu) : undefined;
      const excerpt: string | undefined = data.excerpt
        ? String(data.excerpt)
        : content.trim().slice(0, 160);

      return { slug, title, date, image, cover, lieu, excerpt };
    })
    // tri anté-chronologique si date présente
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getPosts(): Post[] {
  return readCollection("posts");
}

export function getEvents(): Post[] {
  return readCollection("events");
}

export function getMinutes(): Post[] {
  return readCollection("minutes");
}

export function getCommands(): Post[] {
  return readCollection("commandes");
}

export function getGallery(): Post[] {
  return readCollection("galerie");
}

export function getBySlug(slug: string): Post | null {
  // on cherche dans toutes les collections qui ont des articles
  for (const col of ["posts", "events", "minutes", "commandes"]) {
    const file = path.join(CONTENT_DIR, col, `${slug}.md`);
    if (fs.existsSync(file)) {
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const title: string = (data.title ?? slug).toString();
      const date: string | undefined = data.date ? String(data.date) : undefined;
      const image: string | undefined = data.image ? String(data.image) : undefined;
      const cover: string | undefined = data.cover ? String(data.cover) : image;
      const lieu: string | undefined = data.lieu ? String(data.lieu) : undefined;

      const html = marked.parse(content);
      return {
        slug,
        title,
        date,
        image,
        cover,
        lieu,
        body: typeof html === "string" ? html : String(html),
      };
    }
  }
  return null;
}

export function getAllSlugs(): string[] {
  const cols = ["posts", "events", "minutes", "commandes"];
  const set = new Set<string>();
  for (const c of cols) {
    for (const p of readCollection(c)) set.add(p.slug);
  }
  return [...set];
}
