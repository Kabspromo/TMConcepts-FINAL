# Service image audit

Completed for the homepage, /services and every service detail page. Existing card geometry, the approved theme and the working homepage interactions are preserved.

## Mapping

| Service | Selected subject | Source | Local image |
| --- | --- | --- | --- |
| Event Design & 3D Visualisation | Furnished 3D event design with conference seating, lounge sofas, cocktail tables, stage, LED and truss | Existing TM 3D event concept | /images/services/design/event-design-1280.webp |
| Technical Production | Live event technician operating control consoles beside production road cases | Licensed service illustration | /images/services/technical-production/show-operator-1280.webp |
| Audio Visual | Conference presentation screens, digital stage display and speaker podium at a supplied TM Concepts event | Supplied TM Concepts event media | /images/services/av/conference-av-358.webp |
| Audio Systems | Professional line-array loudspeakers suspended outdoors for an event | Licensed service illustration | /images/services/audio/line-array-1280.webp |
| LED Screens | Operating LED backdrop displaying Rotary Muyenga Bukasa presidential installation graphics | Supplied TM Concepts event media | /images/services/led/rotary-led-wall-1280.webp |
| Event Lighting | Suspended event lighting fixture casting multiple beams through haze | Licensed service illustration | /images/services/lighting/lighting-beams-1280.webp |
| Event Power & Generator Solutions | Industrial generator with an open electrical distribution panel and power connections | Licensed service illustration | /images/services/power/generator-1280.webp |
| Staging & Structures | Raised white stage platform and runway at the Rotary Muyenga Bukasa installation | Supplied TM Concepts event media | /images/services/staging/rotary-stage-platform-1280.webp |
| Trussing & Rigging | Interconnected overhead truss structures supporting suspended lighting and display equipment | Licensed service illustration | /images/services/trussing/overhead-truss-rig-1280.webp |
| Event Branding & Signage | Rotary-branded speaker podium with matching event identity and signage | Supplied TM Concepts event media | /images/services/branding/rotary-podium-branding-853.webp |
| Furniture & Event Rentals | Covered banquet chairs and dressed dining tables arranged for an actual TM Concepts event | Supplied TM Concepts event media | /images/services/furniture/banquet-furniture-640.webp |
| Conference Production | Paediatric conference stage with presentation screen, panel seating, microphones and branded podium | Supplied TM Concepts event media | /images/services/conference/paediatric-conference-640.webp |
| Concerts & Live Events | Audience facing a Nairobi concert stage with LED screens, trussing and blue stage lighting | Licensed service illustration | /images/services/concerts/nairobi-concert-1280.webp |
| Weddings | Supplied wedding venue setup with reception seating, white runway, overhead lighting and TM Concepts display | Supplied TM Concepts event media | /images/services/weddings/wedding-production-480.webp |
| Nightlife | Nairobi club environment with a DJ booth, digital backdrop, mirror balls and coloured event lighting | Licensed service illustration | /images/services/nightlife/nairobi-club-1280.webp |
| Corporate Events | Corporate award presentation on a branded Rotary event stage | Supplied TM Concepts event media | /images/services/corporate/rotary-awards-1280.webp |

## Licensed photographs

These images illustrate services. They are not added to the project portfolio, presented as TM crew, used as leadership portraits or described as TM commissions. Every service detail page labels stock imagery as a service illustration and links to the exact photographer page. Service cards carry the same distinction.

### Technical Production

