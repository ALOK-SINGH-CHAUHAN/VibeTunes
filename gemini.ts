import { GoogleGenAI } from "@google/genai";
import { MoodAnalysis } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeMoodWithAI(moodPrompt: string): Promise<MoodAnalysis> {
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
- "upbeat morning vibes" → high energy, high valence, medium danceability
- "melancholy rainy day" → low energy, low valence, low danceability
- "workout motivation" → very high energy, high valence, high danceability`;

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
      const analysis: MoodAnalysis = JSON.parse(rawJson);
      return analysis;
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error("Gemini AI analysis error:", error);
    throw new Error(`Failed to analyze mood: ${error}`);
  }
}