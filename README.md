# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 🎵 Prime Music

A modern, responsive music streaming web application built with **React**, **Vite**, and **Howler.js**. Stream, queue, and control your music with a sleek, professional interface optimized for both mobile and desktop.

---

## 📌 Project Overview

Prime Music is a full-featured music player that combines a clean user interface with robust playback controls, queue management, and seamless synchronization across multiple UI components. The application is deployed on **Vercel** and provides users with an intuitive experience for exploring, playing, and managing music collections.

### 🎯 Key Features

- ✅ **Robust Audio Playback** - Howler.js-based engine with fallback handling
- ✅ **Advanced Queue Management** - Dynamic queue system with auto-advance and repeat modes
- ✅ **Synchronized Controls** - Play/pause, shuffle, and favorite states synced across all UI components
- ✅ **Mobile-First Design** - Responsive layout with dedicated mobile optimizations
- ✅ **Dynamic Playlist Support** - Play individual songs or entire albums/playlists
- ✅ **Audio Proxy** - Serverless audio proxy for secure and efficient streaming
- ✅ **Favorites & Collections** - Track and manage favorite playlists and songs
- ✅ **Shuffle & Repeat Modes** - Full playback control options

---

## 👨‍💻 My Role in This Project

I served as the **Frontend Engineer**, responsible for:

1. **Audio Engine Redesign** - Rebuilt the entire player logic from scratch using Howler.js with proper state management and callback handling
2. **Queue System Implementation** - Designed and implemented a robust queue system that handles auto-advance, repeat modes, and edge cases
3. **UI Synchronization** - Ensured play/pause, shuffle, favorite, and collection states remain synchronized across the mini-player, playlist detail, and queue components
4. **Mobile UX Refinement** - Implemented mobile-specific behaviors including adaptive bottom navigation and centered playback controls
5. **Code Cleanup** - Removed environment-based configuration in favor of relative API paths for better deployment security
6. **Responsive Interface Work** - Refined layout behavior and control placement for a smoother experience across desktop and mobile screens

---

## 🔧 Problems Solved & Solutions

### Problem 1: Unstable Audio Playback
**Issue**: Songs were skipping, not advancing to the next track, and audio callbacks were stale.
**Solution**: 
- Replaced buggy player logic with Howler.js
- Implemented refs-based state management to avoid closure stale issues
- Added fallback loading with direct and proxy URL support
- Implemented proper error handling for 403/access-denied responses

### Problem 2: Queue State Management
**Issue**: Queue would stop at the end or skip tracks unexpectedly because state went stale in callbacks.
**Solution**:
- Created `queueRef`, `currentIndexRef`, and `currentSongRef` to maintain live state
- Implemented `handleSongEnd()` with live refs to properly advance to next song
- Added proper indexing for shuffle and repeat modes

### Problem 3: UI Control Desynchronization
**Issue**: Shuffle, favorite, and play/pause states were inconsistent across mini-player, playlist detail, and queue.
**Solution**:
- Moved all playback state into shared `MusicPlayerContext`
- Implemented `isCollectionFavorite()` and `toggleCollectionFavorite()` for global favorite tracking
- Ensured all UI components consume from the same context

### Problem 4: Vercel Deployment Mixed-Content Errors
**Issue**: Browser was blocking mixed-content (HTTPS frontend calling HTTP backend directly).
**Solution**:
- Removed all hardcoded `http://` API URLs from client code
- Switched to relative `/api/...` paths
- Added Vercel rewrites to proxy API calls to backend server
- Implemented serverless audio proxy for secure audio streaming

### Problem 5: Mobile UX Issues
**Issue**: Bottom navigation didn't hide on scroll, and playback controls weren't centered.
**Solution**:
- Implemented scroll-direction detection for adaptive bottom nav
- Balanced mobile mini-player grid layout with equal-width side columns
- Optimized touch targets and removed non-essential mobile UI elements

### Problem 6: Build & Dependency Issues
**Issue**: Vercel builds failed because `howler` dependency was missing from package.json.
**Solution**:
- Added `howler@^2.2.4` to dependencies
- Verified all imports resolve correctly during build

---

## 🛠️ Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^19.2.5 | UI library and component framework |
| **Vite** | ^8.0.10 | Lightning-fast build tool and dev server |
| **React Router** | ^7.14.2 | Client-side routing and navigation |
| **Howler.js** | ^2.2.4 | Audio playback engine with fallback support |
| **Tailwind CSS** | ^4.2.4 | Utility-first CSS framework for styling |
| **Lucide React** | ^1.14.0 | Beautiful, consistent icon library |
| **React Fast Marquee** | ^1.6.5 | Smooth text scrolling animations |

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS transformation and optimization
- **Autoprefixer** - Browser compatibility for CSS
- **TypeScript types** - Type checking for React and React DOM

### Deployment
- **Vercel** - Serverless deployment and hosting
- **Vercel Rewrites** - API routing and audio proxy

---

## 📁 Project Structure

