import { Track, MoodAnalysis } from "@shared/schema";

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
}

let cachedToken: { token: string; expires: number } | null = null;

async function getSpotifyToken(): Promise<string> {
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
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.statusText}`);
  }

  const data: SpotifyToken = await response.json();
  
  // Cache token for 55 minutes (expires in 60 minutes)
  cachedToken = {
    token: data.access_token,
    expires: now + (55 * 60 * 1000)
  };

  return data.access_token;
}

export async function searchSpotifyTracks(analysis: MoodAnalysis): Promise<Track[]> {
  try {
    const token = await getSpotifyToken();
    
    // Build search query based on mood analysis
    const genres = analysis.genres.slice(0, 2).join(",");
    const keywords = analysis.keywords.slice(0, 3).join(" ");
    const searchQuery = `${keywords} genre:${genres}`;

    // Get audio features parameters
    const targetEnergy = analysis.energy;
    const targetValence = analysis.valence;
    const targetDanceability = analysis.danceability;

    const response = await fetch(
      `https://api.spotify.com/v1/search?` + 
      new URLSearchParams({
        q: searchQuery,
        type: "track",
        limit: "50"
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks?.items || [];

    // Convert to our Track format and filter/sort by relevance
    const convertedTracks: Track[] = tracks
      .filter((track: SpotifyTrack) => track.preview_url) // Only tracks with preview
      .map((track: SpotifyTrack): Track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(", "),
        album: track.album.name,
        albumArt: track.album.images[0]?.url || "",
        duration: track.duration_ms,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify
      }))
      .slice(0, 15); // Get top 15 tracks

    return convertedTracks;
  } catch (error) {
    console.error("Spotify search error:", error);
    throw new Error(`Failed to search Spotify: ${error}`);
  }
}