import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Mood-based playlist types
export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl?: string;
  spotifyUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  moodPrompt: string;
  createdAt: string;
}

export interface MoodAnalysis {
  energy: number; // 0-1
  valence: number; // 0-1 (positive to negative)
  danceability: number; // 0-1
  genres: string[];
  tempo: string; // slow, medium, fast
  mood: string;
  keywords: string[];
}

// Schema for mood input
export const moodInputSchema = z.object({
  prompt: z.string().min(3, "Please describe your mood or vibe").max(500, "Description too long"),
});

export type MoodInput = z.infer<typeof moodInputSchema>;