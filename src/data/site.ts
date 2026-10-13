/* Site-wide constants. The only file you should need to touch for links and keys. */

export const site = {
  name: "Azu",
  url: "https://chiefazu.com",
  tagline: "Swahili music has never sounded sweeter.",
  email: "contact@chiefazu.com",
  city: "Dar es Salaam",
  // web3forms.com access key. Empty = forms fall back to the visitor's email app.
  web3formsKey: "",
  // Optional preview MP3 for the floating player. Empty = the button opens Spotify.
  playerSrc: "",
  announcement: { text: "Juzi — the lyric video — out now", cta: "Watch →", href: "/watch" },
};

export const nav = [
  { href: "/music", label: "Music" },
  { href: "/watch", label: "Watch" },
  { href: "/shows", label: "Shows" },
  { href: "/story", label: "Story" },
  { href: "/shop", label: "Shop" },
  { href: "/walls", label: "Walls of Azu" },
];

export const platforms = [
  { id: "spotify", name: "Spotify", url: "https://open.spotify.com/artist/3jcvfDKsvH2TUHO65orcU4", icon: "/assets/icons/spotify.svg", verb: "Stream" },
  { id: "apple", name: "Apple Music", url: "https://music.apple.com/us/artist/azu/1570359996", icon: "/assets/icons/applemusic.svg", verb: "Stream" },
  { id: "audiomack", name: "Audiomack", url: "https://audiomack.com/chiefazu", icon: "/assets/icons/audiomack.svg", verb: "Stream" },
  { id: "boomplay", name: "Boomplay", url: "https://www.boomplay.com/artists/EQIL1bhvQ4mXybHY5OnnD8Qa", icon: "/assets/icons/boomplay.svg", verb: "Stream" },
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com/@Chiefazu", icon: "/assets/icons/youtube.svg", verb: "Watch" },
];

export const socials = [
  { name: "Instagram", url: "https://www.instagram.com/chiefazu" },
  { name: "TikTok", url: "https://www.tiktok.com/@chiefazu" },
  { name: "YouTube", url: "https://www.youtube.com/@Chiefazu" },
];

export const spotify = platforms[0].url;
export const youtube = platforms[4].url;
export const walls = "https://wallsofazu.com";
