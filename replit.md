# Mood-Based Playlist Generator

A React + Express application that generates personalized Spotify playlists based on mood descriptions using AI.

## Overview
- **Frontend**: React with TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript 
- **AI Integration**: Google Gemini for mood analysis
- **Music API**: Spotify Web API for track search
- **Database**: PostgreSQL with Drizzle ORM (in-memory storage by default)

## Recent Changes (2025-09-24)
- ✅ Reorganized project structure from flat files to proper client/server directories
- ✅ Fixed all component imports and implementations
- ✅ Configured Vite for Replit proxy with host: "0.0.0.0" and port 5000
- ✅ Set up development workflow running on port 5000
- ✅ Added ThemeProvider for dark/light mode support
- ✅ Configured deployment for autoscale target

## Project Architecture
- `client/`: React frontend application
  - `src/components/ui/`: Reusable UI components (MoodInput, PlaylistDisplay, TrackCard, etc.)
  - `src/pages/`: Page components (Home, NotFound)
  - `src/lib/`: Utility functions and configurations
  - `src/hooks/`: Custom React hooks
- `server/`: Express backend
  - `index.ts`: Main server setup
  - `routes.ts`: API route definitions
  - `gemini.ts`: AI mood analysis integration
  - `spotify.ts`: Spotify API integration
  - `storage.ts`: Data storage abstraction
- `shared/`: Shared types and schemas

## User Preferences
- Clean, modern UI with Radix UI components
- TypeScript for type safety
- Modular component architecture
- Uses in-memory storage by default for simplicity

## Environment Setup
The application requires:
- `GEMINI_API_KEY` - Google Gemini API key for mood analysis
- `SPOTIFY_CLIENT_ID` - Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify app client secret
- Optional: `DATABASE_URL` - PostgreSQL connection (uses in-memory storage if not provided)

## Development
- Run `npm run dev` to start the development server
- Frontend and backend are served together on port 5000
- Hot reload enabled for both frontend and backend changes