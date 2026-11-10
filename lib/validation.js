import { z } from "zod";
import { budgets, cities, projectTypes } from "@/lib/content";
import { galleryCategories } from "@/lib/seed-data.mjs";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const phonePattern = /^[+()\-\s\d]{8,20}$/;
const mediaUrl = z
  .string()
  .trim()
  .min(1, "Add a file or a link.")
  .max(600, "That address is too long.");

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please give us a name to call you by.")
    .max(120, "That name is too long."),
  phone: z
    .string()
    .trim()
    .min(8, "A phone number we can actually reach you on.")
    .max(20, "That number is too long.")
    .regex(phonePattern, "Digits, spaces and + only, please."),
  email: z
    .string()
    .trim()
    .max(160)
    .refine(
      (value) => value === "" || emailPattern.test(value),
      "That email does not look right."
    ),
  projectType: z.enum(projectTypes),
  city: z.enum(cities),
  budget: z.enum(budgets),
  message: z
    .string()
    .trim()
    .min(12, "A sentence or two about the room helps us reply properly.")
    .max(2000, "Please keep it under 2000 characters."),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const statusSchema = z.enum(["new", "contacted", "quoted", "won", "lost"]);

export const updateLeadSchema = z.object({
  status: statusSchema.optional(),
  adminNote: z.string().max(2000).optional(),
});

const galleryImageSchema = z.object({
  url: mediaUrl,
  alt: z.string().trim().max(200).default(""),
  caption: z.string().trim().max(200).default(""),
});

export const galleryItemSchema = z.object({
  title: z.string().trim().min(2, "Give the project a name.").max(120),
  category: z.enum(galleryCategories),
  typeLabel: z.string().trim().max(40).default(""),
  place: z.string().trim().min(2, "Where is it?").max(80),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Four digits, like 2026."),
  summary: z.string().trim().max(300).default(""),
  description: z.string().trim().max(1200).default(""),
  cover: mediaUrl,
  coverAlt: z.string().trim().max(200).default(""),
  images: z.array(galleryImageSchema).max(30).default([]),
  published: z.boolean().default(true),
});

export const videoEntrySchema = z.object({
  title: z.string().trim().min(2, "Give the film a title.").max(140),
  place: z.string().trim().max(80).default(""),
  recordedOn: z.string().trim().max(40).default(""),
  duration: z.string().trim().max(12).default(""),
  note: z.string().trim().max(300).default(""),
  description: z.string().trim().max(800).default(""),
  poster: mediaUrl,
  posterAlt: z.string().trim().max(200).default(""),
  source: z.enum(["file", "youtube", "vimeo"]).default("file"),
  src: z.string().trim().min(1, "Point to a video file or a link.").max(600),
  published: z.boolean().default(true),
});

export const publishedSchema = z.object({ published: z.boolean() });

export const reorderSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1).max(200),
});

export function fieldIssues(error) {
  const issues = {};
  for (const issue of error.issues) {
    const key = issue.path?.filter((part) => typeof part === "string").at(0);
    const name = key || "form";
    if (!issues[name]) issues[name] = issue.message;
  }
  return issues;
}
