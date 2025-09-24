# MoodSync: Mood-Based Playlist Generator Design Guidelines

## Design Approach: Reference-Based (Music Streaming)
**Primary Reference**: Spotify's dark interface with Apple Music's content discovery patterns
**Justification**: Music applications prioritize visual content (album art) and emotional connection, requiring a reference-based approach that emphasizes visual hierarchy and mood-driven aesthetics.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (following Spotify's proven music interface patterns):
- Background: 210 15% 8% (deep charcoal)
- Surface: 210 12% 12% (elevated dark)
- Primary Brand: 142 76% 48% (Spotify-inspired green)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 0 0% 65% (muted gray)

**Light Mode** (for accessibility):
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white)
- Primary remains: 142 76% 48%
- Text Primary: 210 15% 15% (dark charcoal)

### B. Typography
- **Primary**: Inter via Google Fonts CDN
- **Headings**: Inter 600-700 weight
- **Body**: Inter 400-500 weight
- **Mood Input**: Inter 400 (larger sizing for readability)

### C. Layout System
**Tailwind Spacing Primitives**: 2, 4, 6, 8, 12, 16
- Consistent rhythm using p-4, m-6, gap-8 patterns
- Generous whitespace following music app conventions

### D. Component Library

**Navigation**: 
- Top navigation bar with logo and user authentication
- Minimal, music-focused design

**Mood Input**:
- Large, prominent textarea with placeholder text
- Natural language examples ("upbeat morning vibes," "melancholy rainy day")
- Submit button with loading states

**Playlist Display**:
- Grid layout for generated playlists
- Album art thumbnails with track information
- Artist names, song titles, duration display
- Play buttons with Spotify integration

**Track Cards**:
- Horizontal layout with album art, track info, and controls
- Hover states revealing additional options
- Clean typography hierarchy

**Controls**:
- Spotify Web Player integration
- Play/pause, skip controls
- Volume and progress indicators

### E. Visual Treatments

**Gradients** (used sparingly):
- Subtle dark gradients on hero sections
- Album art overlay gradients for text readability

**Album Art Integration**:
- Prominent display following music industry standards
- Consistent aspect ratios and corner radius
- Blur effects for background elements when needed

**Interactive States**:
- Subtle hover animations on clickable elements
- Focus states for keyboard navigation
- Loading spinners for AI processing

## Content Strategy
**Single-Page Application** with three main sections:
1. **Mood Input Hero**: Large text area with inspiring placeholder text
2. **Playlist Generation**: Real-time display of AI processing and results
3. **Music Discovery**: Generated playlists with rich metadata display

**Key Principles**:
- Immediate value: Mood input prominently featured
- Visual music focus: Album art and track information prioritized
- Spotify integration: Seamless playback and linking
- Responsive design: Optimized for both desktop and mobile music consumption

The design emphasizes the emotional connection between mood and music while maintaining the familiar patterns users expect from premium music streaming interfaces.