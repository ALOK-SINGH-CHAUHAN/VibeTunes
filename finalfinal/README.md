# AI Mood-Based Playlist Generator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Framework](https://img.shields.io/badge/framework-Next.js%2015-black.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Spotify](https://img.shields.io/badge/Spotify-API-1DB954.svg)

A sophisticated web application that leverages AI to interpret natural language mood descriptions and generate personalized Spotify playlists. Built for the MIC Dev Recruitment Assignment.

## 🎵 Features

### Core Functionality
- **Natural Language Processing**: Describe your mood in natural language
- **AI-Powered Interpretation**: Uses Google Gemini AI to understand mood context
- **Spotify Integration**: Searches and retrieves tracks from Spotify's vast library
- **Beautiful UI**: Responsive design with dark mode support
- **Track Previews**: Listen to 30-second previews of generated tracks
- **Direct Spotify Links**: Open full playlists directly in Spotify

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, utility-first styling
- **shadcn/ui**: Beautiful, accessible UI components
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Engaging loading animations and skeleton screens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Spotify Developer Account
- npm or yarn package manager

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Spotify API Setup**
   - Create a Spotify Developer Account at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app and get your Client ID and Client Secret
   - Add redirect URI: `http://localhost:3000/callback`

3. **Environment Configuration**
   - Copy `.env.local` and update with your Spotify credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How It Works

1. **Mood Input**: Users describe their mood or activity in natural language
2. **AI Interpretation**: Google Gemini AI analyzes the mood and extracts relevant search terms
3. **Spotify Search**: The application searches Spotify's library using the AI-generated terms
4. **Playlist Generation**: Tracks are compiled into a personalized playlist
5. **User Interaction**: Users can preview tracks and open the full playlist in Spotify

### Example Usage

- **Input**: "I'm feeling energetic and want to workout"
- **AI Interpretation**: Extracts terms like "workout", "gym", "exercise", "high energy"
- **Generated Playlist**: Contains upbeat, high-tempo tracks perfect for exercising

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Google Gemini AI**: AI integration for mood interpretation
- **Spotify Web API**: Music search and retrieval
- **Node.js**: Runtime environment

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Git**: Version control

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-playlist/
│   │       └── route.ts          # API endpoint for playlist generation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── error-boundary.tsx        # Error handling component
│   └── loading-spinner.tsx       # Custom loading spinner
├── hooks/
│   └── use-toast.ts              # Toast notification hook
└── lib/
    ├── db.ts                     # Database connection
    ├── socket.ts                 # Socket.io configuration
    └── utils.ts                  # Utility functions
```

## 🔧 Configuration

### Environment Variables
```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### Spotify Developer Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note down your Client ID and Client Secret
4. Add `http://localhost:3000/callback` to Redirect URIs
5. Save your changes

## 🎨 UI/UX Design

### Design Principles
- **Mobile-First**: Fully responsive design for all devices
- **Accessibility**: WCAG-compliant with proper ARIA labels
- **Dark Mode**: Automatic theme switching support
- **Loading States**: Engaging animations during API calls
- **Error Handling**: Clear, actionable error messages

### Color Scheme
- **Primary**: Purple gradient (#9333ea to #ec4899)
- **Background**: Subtle gradient backgrounds
- **Cards**: Clean white/dark cards with proper contrast
- **Interactive**: Hover effects and smooth transitions

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup for Production
1. Set up environment variables on your hosting platform
2. Update Spotify redirect URI to match your production URL
3. Ensure all dependencies are properly installed

### Recommended Hosting
- **Vercel**: Seamless Next.js deployment
- **Netlify**: Static site hosting with serverless functions
- **AWS Lambda**: Serverless backend deployment

## 🐛 Troubleshooting

### Common Issues

1. **Spotify Authentication Error**
   ```
   Error: Failed to authenticate with Spotify
   ```
   - Verify your Spotify credentials in `.env.local`
   - Ensure your Spotify app is properly configured
   - Check that redirect URIs match exactly

2. **No Tracks Found**
   ```
   Error: No tracks found for the given mood
   ```
   - Try more specific mood descriptions
   - Check your internet connection
   - Verify Spotify API is accessible

3. **AI Interpretation Issues**
   - The app includes fallback keyword extraction
   - Try different mood descriptions
   - Check Google Gemini AI configuration

### Debug Mode
- Check browser console for client-side errors
- View `dev.log` for server-side errors
- Use browser Network tab to inspect API calls

## 🔮 Future Enhancements

### Bonus Features (Implementation Ready)
- [ ] User authentication via NextAuth.js
- [ ] Persistent playlist history with database storage
- [ ] Collaborative playlist generation and sharing
- [ ] Apple Music API integration for cross-platform support

### Additional Ideas
- [ ] Mood-based playlist scheduling
- [ ] Social sharing features
- [ ] Advanced AI mood analysis with sentiment detection
- [ ] Playlist customization and editing
- [ ] Music statistics and insights

## 📄 License

This project is created for the MIC Dev Recruitment Assignment and is available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions:
1. Check the troubleshooting section above
2. Review the setup instructions in `SETUP.md`
3. Verify your Spotify API configuration
4. Check the browser console for detailed error messages

## 🎯 Project Demo

Once set up, you can:
1. Visit `http://localhost:3000`
2. Enter a mood description (e.g., "happy morning workout")
3. Watch as AI interprets your mood
4. Enjoy your personalized playlist with track previews
5. Open the full playlist in Spotify

---

**Built with ❤️ for the MIC Dev Recruitment Assignment**