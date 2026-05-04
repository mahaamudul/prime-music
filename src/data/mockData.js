// Mock data for Prime Music app

const sharedImage = "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&h=800&fit=crop";

export const playlists = {
  feelGoodIndie: {
    id: 1,
    title: "Feel Good Indie",
    image: sharedImage,
    description: "Indie vibes for the soul",
    artist: "Indie Collection",
  },
  popAndDeepHouse: {
    id: 2,
    title: "Pop & Deep House",
    image: sharedImage,
    description: "What will be here",
    artist: "Music Lovers",
  },
  shesAFake: {
    id: 3,
    title: "She is a Fake",
    image: sharedImage,
    description: "What will be here",
    artist: "Pop Hits",
  },
  justAStranger: {
    id: 4,
    title: "Just a Stranger",
    image: sharedImage,
    description: "What will be here",
    artist: "New Releases",
  },
  topPanjabiSongs: {
    id: 5,
    title: "Top Panjabi songs",
    image: sharedImage,
    description: "Punjabi hits",
  },
  topHindi50: {
    id: 6,
    title: "Top Hindi 50",
    image: sharedImage,
    description: "Hindi chart toppers",
  },
  retro: {
    id: 7,
    title: "Retro Classics",
    image: sharedImage,
    description: "Golden oldies",
  },
  mafia: {
    id: 8,
    title: "Mafia",
    image: sharedImage,
    description: "Movie soundtrack",
  },
  sapphire: {
    id: 9,
    title: "Sapphire",
    image: sharedImage,
    description: "Gemstone collection",
  },
  timAllTime50: {
    id: 10,
    title: "All Time Top 50",
    image: sharedImage,
    description: "Greatest hits",
  },
  timMorHeNaHuye: {
    id: 11,
    title: "Tum Moro Na Huye",
    image: sharedImage,
    description: "Love songs",
  },
  international50: {
    id: 12,
    title: "International Top 50",
    image: sharedImage,
    description: "Global hits",
  },
};

export const artists = [
  {
    id: 1,
    name: "Alan Walker",
    image: sharedImage,
    genre: "Electronic",
  },
  {
    id: 2,
    name: "Imran Mahmood",
    image: sharedImage,
    genre: "Pop",
  },
  {
    id: 3,
    name: "Bob Marley",
    image: sharedImage,
    genre: "Reggae",
  },
  {
    id: 4,
    name: "Neha Kakkar",
    image: sharedImage,
    genre: "Bollywood",
  },
  {
    id: 5,
    name: "The Weeknd",
    image: sharedImage,
    genre: "R&B",
  },
];

export const songs = [
  {
    id: 1,
    title: "Faded",
    artist: "Alan Walker",
    image: sharedImage,
    duration: 212,
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: sharedImage,
    duration: 200,
  },
  {
    id: 3,
    title: "One Dance",
    artist: "Drake ft. Wizkid",
    image: sharedImage,
    duration: 213,
  },
  {
    id: 4,
    title: "Shape of You",
    artist: "Ed Sheeran",
    image: sharedImage,
    duration: 233,
  },
  {
    id: 5,
    title: "Perfect",
    artist: "Ed Sheeran",
    image: sharedImage,
    duration: 263,
  },
  {
    id: 6,
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    image: sharedImage,
    duration: 230,
  },
];

export const sections = {
  sleep: [playlists.feelGoodIndie],
  justArrived: [
    playlists.feelGoodIndie,
    playlists.popAndDeepHouse,
    playlists.shesAFake,
    playlists.justAStranger,
  ],
  happy: [playlists.topPanjabiSongs, playlists.topHindi50, playlists.retro],
  topCharts: [playlists.mafia, playlists.sapphire, playlists.timAllTime50],
  timeline2010s: [playlists.topPanjabiSongs, playlists.mafia, playlists.sapphire],
  trendingPlaylist: [playlists.timMorHeNaHuye, playlists.international50, playlists.retro],
};
