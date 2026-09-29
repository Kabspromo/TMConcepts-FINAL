import { mkdir, writeFile } from 'node:fs/promises';
const base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/';
await mkdir('public/fonts', {recursive:true});
for (const [source, destination] of [['Manrope%5Bwght%5D.ttf','manrope-variable.ttf'], ['OFL.txt','OFL.txt']]) {
  const response = await fetch(base + source);
  if (!response.ok) throw new Error(`Font asset request failed: ${response.status}`);
  await writeFile('public/fonts/' + destination, Buffer.from(await response.arrayBuffer()));
}
await writeFile('public/fonts/source.txt', 'Manrope variable font. SIL Open Font License 1.1.\nSource: https://github.com/google/fonts/tree/main/ofl/manrope\n');
console.log('Manrope variable font and license downloaded for local hosting.');