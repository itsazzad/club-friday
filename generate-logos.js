#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const template = fs.readFileSync(path.join(root, 'logo-template.svg'), 'utf8');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'logo-variants.json'), 'utf8'));

function color(value, fallback) {
  return value || fallback;
}

function artwork(variant) {
  const c = variant.colors;
  const structure = color(c.structure, '#17324D');
  const outline = c.outline ? ` stroke="${c.outline}"` : '';
  const inner = c.inner;
  const jersey = variant.jersey;
  const oneColor = variant.oneColor;
  const badgeFill = jersey ? structure : c;
  const badge = (x, y, width, height, radius, center, label) => {
    if (oneColor) {
      return `    <g id="${label}" aria-label="${label}">\n      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/>\n    </g>`;
    }
    const fill = jersey ? structure : badgeFill[center];
    return `    <g id="${label}" aria-label="${label}">\n      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}"${outline}/>\n      <circle cx="${x + width / 2}" cy="${y + height / 2}" r="${width === 84 ? 9 : 7}" fill="${inner}" stroke="none"/>\n    </g>`;
  };
  const ballFill = oneColor ? 'none' : color(inner, structure);
  const ballStroke = oneColor || jersey ? structure : c.gold;
  const ballPanel = oneColor || jersey ? structure : c.gold;
  const action = oneColor || jersey ? structure : c.adult;
  const joining = oneColor || jersey ? structure : c.unity;
  const symbol = oneColor || jersey ? structure : c.gold;
  const outerStroke = structure;
  const strokeWidth = variant.bangla ? 13 : 13;

  return `  <g stroke="${structure}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <path fill="none" stroke="${outerStroke}" d="M103 333a178 178 0 1 1 306 0"/>

${badge(114, 218, 60, 58, 20, 'younger', 'younger-member')}

${badge(214, 153, 84, 84, 26, 'adult', 'adult-member')}

${badge(338, 218, 60, 58, 20, 'older', 'older-member')}

    <circle cx="256" cy="316" r="55" fill="${ballFill}" stroke="${ballStroke}" stroke-width="${oneColor || jersey ? 13 : 12}"/>
    <path fill="none" stroke="${ballPanel}" stroke-width="9" d="M256 273c-16 11-25 25-25 43s9 32 25 43m0-86c16 11 25 25 25 43s-9 32-25 43m-43-43h86"/>

    <path fill="none" stroke="${action}" stroke-width="8" d="M181 303h-18M186 293l-15-10M186 313l-15 10M331 303h18M326 293l15-10M326 313l15 10"/>

    <path fill="none" stroke="${joining}" d="M91 395c48 48 105 72 165 72s117-24 165-72"/>

    <path fill="${symbol}" stroke="${symbol}" stroke-width="6" d="m96 364 8 8-8 8-8-8z"/>
    <path fill="${symbol}" stroke="${symbol}" stroke-width="6" d="m416 364 8 8-8 8-8-8z"/>
  </g>`;
}

function text(variant) {
  const c = variant.colors;
  const family = variant.bangla ? 'Kohinoor Bangla, Bangla Sangam MN, sans-serif' : 'Avenir Next, Trebuchet MS, Arial, sans-serif';
  const size = variant.bangla ? 28 : 32;
  const motto = variant.motto;
  let mottoMarkup;
  if (variant.jersey || variant.oneColor) {
    mottoMarkup = motto.join(' • ');
  } else {
    const colors = [c.structure, c.unity, c.gold];
    mottoMarkup = motto.map((word, index) => `${index ? '<tspan dx="5" fill="' + colors[index - 1] + '">•</tspan><tspan dx="5" ' : '<tspan ' }fill="${colors[index]}">${word}</tspan>`).join('');
  }
  return `  <g font-family="${family}" text-anchor="middle">
    <text font-size="14" font-weight="700"${variant.bangla ? '' : ' letter-spacing="1.5"'}>
      <textPath href="#motto-arc" xlink:href="#motto-arc" startOffset="50%">${mottoMarkup}</textPath>
    </text>
    <text fill="${c.text}" font-size="${size}" font-weight="800"${variant.bangla ? '' : ' letter-spacing="4"'}>
      <textPath href="#name-arc" xlink:href="#name-arc" startOffset="50%">${variant.bangla ? 'ক্লাব ফ্রাইডে' : 'CLUB FRIDAY'}</textPath>
    </text>
  </g>`;
}

for (const variant of variants) {
  const output = template
    .replace('{{TITLE}}', variant.title)
    .replace('{{DESCRIPTION}}', variant.description)
    .replace('{{ARTWORK}}', artwork(variant))
    .replace('{{TEXT}}', text(variant));
  fs.writeFileSync(path.join(root, variant.file), output);
  console.log(`Created ${variant.file}`);
}
