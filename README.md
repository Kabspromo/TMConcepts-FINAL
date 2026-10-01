# TM Concepts

React 19 / Vite website for TM Concepts, Ntinda, Kampala, Uganda.

## Run locally

~~~sh
npm install
npm run dev
~~~

Development: http://127.0.0.1:5173

~~~sh
npm run build
npm run preview
~~~

Production preview: http://127.0.0.1:4173

The build pre-renders 25 pages plus 404, with unique metadata, social cards, canonical URLs, structured data, sitemap and robots.txt. React hydrates the interactions. The existing framework, Vercel configuration, production domain and Git remote are preserved. This work has not been deployed.

## Edit the homepage

- **src/homepageContent.js** — four hero slides and their mobile crops; client logos; the approved 3+, 10+, 50+, 80% figures; production links; reasons to choose TM Concepts.
- **src/HomepagePolish.jsx** — homepage sequence and interactions.
- **src/StageLightAmbient.jsx** — reusable decorative stage beams.
- **src/homepage-polish.css** — homepage typography, editorial layout, animated borders, logo strip and responsive rules.
- **src/content.js** — services, project collection, media metadata, comparison pair, contact details and legacy URL aliases.
- **src/inventory.js** — equipment and furniture categories.
- **src/components.jsx** — shared navigation, media, cards, comparison, work marquee, process, CTA and footer.
- **src/ProjectBuilder.jsx** — enquiry steps, rental quantities, local attachments, brief download and WhatsApp handoff.

The homepage order is hero, clients, impact, vision, services, Build Your Event, featured work, production capabilities, Why TM Concepts and final CTA. The older HomeSections, homeContent and SiteEntrance files remain for preservation of earlier work; the app uses the files above.

The hero advances every six seconds, crossfades and supports swipe and keyboard arrows. Hover, keyboard focus, manual selection, off-screen state and hidden browser tabs pause it. Visitors can resume from the play control. Reduced motion disables autoplay, beams, moving borders and marquees. Counters run once for 1.8 seconds on entering view. The comparison supports pointer dragging, touch, arrow keys, Home and End.

## Media and provenance

See PHOTOGRAPHY.md for source details and replacement instructions.

The event portfolio uses six supplied Rotary installation photographs and stills extracted from three supplied event videos. No AI-generated event images are used. Neutral TM panels handle missing or failed media without exposing editing instructions. Client logos come from the existing supplied logo folder.

The comparison is a matched pair rendered from one furnished 3D scene: sofas, cocktail tables, conference chairs, stage, LED display, speakers, lights, truss and plants. Both views use the same model and camera. It is clearly labelled as design and final visualization, not as a completed event photograph. Three.js is a **development-only** rendering tool; it is not shipped in the website JavaScript.

Manrope is locally hosted as a 54 KB WOFF2 under the SIL Open Font License. Icons use Lucide.

## Media scripts

~~~sh
npm run media:prepare
npm run media:homepage
npm run media:design
~~~

The first command regenerates responsive versions of the six original photographs. The homepage command extracts video stills, prepares four hero files and optimizes supplied client logos. It requires the dev server on port 5173 and the original local uploads. It recreates the initial hero images, so do not run it over manually replaced hero files.

The design command also requires the dev server on port 5173. It renders scripts/event-scene.mjs through Chrome into static WebP pairs. Runtime pages never load the rendering code.

The production asset allowlist copies approved image folders and fonts. Original WhatsApp videos, large source uploads and development rendering scripts stay out of dist.

## Enquiries and rentals

Start a Project and the contact page share the preserved four-step brief builder. Event details, services, rental quantities, company, name, email, phone and message are included in a WhatsApp message for **+256 704 282 211**, or downloaded as a text brief.

Nothing is sent automatically. Attachments are validated and listed locally; they are not uploaded or attached to WhatsApp automatically. The visitor attaches files and sends the final message in WhatsApp. Briefs remain in page memory, and refresh clears them. Equipment specifications, availability, crew, delivery and prices are confirmed by quotation.

## Verification

With the production preview running:

~~~sh
npm test
npm run test:homepage
~~~

The main suite checks all 25 routes at 360, 375, 390, 412, 430, 768, 1024, 1440 and 1920 px, static SEO, loaded media, WCAG A/AA audits, navigation, legacy URLs, work filters, process tabs, rental search and quantities, enquiry validation, attachments, downloads and WhatsApp URL content.

The homepage suite additionally exercises autoplay and pause behavior, real touch swipe, mouse/touch/keyboard comparison controls, counters, logo loops, reduced motion, CTA behavior, exact mobile typography bounds and finished public copy. No messages are sent.

Tests use locally installed Chrome, Playwright and axe. Results and screenshots go to artifacts/redesign and artifacts/polish. Set TM_TEST_ORIGIN for another preview origin. Original historical test scripts remain under test:legacy.

Production Core Web Vitals require measurements after deployment. The implementation uses static HTML, responsive WebP, lazy media, a prioritized hero, reserved dimensions, compressed local typography and CSS/IntersectionObserver motion to keep loading efficient.