- Photographer: Noah Buisson
- Provider: Unsplash
- Source: [Noah Buisson / Unsplash](https://unsplash.com/photos/sound-engineer-at-a-concert-mixing-board-tpJdh_VuhV4)
- License: [Unsplash license](https://unsplash.com/license)
- Local file: /images/services/technical-production/show-operator-1280.webp

### Audio Systems

- Photographer: Caleb Oquendo
- Provider: Pexels
- Source: [Caleb Oquendo / Pexels](https://www.pexels.com/photo/outdoor-concert-speaker-system-setup-34585137/)
- License: [Pexels license](https://www.pexels.com/license/)
- Local file: /images/services/audio/line-array-1280.webp

### Event Lighting

- Photographer: Erik Mclean
- Provider: Pexels
- Source: [Erik Mclean / Pexels](https://www.pexels.com/photo/light-beams-cast-by-a-lighting-equipment-9271247/)
- License: [Pexels license](https://www.pexels.com/license/)
- Local file: /images/services/lighting/lighting-beams-1280.webp

### Event Power & Generator Solutions

- Photographer: - Kenny
- Provider: Unsplash
- Source: [- Kenny / Unsplash](https://unsplash.com/photos/yellow-industrial-generator-with-open-electrical-panel-aQQgXiYJ4kU)
- License: [Unsplash license](https://unsplash.com/license)
- Local file: /images/services/power/generator-1280.webp

### Trussing & Rigging

- Photographer: Bence Szemerey
- Provider: Pexels
- Source: [Bence Szemerey / Pexels](https://www.pexels.com/photo/digital-screen-under-shiny-projectors-on-stage-7513414/)
- License: [Pexels license](https://www.pexels.com/license/)
- Local file: /images/services/trussing/overhead-truss-rig-1280.webp

### Concerts & Live Events

- Photographer: Shalom Mwenesi
- Provider: Unsplash
- Source: [Shalom Mwenesi / Unsplash](https://unsplash.com/photos/a-group-of-people-standing-on-top-of-a-stage-hDz1_SpbHco)
- License: [Unsplash license](https://unsplash.com/license)
- Local file: /images/services/concerts/nairobi-concert-1280.webp

### Nightlife

- Photographer: Dwayne joe
- Provider: Unsplash
- Source: [Dwayne joe / Unsplash](https://unsplash.com/photos/dj-stands-in-a-club-with-lights-and-disco-balls-3V3MgZ-6FRc)
- License: [Unsplash license](https://unsplash.com/license)
- Local file: /images/services/nightlife/nairobi-club-1280.webp

Both provider license pages were reviewed on 1 October 2026. Only their free-photo licenses were used. No Unsplash+ assets, arbitrary Google Images results or newly generated images were used. The Nairobi photographs retain their true setting in the alt text; they are not described as Kampala commissions.

## Editing

- Runtime source of truth: src/serviceImagery.js. Each entry has src, responsive srcSet, actual width/height, accurate alt text, desktop/mobile focal points and source metadata.
- src/content.js attaches each image to its service once. Homepage cards, all-services cards, detail pages, related cards and social previews use the same mapping.
- scripts/service-media-sources.json records original local files, video frames, crops and focal points. scripts/service-stock-sources.json records the inspected external source URLs and license references.
- npm run media:services regenerates optimized WebP derivatives. Start the local dev server first so the script can extract client video frames. External source files are cached under artifacts/service-audit/stock; only selected optimized derivatives are shipped.
- Original files are preserved. No portfolio projects were added or relabelled during this pass. Corporate Events is now an explicit service page using the supplied Rotary awards photograph.

## About imagery

About uses actual TM event photographs/video frames plus the already existing labelled event-design render. Stock technicians are never represented as TM employees. No approved CEO portrait was found in the project assets during this audit; the existing tasteful branded leadership panel remains, with Tenywa Musa’s approved name and role.

The company story, six-stage process, mission, vision and short leadership statement live in src/aboutContent.js. Layouts are in src/AboutStory.jsx and src/about-refinements.css.

## Verification

Run npm test, npm run test:services and npm run test:homepage against the production preview. The service suite checks 360, 375, 390, 412, 430, 768, 1024 and 1440 px, image consistency/crops, local assets, source labels, About stacking, the six-stage keyboard interaction and accessibility.

Final production verification: build passed with 26 prerendered routes plus 404; 835 full-site checks and 26 accessibility audits passed; 185 service/About checks passed; 91 homepage checks passed. The eight requested widths are covered. A separate source comparison confirms the approved theme files, hero, marquee, statistics, event builder, navigation, footer, WhatsApp and deployment settings are unchanged. The final mobile process uses two columns, tablet uses three, and desktop uses six.