import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeMoodWithAI } from "./gemini";
import { searchSpotifyTracks } from "./spotify";
import { Playlist } from "@shared/schema";
import { z } from "zod";

const moodRequestSchema = z.object({
  mood: z.string().min(3).max(500)
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post('/api/generate-playlist', async (req, res) => {
    try {
      const { mood } = moodRequestSchema.parse(req.body);
      
      // Step 1: Analyze mood with Gemini AI
      console.log('Analyzing mood with AI:', mood);
      const analysis = await analyzeMoodWithAI(mood);
      console.log('Mood analysis result:', analysis);
      
      // Step 2: Search for tracks on Spotify
      console.log('Searching Spotify tracks...');
      const tracks = await searchSpotifyTracks(analysis);
      console.log(`Found ${tracks.length} tracks`);
      
      // Step 3: Create playlist
      const playlist: Playlist = {
        id: `playlist-${Date.now()}`,
        name: `${analysis.mood} Vibes`,
        description: `A personalized playlist for your "${mood}" mood, featuring ${analysis.genres.join(', ')} music with ${analysis.tempo} tempo and ${analysis.energy > 0.7 ? 'high' : analysis.energy > 0.4 ? 'medium' : 'low'} energy.`,
        tracks,
        moodPrompt: mood,
        createdAt: new Date().toISOString()
      };
      
      res.json(playlist);
    } catch (error) {
      console.error('Playlist generation error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid mood input', details: error.errors });
      }
      
      res.status(500).json({ 
        error: 'Failed to generate playlist', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
