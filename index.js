// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/gemini.ts
import { GoogleGenAI } from "@google/genai";
var ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
async function analyzeMoodWithAI(moodPrompt) {
  try {
    const systemPrompt = `You are a music mood analyst. Analyze the user's mood description and extract musical preferences.
Respond with JSON in this exact format:
{
  "energy": number (0-1, where 0 is very low energy, 1 is very high energy),
  "valence": number (0-1, where 0 is very negative/sad, 1 is very positive/happy),
  "danceability": number (0-1, where 0 is not danceable, 1 is very danceable),
  "genres": array of strings (up to 3 most relevant genres),
  "tempo": string (one of: "slow", "medium", "fast"),
  "mood": string (concise mood description),
  "keywords": array of strings (up to 5 relevant keywords)
}

Examples:
- "upbeat morning vibes" \u2192 high energy, high valence, medium danceability
- "melancholy rainy day" \u2192 low energy, low valence, low danceability
- "workout motivation" \u2192 very high energy, high valence, high danceability`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            energy: { type: "number" },
            valence: { type: "number" },
            danceability: { type: "number" },
            genres: { type: "array", items: { type: "string" } },
            tempo: { type: "string" },
            mood: { type: "string" },
            keywords: { type: "array", items: { type: "string" } }
          },
          required: ["energy", "valence", "danceability", "genres", "tempo", "mood", "keywords"]
        }
      },
      contents: `Analyze this mood: "${moodPrompt}"`
    });
    const rawJson = response.text;
    if (rawJson) {
      const analysis = JSON.parse(rawJson);
      return analysis;
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error("Gemini AI analysis error:", error);
    throw new Error(`Failed to analyze mood: ${error}`);
  }
}

// server/spotify.ts
var cachedToken = null;
async function getSpotifyToken() {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expires) {
    return cachedToken.token;
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
    },
    body: "grant_type=client_credentials"
  });
  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.statusText}`);
  }
  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expires: now + 55 * 60 * 1e3
  };
  return data.access_token;
}
async function searchSpotifyTracks(analysis) {
  try {
    const token = await getSpotifyToken();
    const genres = analysis.genres.slice(0, 2).join(",");
    const keywords = analysis.keywords.slice(0, 3).join(" ");
    const searchQuery = `${keywords} genre:${genres}`;
    const targetEnergy = analysis.energy;
    const targetValence = analysis.valence;
    const targetDanceability = analysis.danceability;
    const response = await fetch(
      `https://api.spotify.com/v1/search?` + new URLSearchParams({
        q: searchQuery,
        type: "track",
        limit: "50"
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.statusText}`);
    }
    const data = await response.json();
    const tracks = data.tracks?.items || [];
    const convertedTracks = tracks.filter((track) => track.preview_url).map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || "",
      duration: track.duration_ms,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify
    })).slice(0, 15);
    return convertedTracks;
  } catch (error) {
    console.error("Spotify search error:", error);
    throw new Error(`Failed to search Spotify: ${error}`);
  }
}

// server/routes.ts
import { z } from "zod";
var moodRequestSchema = z.object({
  mood: z.string().min(3).max(500)
});
async function registerRoutes(app2) {
  app2.post("/api/generate-playlist", async (req, res) => {
    try {
      const { mood } = moodRequestSchema.parse(req.body);
      console.log("Analyzing mood with AI:", mood);
      const analysis = await analyzeMoodWithAI(mood);
      console.log("Mood analysis result:", analysis);
      console.log("Searching Spotify tracks...");
      const tracks = await searchSpotifyTracks(analysis);
      console.log(`Found ${tracks.length} tracks`);
      const playlist = {
        id: `playlist-${Date.now()}`,
        name: `${analysis.mood} Vibes`,
        description: `A personalized playlist for your "${mood}" mood, featuring ${analysis.genres.join(", ")} music with ${analysis.tempo} tempo and ${analysis.energy > 0.7 ? "high" : analysis.energy > 0.4 ? "medium" : "low"} energy.`,
        tracks,
        moodPrompt: mood,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(playlist);
    } catch (error) {
      console.error("Playlist generation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mood input", details: error.errors });
      }
      res.status(500).json({
        error: "Failed to generate playlist",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
