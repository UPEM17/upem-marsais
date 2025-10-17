import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Doc = {
  slug: string;
  title: string;
  date: string; // ISO
  summary?: string;
  cover?: string; // chemin vers miniature
  tags?: string[];
  images?: string[]; // pour galerie
  content: string; // markdown
};

function readCollection(dir: string): Doc[]{
  const root = path.join(process.cwd(), 'content', dir);
  if(!fs.existsSync(root)) return [];
  return fs.readdirSync(root)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(root, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        date: (data.date || new Date().toISOString()),
        summary: data.summary || '',
        cover: data.cover || (data.images?.[0] ?? ''),
        tags: data.tags || [],
        images: data.images || [],
        content
      } as Doc;
    })
    .sort((a,b)=> (a.date<b.date?1:-1));
}

export const getPosts = ()=> readCollection('posts');
export const getEvents = ()=> readCollection('events');
export const getMinutes = ()=> readCollection('minutes');
export const getGalleryItems = ()=>{
  const posts = [...getPosts(), ...getEvents(), ...getMinutes()];
  const fromDocs = posts.flatMap(d => (d.images||[]).map(src => ({src, from: d.slug})));
  const galleryDir = path.join(process.cwd(), 'content', 'gallery');
  let fromFolder: {src:string, from:string}[] = [];
  if (fs.existsSync(galleryDir)){
    fromFolder = fs.readdirSync(galleryDir)
      .filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
      .map(f => ({src: `/uploads/${f}`, from: 'gallery'}));
  }
  const seen = new Set<string>();
  const all = [...fromDocs, ...fromFolder].filter(g => {
    if(seen.has(g.src)) return false; seen.add(g.src); return true;
  });
  return all;
}
