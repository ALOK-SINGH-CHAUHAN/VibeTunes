# AI Mood-Based Playlist Generator - Setup Instructions

## Overview
This is a Next.js web application that uses Google's Gemini AI to interpret mood descriptions and generate personalized Spotify playlists based on the user's current mood or activity.

## Prerequisites
- Node.js 18+ installed
- Spotify Developer Account
- Google AI Studio Account (for Gemini API)
- Z.ai Web Dev SDK (already installed)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
npm install @google/generative-ai
```

### 2. Spotify API Setup

1. **Create Spotify Developer Account**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account
   - Accept the terms and conditions

2. **Create a New App**
   - Click "Create an App"
   - Fill in:
     - App name: "Mood Playlist Generator"
     - App description: "AI-powered mood-based playlist generator"
     - Check "I agree to the Spotify Developer Terms of Service"
   - Click "Create"

3. **Get Your Credentials**
   - From your app dashboard, copy:
     - **Client ID**
     - **Client Secret** (click "Show client secret")

4. **Configure Redirect URI**
   - In your app settings, go to "Edit Settings"
   - Add "Redirect URIs":
     - `http://localhost:3000/callback`
   - Click "Save"

### 3. Gemini API Setup

1. **Get Gemini API Access**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Log in with your Google account

2. **Get API Key**
   - Click on "Get API Key" in the top menu
   - Click "Create API Key"
   - Choose "Create API key in new project"
   - Copy your API key (it will look like: `AIzaSy...`)

### 4. Environment Configuration

1. **Create Environment File**
   - Copy the template from `.env.local` (already created)
   - Replace the placeholder values with your actual credentials:

   ```env
   # Spotify API Credentials
   SPOTIFY_CLIENT_ID=your_actual_client_id
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

   # Gemini API Credentials
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```

### 5. Run the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - You should see the Mood Playlist Generator interface

## How to Use

1. **Describe Your Mood**
   - In the text area, describe how you're feeling or what activity you're doing
   - Examples:
     - "I'm feeling energetic and want to workout"
     - "Need relaxing music for studying"
     - "Happy and upbeat for morning routine"
     - "Melancholic rainy day vibes"

2. **Generate Playlist**
   - Click "Generate Playlist"
   - Gemini AI will interpret your mood and extract relevant search terms
   - The app will search Spotify for tracks matching those terms
   - Wait for the playlist to be generated

3. **Enjoy Your Playlist**
   - View the generated tracks with album art
   - Click the play button to preview tracks (if available)
   - Click "Open in Spotify" to listen to the full playlist

## Features

### Core Features
- ✅ Natural language mood input processing
- ✅ Gemini AI integration for mood interpretation
- ✅ Spotify API integration for track search
- ✅ Beautiful, responsive UI with dark mode support
- ✅ Track preview functionality
- ✅ Direct links to Spotify
- ✅ Demo mode when APIs aren't configured

### Technical Implementation
- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API routes
- **AI Integration**: Google Gemini API
- **Music API**: Spotify Web API

## Demo Mode

If you haven't configured the APIs yet, the app will run in demo mode:
- Shows placeholder tracks based on mood keywords
- Displays a "Demo Mode" badge
- Shows configuration instructions
- Still demonstrates the full UI and functionality

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Get your API key from [Google AI Studio](https://aistudio.google.com/)
   - Add it to your `.env.local` file
   - Restart the development server

2. **"Failed to authenticate with Spotify"**
   - Check your Spotify credentials in `.env.local`
   - Ensure your Spotify app is created correctly
   - Verify the redirect URI matches exactly

3. **"No tracks found for the given mood"**
   - Try a different mood description
   - Check your internet connection
   - Verify both APIs are working

4. **AI interpretation fails**
   - The app has fallback keyword extraction
   - Try more specific mood descriptions
   - Check your Gemini API key is valid

### Error Logs
- Check the console for detailed error messages
- View `dev.log` for server-side errors
- Network tab in browser for API errors

## API Rate Limits

- **Spotify API**: Limited requests per minute
- **Gemini API**: Has usage limits (free tier available)
- The app includes error handling for rate limits

## Testing the Integration

### Test Gemini API Only
1. Configure only Gemini API in `.env.local`
2. The app will show demo tracks but use Gemini for mood interpretation
3. Check console logs for extracted search terms

### Test Spotify API Only
1. Configure only Spotify API in `.env.local`
2. The app will use fallback keyword extraction
3. You should see real Spotify tracks

### Test Both APIs
1. Configure both APIs
2. You should see real Spotify tracks based on Gemini's interpretation
3. Check console for "Search terms from Gemini:" logs

## Deployment

### For Production:
1. Set up environment variables on your hosting platform
2. Ensure Spotify redirect URI matches your production URL
3. Build the application: `npm run build`
4. Deploy using your preferred method (Vercel, Netlify, etc.)

## Contributing

This project was created for the MIC Dev Recruitment Assignment. Feel free to extend it with additional features like:
- User authentication
- Playlist history
- Collaborative playlists
- Apple Music integration

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify your API configurations
3. Ensure all dependencies are properly installed
4. Check the browser console for errors