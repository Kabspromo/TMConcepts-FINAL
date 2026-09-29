# TM Concepts

A cinematic, responsive website for TM Concepts, Kampala. Built with React, Vite and locally hosted imagery and fonts.

## Run locally

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**.

```sh
npm run build
npm run preview
```

`dist/` is the production output. It can be hosted on a static website host. The site uses hash routes, so its inner pages work without server rewrite rules. Deploy at the domain root; asset URLs are absolute.

## Included

- Responsive homepage, concepts/work listing, individual concept pages, 3D design, production, rentals and about pages.
- The supplied logo, monochrome typography, atmospheric imagery, restrained transitions and reduced-motion support.
- Interactive wireframe/lighting comparison, five-stage production sequence, keyboard-accessible process tabs and perspective control.
- Filterable and searchable production inventory with equipment detail dialogs, selection and adjustable quantities.
- Four-step event brief builder with field validation, optional local file selection, review and text download.
- WhatsApp enquiry handoff to **+256 704 282 211**. The prepared message includes event details, services, equipment quantities and contact details. The visitor reviews and sends it in WhatsApp.
- Responsive navigation, modal focus handling, accessible labels, native date input and mobile WhatsApp action.

## Content and launch notes

The supplied brief is treated as a creative reference. The site uses the supplied Kampala location and contact number. No customer names, project credits, testimonials, completed-project counts or equipment model specifications have been invented.

The project cards are explicitly labelled **concept studies**. Supplied event imagery illustrates concepts and is not evidence of TM Concepts commissions. Stage scenes and equipment graphics are original SVG illustrations. The production sequence is an illustrated presentation. The homepage also includes two licensed stock-footage clips: a muted Full HD video background and a playable Full HD showreel. These clips do not depict TM Concepts events. The comparison matches a wireframe and lighting concept; it does not claim a photographed event is the final version of that concept.

Use only authorised project photography, verified before/after pairs, venue-specific renders and approved company footage when representing completed work. Confirm equipment availability and business information before publishing. Social account links require approved URLs.

The builder has **no server-side submission, storage or email delivery**. Data stays in page memory until the visitor follows the WhatsApp link or downloads the brief. Files are not uploaded or transmitted: their names are included in the brief, with clear instructions to attach the actual files in WhatsApp. Refreshing the page clears the draft. A production upload/CRM workflow would require a backend and an agreed privacy policy.

## Edit content

- `src/data.js`: services, concepts, equipment categories and phone/WhatsApp contact.
- `src/App.jsx`: pages, navigation, content and interactive sections.
- `src/ProjectBuilder.jsx`: event brief and WhatsApp handoff.
- `src/StageScene.jsx`: original stage and equipment illustrations.
- `src/styles.css`: responsive styling and motion preferences.
- `public/images/`: supplied logo and illustrative photography.

## Verification

```sh
# Start the site first, then in a second terminal:
npm test
```

The verification script uses an installed Google Chrome via Playwright. It checks desktop/mobile layouts, all main routes and assets, equipment selection, form validation, brief content, download, keyboard interactions and axe accessibility audits. It never sends WhatsApp messages. Screenshots and results are saved to `artifacts/`.

## Asset credits

- TM Concepts logo: supplied by the user (`TM LOGO1.png`).
- Supplied event imagery: concept and illustrative use; not documentation of completed TM Concepts commissions.
- Manrope: Google Fonts, SIL Open Font License. The licence is included at `public/fonts/OFL.txt`.
- Interface icons: Lucide React, ISC licence.

This project is prepared locally and has not been published to a public host.

## Homepage update

- Home is visible in the desktop navigation, as a mobile header shortcut and in the full menu.
- Client logos and company figures are omitted until approved brands and verified numbers are supplied.
- A brief services section uses five supplied event photographs, with direct links to the relevant pages.
- Featured events link to concert, conference and wedding concept pages.
- Real Full HD stock footage is hosted locally; the hero video has a pause button and respects reduced-motion and data-saving preferences.
- A recognisable WhatsApp icon floats at the bottom-right on every page, on desktop and mobile.

Change homepage media and approved client logos in `src/homeContent.js`; add verified company figures there when available. Client logo entries require an approved logo image path.

Video source pages and credits: [Mixkit DJ playing music on stage](https://mixkit.co/free-stock-video/dj-playing-music-on-stage-4026/) and [Mixkit DJ playing on a stage with LED screens](https://mixkit.co/free-stock-video/dj-playing-on-a-stage-with-led-screens-4187/). Asset details are recorded in `public/videos/CREDITS.md`.

`npm test` covers the original user flows and homepage behavior, including Full HD playback, Home navigation and WhatsApp visibility at four screen widths.