```
Prime Music/
├── client/                          # React Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Cards/              # Reusable card components
│   │   │   │   ├── ArtistCard.jsx
│   │   │   │   ├── CategoryCard.jsx
│   │   │   │   ├── PlaylistCard.jsx
│   │   │   │   └── SongItem.jsx
│   │   │   ├── Common/             # Shared UI components
│   │   │   │   ├── MiniPlayer.jsx  # Desktop & mobile playback bar
│   │   │   │   ├── Queue.jsx       # Queue panel
│   │   │   │   ├── PlaylistDetail.jsx  # Playlist/album details
│   │   │   │   ├── SearchModal.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── MarqueeText.jsx
│   │   │   ├── Layout/             # Layout & navigation
│   │   │   │   ├── Layout.jsx      # Main app shell
│   │   │   │   ├── Header.jsx      # Mobile header
│   │   │   │   ├── DesktopSidebar.jsx
│   │   │   │   ├── DesktopTopBar.jsx
│   │   │   │   ├── BottomNavigation.jsx  # Mobile bottom nav
│   │   │   │   ├── SidePanel.jsx
│   │   │   │   └── ProfileDropdown.jsx
│   │   │   └── Sections/           # Page sections
│   │   │       ├── HorizontalScroll.jsx
│   │   │       ├── JustArrivedContainer.jsx
│   │   │       ├── Section.jsx
│   │   │       └── SongListContainer.jsx
│   │   ├── contexts/
│   │   │   └── MusicPlayerContext.jsx  # Global playback state
│   │   ├── pages/                  # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── Playlist.jsx
│   │   │   └── Premium.jsx
│   │   ├── data/
│   │   │   └── mockData.js         # Mock data for development
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── api/
│   │   └── audio-proxy.js          # Serverless audio proxy
│   ├── public/                     # Static assets
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS configuration
│   ├── vercel.json                 # Vercel deployment config
│   └── package.json
├── .git/                           # Git repository
└── README.md                       # This file
```

---

## 🎯 Core Components

### MusicPlayerContext.jsx
**Purpose**: Global playback state management
- **Responsibilities**:
  - Audio engine (Howler.js instance management)
  - Queue management and navigation
  - Playback state (play, pause, seek, volume)
  - Favorite/collection tracking
  - Shuffle and repeat mode handling
- **Key Methods**:
  - `loadSong()` - Load audio with fallback
  - `playSong()` - Play a specific song
  - `playPlaylist()` - Play entire collection
  - `next()` / `previous()` - Queue navigation
  - `toggleCollectionFavorite()` - Global favorite state

### MiniPlayer.jsx
**Purpose**: Playback control bar (desktop + mobile overlay)
- **Features**:
  - Play/pause, skip buttons
  - Time display and seek bar
  - Shuffle/repeat controls
  - Volume control
  - Queue toggle
  - Responsive mobile/desktop layouts

### PlaylistDetail.jsx
**Purpose**: Album/playlist page with full controls
- **Features**:
  - Collection metadata and cover art
  - Synchronized controls (Play All, Shuffle, Favorite)
  - Song list with playback integration
  - Mobile and desktop layouts
  - Direct song play integration

### Queue.jsx
**Purpose**: Queue management and visualization
- **Features**:
  - Current queue display
  - Current song highlighting
  - Queue navigation

### BottomNavigation.jsx
**Purpose**: Mobile navigation with scroll behavior
- **Features**:
  - Adaptive show/hide on scroll direction
  - Navigation links
  - Mobile-optimized spacing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prime-music.git
cd prime-music

# Install dependencies
cd client
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
The application uses relative API paths (`/api/...`) for all backend calls. No environment configuration is required. Vercel automatically handles the rewrites.

---

## 📱 Responsive Design

### Mobile (< 768px)
- Compact mini-player overlay
- Bottom navigation with scroll detection
- Centered playback controls
- Touch-optimized UI elements
- Single-column layouts

### Desktop (≥ 768px)
- Full mini-player bar at bottom
- Sidebar navigation
- Multi-column layouts
- Expanded controls

---

## 🔌 API Integration

All API calls use relative paths routed through Vercel:
- `/api/vv1/home` - Home page data
- `/api/vv1/category` - Categories
- `/api/vv1/category/collections/album-playlist-by-id` - Playlist/album details
- `/audio-proxy` - Secure audio streaming

---

## 🎨 Design Highlights

- **Dark Theme** - Professional dark interface (`#020e28` base color)
- **Red Accent** - Red buttons and highlights for primary actions
- **Glassmorphism** - Backdrop blur effects on overlays
- **Smooth Animations** - Transitions on state changes
- **Accessibility** - Proper ARIA labels and semantic HTML

---

## 📊 Performance Optimizations

- **Lazy Loading** - Images and components loaded on demand
- **Memoization** - React useMemo for expensive calculations
- **Ref-Based State** - Avoids stale closure issues in callbacks
- **Fallback Loading** - Direct URL + Proxy URL for resilience
- **Tailwind CSS** - Utility-based styling with tree-shaking

---

## 🐛 Known Issues & Future Enhancements

### Current Status
- ✅ Core playback functionality stable
- ✅ Queue management robust
- ✅ Mobile and desktop UI responsive
- ⚠️ Some audio URLs return 403 (handled gracefully)
- 🔄 Download feature placeholder (ready for implementation)

### Future Enhancements
- [ ] Implement song download functionality
- [ ] Add user authentication and playlists
- [ ] Implement history tracking
- [ ] Add EQ and audio effects
- [ ] Create dark/light theme toggle
- [ ] Add offline playback support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub or reach out directly.

---

## 🙏 Acknowledgments

- **Howler.js** - Powerful audio library
- **React** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Vite** - Next-generation build tool
- **Vercel** - Seamless deployment platform

---

**Built with ❤️ | Last Updated: May 10, 2026**
