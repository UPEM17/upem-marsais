import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const contentDir = path.join(process.cwd(), "upem-app", "content");

function readContent(folder: string) {
  const dirPath = path.join(contentDir, folder);
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(dirPath, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title || "Sans titre",
        date: data.date || null,
        cover: data.cover || data.image || null,
        lieu: data.lieu || null,
        body: marked.parse(content),
      };
    });
}

export function getPosts() {
  return readContent("posts");
}
export function getEvents() {
  return readContent("events");
}
export function getMinutes() {
  return readContent("minutes");
}

export function getBySlug(slug: string) {
  const folders = ["posts", "events", "minutes"];
  for (const folder of folders) {
    const list = readContent(folder);
    const found = list.find((p) => p.slug === slug);
    if (found) return found;
  }
  return null;
}

export function getAllSlugs() {
  const folders = ["posts", "events", "minutes"];
  return folders
    .flatMap((folder) => {
      const dirPath = path.join(contentDir, folder);
      if (!fs.existsSync(dirPath)) return [];
      return fs
        .readdirSync(dirPath)
        .filter((file) => file.endsWith(".md"))
        .map((file) => ({ slug: file.replace(/\.md$/, "") }));
    });
}
