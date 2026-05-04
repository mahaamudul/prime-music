# Prime Music - Mobile Web Frontend Plan

## Project Overview
Build a mobile-responsive web version of Prime Music app matching the iOS design exactly.

---

## 1. Page Structure & Routes

### Main Routes (Using React Router)
- `/` - Home (default feed)
- `/explore` - Explore page
- `/premium` - Premium page  
- `/library` - Library/My Music page
- `/search` - Search results
- `/playlist/:id` - Playlist detail
- `/artist/:id` - Artist detail

---

## 2. Component Architecture

### Layout Components
```
App
├── Layout
│   ├── Header
│   ├── MainContent (children routes)
│   └── BottomNavigation
```

### Header Component
- Left: Profile circular icon (green, clickable)
- Center: "Prime Music" logo text
- Right: Search icon (opens search modal)

### Bottom Navigation (Fixed)
- 4 tabs: Home, Explore, Premium, Library
- Active tab highlighted in green
- Icons with labels
- Fixed at bottom on mobile

### Home Page Content Sections
1. **Header** (already in layout)
2. **Hero/Featured** (optional banner)
3. **Sleep Section**
   - Title
   - Single large card: "Feel Good Indie" playlist
4. **Just Arrived Section**
   - Title + "View All" button
   - Horizontal scroll: Playlist cards
   - Each card: Image, title, artist/description
   - Play button overlay, heart button
5. **Happy Section**
   - Title + "View All"
   - Horizontal scroll: Category cards
6. **Artist Section**
   - Title + "View All"
   - Horizontal scroll: Circular artist avatars with names
7. **Top Charts Section**
   - Title + "View All"
   - Horizontal scroll: Large chart cards
8. **Timeline Section**
   - Title + "View All"
   - Horizontal scroll: Timeline/theme cards
9. **Trending Playlist Section**
   - Title + "View All"
   - Horizontal scroll: Trending cards

---

## 3. Reusable Components

### UI Components
- `ProfileCircle` - Green circular profile avatar
- `PlaylistCard` - Image card with overlay (title, play button, heart)
- `ArtistCard` - Circular image with name below
- `SongItem` - Thumbnail + title + artist + menu (for playlists)
- `CategoryCard` - Similar to playlist card
- `HorizontalScroll` - Container for scrollable sections
- `Section` - Generic section with title and "View All"

### Functional Components
- `Header` - Top navigation bar
- `BottomNavigation` - Bottom tab bar
- `SearchModal` - Search interface
- `MenuItem` - 3-dot menu options

---

## 4. Styling Strategy

### Color Variables (Tailwind + CSS)
```css
--primary-bg: #0F1419
--secondary-bg: #1A1F2E
--card-bg: #2A2F3E
--accent-green: #1DB954 (or #00FF00)
--accent-coral: #FF6B6B
--text-primary: #FFFFFF
--text-secondary: #A0A0A0
--border-color: #3A3F4E
```

### Responsive Design
- Mobile-first approach (primary: 375px-480px width)
- Safe area padding for notch devices
- Bottom nav height: 70px (accounts for home indicator)
- Top header height: 60px

### Spacing & Sizes
- Card border-radius: 12px
- Padding unit: 16px
- Icon sizes: 24px, 32px, 48px
- Font sizes: 12px (small), 14px (body), 16px (subtitle), 18px (title), 24px (header)

---

## 5. Data Structure

### Playlist Object
```javascript
{
  id: string,
  title: string,
  image: string (URL),
  description?: string,
  artist?: string,
  songs?: Song[]
}
```

### Artist Object
```javascript
{
  id: string,
  name: string,
  image: string (URL),
  genre?: string
}
```

### Song Object
```javascript
{
  id: string,
  title: string,
  artist: string,
  image: string (URL),
  duration: number
}
```

---

## 6. Build Phases

### Phase 1: Foundation
- [ ] Setup routing structure
- [ ] Create Layout + Header + Bottom Navigation
- [ ] Style basic layout with Tailwind

### Phase 2: Home Page Structure
- [ ] Create all section containers
- [ ] Add Section component with title + "View All"
- [ ] Create reusable card components

### Phase 3: Components & Cards
- [ ] ProfileCircle component
- [ ] PlaylistCard component
- [ ] ArtistCard component
- [ ] SongItem component
- [ ] HorizontalScroll component

### Phase 4: Styling & Polish
- [ ] Fine-tune colors to match reference
- [ ] Add hover states
- [ ] Responsive adjustments
- [ ] Animations (smooth scrolls, button interactions)

### Phase 5: Features
- [ ] Search functionality
- [ ] Other pages (Explore, Premium, Library)
- [ ] Modal/Detail views

---

## 7. File Structure

```
src/
├── pages/
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── Premium.jsx
│   └── Library.jsx
├── components/
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── BottomNavigation.jsx
│   │   └── Layout.jsx
│   ├── Cards/
│   │   ├── PlaylistCard.jsx
│   │   ├── ArtistCard.jsx
│   │   ├── SongItem.jsx
│   │   └── CategoryCard.jsx
│   ├── Sections/
│   │   ├── Section.jsx
│   │   ├── HorizontalScroll.jsx
│   │   └── Featured sections
│   └── Common/
│       ├── ProfileCircle.jsx
│       ├── SearchModal.jsx
│       └── MenuItem.jsx
├── data/
│   └── mockData.js (sample playlists, artists, songs)
├── styles/
│   ├── globals.css
│   └── colors.css
└── App.jsx
```

---

## 8. Key Design Details from Reference

### Colors Observed
- Primary BG: Very dark navy (#0F1419 or #0a0e17)
- Card BG: Slightly lighter navy (#1a1f2e or similar)
- Green accent: Bright lime/spotify-green (#1DB954 or #00ff00)
- Red/Coral play button: #FF6B6B or similar
- Text: White and light gray

### Spacing Patterns
- Sections have 16px horizontal padding
- 24px vertical spacing between sections
- Cards: 12-16px border-radius
- Card margins: 8-12px between cards

### Typography
- Bold headers (24-32px)
- Regular body (14-16px)
- Small captions (12px)

### Interactions
- Tap/hover: Slight scale or opacity change
- Play button: Always visible or on hover
- Heart button: White outline, fills when liked
- 3-dot menu: Opens bottom sheet or dropdown

---

## 9. Next Steps
1. Create folder structure
2. Setup routing
3. Build Layout skeleton
4. Create mock data
5. Build components one by one
6. Style and refine
