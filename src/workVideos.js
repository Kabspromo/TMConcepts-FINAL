// Only inspected, client-supplied event footage. Original video filenames are preserved.
// Metadata and matching real-frame posters: npm run media:videos.
export const workVideos = [
  {
    "id": "conference-environment",
    "title": "The conference environment",
    "category": "CONFERENCE PRODUCTION",
    "description": "A walk across a TM Concepts conference setup, with a presentation screen, branded podium and panel seating.",
    "featured": true,
    "src": "/videos/WhatsApp%20Video%202026-09-30%20at%202.24.57%20PM.mp4",
    "poster": "/images/video-posters/conference-environment.webp",
    "width": 640,
    "height": 360,
    "duration": 14.033656,
    "orientation": "landscape",
    "bytes": 1907438
  },
  {
    "id": "wedding-production",
    "title": "A wedding, brought to life",
    "category": "WEDDING PRODUCTION",
    "description": "Reception seating, a white aisle, overhead lighting and a TM Concepts screen within a wedding venue.",
    "featured": true,
    "src": "/videos/WhatsApp%20Video%202026-09-30%20at%202.24.57%20PM%20(3).mp4",
    "poster": "/images/video-posters/wedding-production.webp",
    "width": 480,
    "height": 848,
    "duration": 33.041995,
    "orientation": "portrait",
    "bytes": 5348437
  },
  {
    "id": "presentation-stage",
    "title": "Ready for the presentation",
    "category": "AV / LED / STAGING",
    "description": "A presentation stage with a World Intellectual Property Day display, speaker podium and panel chairs.",
    "featured": true,
    "src": "/videos/WhatsApp%20Video%202026-09-30%20at%202.24.57%20PM%20(1).mp4",
    "poster": "/images/video-posters/presentation-stage.webp",
    "width": 358,
    "height": 642,
    "duration": 11.904,
    "orientation": "portrait",
    "bytes": 2095335
  },
  {
    "id": "banquet-environment",
    "title": "An evening, set in place",
    "category": "EVENT ENVIRONMENTS",
    "description": "Dressed dining tables and covered chairs facing a stage with three coordinated presentation screens.",
    "featured": true,
    "src": "/videos/WhatsApp%20Video%202026-09-30%20at%202.24.57%20PM%20(2).mp4",
    "poster": "/images/video-posters/banquet-environment.webp",
    "width": 640,
    "height": 360,
    "duration": 3.019792,
    "orientation": "landscape",
    "bytes": 490639
  },
  {
    "id": "paediatric-conference",
    "title": "The conference stage",
    "category": "CONFERENCE PRODUCTION",
    "description": "A paediatric conference stage with a wide presentation backdrop, branded podium and panel microphones.",
    "featured": false,
    "src": "/videos/WhatsApp%20Video%202026-09-30%20at%202.24.58%20PM.mp4",
    "poster": "/images/video-posters/paediatric-conference.webp",
    "width": 640,
    "height": 356,
    "duration": 7.133333,
    "orientation": "landscape",
    "bytes": 1321620
  }
];
export const featuredWorkVideos = workVideos.filter(video=>video.featured);
