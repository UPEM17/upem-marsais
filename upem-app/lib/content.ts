import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();

// Dossiers de contenu (dans le repo)
const DIR_POSTS   = path.join(ROOT, "upem-app", "content", "posts");
const DIR_EVENTS  = path.join(ROOT, "upem-app", "content", "events");
const DIR_MINUTES = path.join(ROOT, "upem-app", "content", "minutes");

export type BaseDoc = {
  type: "post" | "event" | "minute";
  slug: string;
  title: string;
  date?: string;
  cover?: string;
  images?: string[];
  body?: string; // HTML
};

export type EventDoc = BaseDoc & { type: "event"; lieu?: string };
export type MinuteDoc = BaseDoc & { type: "minute"; fichier?: string };
export type PostDoc = BaseDoc & { type: "post" };
export type AnyDoc = PostDoc | EventDoc | MinuteDoc;

function listMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function mdToHtml(md: string): string {
  return marked.parse(md) as string;
}

function readOne(fileAbs: string, type: AnyDoc["type"]): AnyDoc {
  const raw = fs.readFileSync(fileAbs, "utf8");
  const { data, content } = matter(raw);

  const slug = path.basename(fileAbs, ".md");

  // champs communs
  const base: BaseDoc = {
    type,
    slug,
    title: (data.title ?? slug) as string,
    date: data.date ? String(data.date) : undefined,
    cover: data.image ? String(data.image) : data.cover ? String(data.cover) : undefined,
    images: Array.isArray(data.images) ? (data.images as string[]) : undefined,
    body: content ? mdToHtml(content) : undefined,
  };

  if (type === "event") {
    return { ...base, type: "event", lieu: data.lieu ? String(data.lieu) : undefined };
  }
  if (type === "minute") {
    return { ...base, type: "minute", fichier: data.fichier ? String(data.fichier) : undefined };
  }
  return { ...base, type: "post" };
}

// --- Exports utilisés par les pages ---

export function getPosts(): PostDoc[] {
  return listMdFiles(DIR_POSTS)
    .map((f) => readOne(path.join(DIR_POSTS, f), "post") as PostDoc)
    .sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : 0));
}

export function getEvents(): EventDoc[] {
  return listMdFiles(DIR_EVENTS)
    .map((f) => readOne(path.join(DIR_EVENTS, f), "event") as EventDoc)
    .sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : 0));
}

export function getMinutes(): MinuteDoc[] {
  return listMdFiles(DIR_MINUTES)
    .map((f) => readOne(path.join(DIR_MINUTES, f), "minute") as MinuteDoc)
    .sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : 0));
}

// Slugs pour SSG
export function getAllSlugs(): string[] {
  const p = listMdFiles(DIR_POSTS).map((f) => path.basename(f, ".md"));
  const e = listMdFiles(DIR_EVENTS).map((f) => path.basename(f, ".md"));
  const m = listMdFiles(DIR_MINUTES).map((f) => path.basename(f, ".md"));
  return [...new Set([...p, ...e, ...m])];
}

export function getBySlug(slug: string): AnyDoc | null {
  const candidates: Array<{ dir: string; type: AnyDoc["type"] }> = [
    { dir: DIR_POSTS, type: "post" },
    { dir: DIR_EVENTS, type: "event" },
    { dir: DIR_MINUTES, type: "minute" },
  ];
  for (const { dir, type } of candidates) {
    const file = path.join(dir, `${slug}.md`);
    if (fs.existsSync(file)) {
      return readOne(file, type);
    }
  }
  return null;
}
