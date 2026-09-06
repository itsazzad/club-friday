#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const template = fs.readFileSync(path.join(root, 'logo-template.svg'), 'utf8');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'logo-variants.json'), 'utf8'));

function artwork(variant) {
  const palette = variant.artwork;
  const structure = palette.structure;
  const outline = palette.outline ? ` stroke="${palette.outline}"` : '';
  const badge = (x, y, width, height, radius, role, label) => {
    const center = palette.badgeInner
      ? `\n      <circle cx="${x + width / 2}" cy="${y + height / 2}" r="${width === 84 ? 9 : 7}" fill="${palette.badgeInner}" stroke="none"/>`
      : '';
    return `    <g id="${label}" aria-label="${label}">\n      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${palette.badges[role]}"${outline}/>${center}\n    </g>`;
  };

  return `  <g stroke="${structure}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">
    <path fill="none" stroke="${structure}" d="M103 333a178 178 0 1 1 306 0"/>

${badge(114, 218, 60, 58, 20, 'younger', 'younger-member')}

${badge(214, 153, 84, 84, 26, 'adult', 'adult-member')}

${badge(338, 218, 60, 58, 20, 'older', 'older-member')}

    <circle cx="256" cy="316" r="55" fill="${palette.ball.fill}" stroke="${palette.ball.stroke}" stroke-width="${palette.ball.strokeWidth || 12}"/>
    <path fill="none" stroke="${palette.ball.panel}" stroke-width="9" d="M256 273c-16 11-25 25-25 43s9 32 25 43m0-86c16 11 25 25 25 43s-9 32-25 43m-43-43h86"/>

    <path fill="none" stroke="${palette.action}" stroke-width="8" d="M181 303h-18M186 293l-15-10M186 313l-15 10M331 303h18M326 293l15-10M326 313l15 10"/>
    <path fill="none" stroke="${palette.joining}" d="M91 395c48 48 105 72 165 72s117-24 165-72"/>

    <path fill="${palette.symbol}" stroke="${palette.symbol}" stroke-width="6" d="m96 364 8 8-8 8-8-8z"/>
    <path fill="${palette.symbol}" stroke="${palette.symbol}" stroke-width="6" d="m416 364 8 8-8 8-8-8z"/>
  </g>`;
}

function text(variant) {
  const settings = variant.text;
  const motto = settings.motto.map((word, index) => {
    const separator = index === 0 ? '' : `<tspan dx="5" fill="${settings.mottoColors[index - 1]}">•</tspan>`;
    return `${separator}<tspan${index ? ' dx="5"' : ''} fill="${settings.mottoColors[index]}">${word}</tspan>`;
  }).join('');
  const mottoSpacing = settings.mottoSpacing ? ` letter-spacing="${settings.mottoSpacing}"` : '';
  const nameSpacing = settings.nameSpacing ? ` letter-spacing="${settings.nameSpacing}"` : '';

  return `  <g font-family="${settings.family}" text-anchor="middle">
    <text font-size="${settings.mottoSize}" font-weight="700"${mottoSpacing}>
      <textPath href="#motto-arc" xlink:href="#motto-arc" startOffset="50%">${motto}</textPath>
    </text>
    <text fill="${settings.nameFill}" font-size="${settings.nameSize}" font-weight="800"${nameSpacing}>
      <textPath href="#name-arc" xlink:href="#name-arc" startOffset="50%">${settings.name}</textPath>
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
