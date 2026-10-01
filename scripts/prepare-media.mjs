import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const photos = [
  ['rotary-awards', 'WhatsApp Image 2026-09-30 at 2.24.58 PM.jpeg'],
  ['rotary-presentation', 'WhatsApp Image 2026-09-30 at 2.24.58 PM (1).jpeg'],
  ['rotary-stage', 'WhatsApp Image 2026-09-30 at 2.24.58 PM (2).jpeg'],
  ['rotary-installation', 'WhatsApp Image 2026-09-30 at 2.24.59 PM.jpeg'],
  ['rotary-celebration', 'WhatsApp Image 2026-09-30 at 2.24.59 PM (1).jpeg'],
  ['rotary-podium', 'WhatsApp Image 2026-09-30 at 2.24.59 PM (2).jpeg'],
];
for (const folder of ['projects','services','equipment','team','about','design','brand']) {
  await mkdir(`public/images/${folder}`, { recursive: true });
  if (folder !== 'projects' && folder !== 'brand') await writeFile(`public/images/${folder}/.gitkeep`, '');
}
for (const [name, source] of photos) {
  for (const width of [480, 800, 1280]) {
    await sharp(`public/images/${source}`).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/images/projects/${name}-${width}.webp`);
  }
}
const logo = await sharp('public/images/tm-logo.png').resize({width:500}).toBuffer();
await sharp(logo).extract({left:105,top:95,width:310,height:145}).webp({quality:90}).toFile('public/images/brand/tm-logo.webp');
console.log('Prepared responsive copies of six supplied photographs and the original logo.');
