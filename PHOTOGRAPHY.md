# Photography and visual content

The project portfolio uses inspected files supplied in the workspace. Service illustrations also use selected licensed real photographs, clearly distinguished from TM Concepts work. See SERVICE-IMAGE-AUDIT.md for every source and license. Do not infer event dates, exact venues, client testimonials or equipment models from these images.

## Current sources

| Key | Original source | Subject |
| --- | --- | --- |
| stage | WhatsApp Image 2026-09-30 at 2.24.58 PM (2).jpeg | Rotary installation stage, LED panels, lighting and runway |
| awards | 2.24.58 PM.jpeg | Award recipients |
| presentation | 2.24.58 PM (1).jpeg | Portrait speaker and branded podium |
| installation | 2.24.59 PM.jpeg | Installation ceremony |
| celebration | 2.24.59 PM (1).jpeg | Certificate presentation |
| podium | 2.24.59 PM (2).jpeg | Speaker, lights and LED panels |
| dinner | WhatsApp Video 2026-09-30 at 2.24.57 PM (2).mp4 | Corporate dinner, banquet seating and three presentation screens |
| conference | WhatsApp Video 2026-09-30 at 2.24.57 PM.mp4 | Conference stage, screen, podium and panel chairs |
| paediatric | WhatsApp Video 2026-09-30 at 2.24.58 PM.mp4 | Paediatric conference backdrop, podium and panel seating |

The six Rotary photographs belong to one project. The three separate video setups have their own factual portfolio entries. The video stills are approximately 640 pixels wide; they are not artificially enlarged. Replace them with higher-resolution photographs when available.

Responsive derivatives live in public/images/projects. Filenames use -480, -800 and -1280 suffixes, but preparation preserves original resolution when the source is smaller. The media width/height values and srcset descriptors reflect actual dimensions.

## Hero images and crops

Edit **src/homepageContent.js → heroSlides**. Four current assets live at:

- public/images/hero/hero-01.webp — Rotary installation
- public/images/hero/hero-02.webp — corporate dinner
- public/images/hero/hero-03.webp — conference presentation
- public/images/hero/hero-04.webp — paediatric conference

Each also has -480.webp and -800.webp responsive copies. Replace all derivatives together and update each slide's width, height, alt text, position, mobilePosition, title, subtitle and href. Keep the files aligned with the actual event named in the caption. The hero supports missing files through a neutral gradient.

## Clients and impact

The existing six client logos are preserved in public/images/clients. Optimized WebP versions are in public/images/clients/optimized. The editable logo list and the figures requested in the final brief are in src/homepageContent.js.

## Design comparison

The labels are **DESIGN / PRE-VISUALISATION** and **FINAL VISUALISATION**. Images are static renders of the same furnished event model and camera, configured in src/content.js → conceptPair:

- public/images/design/event-wireframe-{480,800,1600}.webp
- public/images/design/event-visualised-{480,800,1600}.webp

The model includes sofas, lounge tables, cocktail tables and stools, conference seating, panel chairs, stage, podium, screen, audio, lighting, truss and plants. Edit scripts/event-scene.mjs and run npm run media:design with the dev server running to regenerate. No image-generation model is involved.

A future comparison must use two genuinely matching views. Do not substitute an unrelated completed-event photograph. Preserve honest visualization labels unless a real matching built-event image is supplied.

## Add or replace photography

Approved production folders are public/images/projects, services, equipment, team, about, design, hero and clients/optimized. The production build copies these folders automatically.

For portfolio photographs and inventory, add a media entry in **src/content.js**:

~~~js
generator: {
  src: '/images/equipment/generator-1280.webp',
  srcSet: '/images/equipment/generator-480.webp 480w, /images/equipment/generator-800.webp 800w, /images/equipment/generator-1280.webp 1280w',
  width: 1280,
  height: 853,
  alt: 'Describe the actual equipment and setting visible in this photograph',
  position: '50% 50%',
}
~~~

Set an inventory item's photo to this media key, or assign it to a named slot in slotMedia. Crew, office, CEO portrait and unavailable inventory photographs retain neutral branded panels without editing instructions. Service imagery is maintained separately in **src/serviceImagery.js** and attached by service slug in src/content.js. Update the source records in scripts/service-media-sources.json before regeneration. See SERVICE-IMAGE-AUDIT.md for exact mappings, crops and stock licenses; service cards now have a relevant photograph or the existing design render.

Use actual approved photographs for the CEO, crew, office and stocked equipment. The design render is an illustration of the visualization service, not proof of an equipment model in stock.

## Add a project

Add one entry to **src/content.js → projects**. Cards, filters, both scrolling image rows, metadata, social images and static routes are generated from the data.

~~~js
{
  slug: 'confirmed-project-name',
  title: 'Confirmed project name',
  subtitle: 'Event description',
  location: 'Confirmed location',
  category: 'Corporate',
  categories: ['Corporate', 'LED & AV'],
  services: ['Confirmed service'],
  images: ['mediaKey1', 'mediaKey2'],
  description: 'Factual description of the event.',
  note: 'Optional verified production detail.',
}
~~~

Filters are All, Conferences, Corporate, Concerts, Weddings, Nightlife, LED & AV, Branding and Rentals. Empty selections offer the full collection. The home featured section uses the first three entries.

Run npm run build, npm test and npm run test:homepage after updates. Check crops, captions, alt text and contrast at desktop and phone widths.
