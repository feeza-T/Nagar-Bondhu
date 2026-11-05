// Run: node scripts/checkLocales.js  -> lists keys that exist in en.json but are missing in bn.json
import fs from 'node:fs';
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? flat(v, `${p}${k}.`) : [`${p}${k}`]));
const en = flat(JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8')));
const bn = new Set(flat(JSON.parse(fs.readFileSync('src/locales/bn.json', 'utf8'))));
const missing = en.filter((k) => !bn.has(k));
console.log(missing.length ? `Missing in bn.json:\n${missing.join('\n')}` : 'bn.json has every key from en.json ✔');
