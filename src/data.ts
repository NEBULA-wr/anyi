
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  duration?: number; // Duration in seconds for images
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  lyrics: string[];
  startTime?: number; // Start time in seconds for the highlight
  duration?: number; // Duration to play in seconds
}

export const playlist: Song[] = [
  {
    id: '1',
    title: 'Photograph',
    artist: 'Ed Sheeran',
    url: '1.mp4',
    startTime: 60,
    duration: 10,
    lyrics: [
      "We keep this love in a photograph",
      "We made these memories for ourselves"
    ]
  },
  {
    id: '2',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    url: '2.mp4',
    startTime: 45,
    duration: 10,
    lyrics: [
      "I found a love for me",
      "Te amo Anyari"
    ]
  },
  {
    id: '3',
    title: 'Rewrite the Stars',
    artist: 'James Arthur & Anne-Marie',
    url: '3.mp4',
    startTime: 50,
    duration: 10,
    lyrics: [
      "What if we rewrite the stars?",
      "Say you were made to be mine"
    ]
  },
  {
    id: '4',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    url: '4.mp4',
    startTime: 40,
    duration: 10,
    lyrics: [
      "Take me into your loving arms",
      "Kiss me under the light of a thousand stars"
    ]
  },
  {
    id: '5',
    title: 'Beautiful Things',
    artist: 'Benson Boone',
    url: '5.mp4',
    startTime: 30,
    duration: 10,
    lyrics: [
      "I thank God every day",
      "For the girl he sent my way"
    ]
  },
  {
    id: '6',
    title: 'All of Me',
    artist: 'John Legend',
    url: '6.mp4',
    startTime: 65,
    duration: 10,
    lyrics: [
      "Cause all of me",
      "Loves all of you"
    ]
  },
  {
    id: '7',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    url: '7.mp4',
    startTime: 55,
    duration: 10,
    lyrics: [
      "I have loved you for a thousand years",
      "I'll love you for a thousand more"
    ]
  },
  {
    id: '8',
    title: 'Love Yourself',
    artist: 'Justin Bieber',
    url: '8.mp4',
    startTime: 40,
    duration: 10,
    lyrics: [
      "You should go and love yourself",
      "But I love you more"
    ]
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: '9.jpeg',
    caption: 'Every moment with you',
    duration: 5,
  },
  {
    id: '2',
    type: 'video',
    url: '14.mp4',
    caption: 'Is a memory I treasure',
  },
  {
    id: '3',
    type: 'image',
    url: '10.jpeg',
    caption: 'You are my perfect',
    duration: 5,
  },
  {
    id: '4',
    type: 'video',
    url: '15.mp4',
    caption: 'Rewriting our stars',
  },
  {
    id: '5',
    type: 'image',
    url: '11.jpeg',
    caption: 'Thinking out loud',
    duration: 5,
  },
  {
    id: '6',
    type: 'video',
    url: '16.mp4',
    caption: 'All of me loves all of you',
  },
  {
    id: '7',
    type: 'image',
    url: '12.jpeg',
    caption: 'For a thousand years',
    duration: 5,
  },
  {
    id: '8',
    type: 'video',
    url: '17.mp4',
    caption: 'Love yourself',
  },
  {
    id: '9',
    type: 'image',
    url: '13.jpeg ',
    caption: 'Forever yours',
    duration: 5,
  },
];
