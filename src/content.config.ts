import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

/* Every piece of content lives in src/data/*.json. Add a book, a song, a show or
   a product by adding an object there — the pages render from these collections. */

const books = defineCollection({
  loader: file("src/data/books.json"),
  schema: z.object({
    id: z.string(),            // slug, also the wallsofazu.com path and the asset name
    no: z.string(),            // "001"
    title: z.string(),
    cover: z.string().optional(),   // defaults to /assets/img/book-<id>.jpg
    pdf: z.string().optional(),     // defaults to /assets/books/<id>.pdf
    epub: z.string().optional(),    // defaults to /assets/books/<id>.epub
    read: z.string().optional(),    // defaults to https://wallsofazu.com/<id>/
  }),
});

const songs = defineCollection({
  loader: file("src/data/songs.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    note: z.string().optional(),    // "lyric video", "music video"…
    book: z.string().optional(),    // id of the book that tells its story
    video: z.string().optional(),   // id of the video
    latest: z.boolean().optional(),
  }),
});

const videos = defineCollection({
  loader: file("src/data/videos.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    kind: z.string(),              // "Lyric video" | "Music video" | "Live"
    poster: z.string(),
    seq: z.array(z.string()),      // one or more mp4s, played in sequence
    url: z.string(),               // where "Watch" goes (YouTube)
    featured: z.boolean().optional(),
  }),
});

const shows = defineCollection({
  loader: file("src/data/shows.json"),
  schema: z.object({
    id: z.string(),
    date: z.string(),              // ISO date
    city: z.string(),
    venue: z.string(),
    meta: z.string().optional(),   // "Doors 20:00"
    status: z.enum(["presale", "onsale", "soldout", "waitlist"]).default("onsale"),
    tickets: z.string().optional(),
  }),
});

const products = defineCollection({
  loader: file("src/data/products.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    meta: z.string(),
    price: z.string().optional(),  // undefined = "TBA"
    image: z.string(),
    url: z.string().optional(),    // hosted checkout page
    badge: z.string().optional(),
    soon: z.boolean().optional(),
  }),
});

export const collections = { books, songs, videos, shows, products };
