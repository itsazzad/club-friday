#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const outputDir = path.join(root, 'logo');
const template = fs.readFileSync(path.join(root, 'logo-template.svg'), 'utf8');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'logo-variants.json'), 'utf8'));

function mottoMarkup(settings) {
  return settings.motto.map((word, index) => {
    const separator = index === 0 ? '' : `<tspan dx="5" fill="${settings.mottoColors[index - 1]}">•</tspan>`;
    return `${separator}<tspan${index ? ' dx="5"' : ''} fill="${settings.mottoColors[index]}">${word}</tspan>`;
  }).join('');
}

function tokenValues(variant) {
  const artwork = variant.artwork;
  const text = variant.text;
  const value = {
    TITLE: variant.title,
    DESCRIPTION: variant.description,
    STRUCTURE: artwork.structure,
    BADGE_OUTLINE: artwork.outline || artwork.structure,
    YOUNGER: artwork.badges.younger,
    ADULT: artwork.badges.adult,
    OLDER: artwork.badges.older,
    BADGE_INNER: artwork.badgeInner || 'none',
    BALL_FILL: artwork.ball.fill,
    BALL_STROKE: artwork.ball.stroke,
    BALL_STROKE_WIDTH: artwork.ball.strokeWidth || 12,
    BALL_PANEL: artwork.ball.panel,
    ACTION: artwork.action,
    JOINING: artwork.joining,
    SYMBOL: artwork.symbol,
    TEXT_FAMILY: text.family,
    MOTTO_SIZE: text.mottoSize,
    MOTTO_SPACING: text.mottoSpacing || 0,
    MOTTO_MARKUP: mottoMarkup(text),
    NAME: text.name,
    NAME_FILL: text.nameFill,
    NAME_SIZE: text.nameSize,
    NAME_SPACING: text.nameSpacing || 0
  };
  return value;
}

function render(variant) {
  return Object.entries(tokenValues(variant)).reduce(
    (output, [token, value]) => output.replaceAll(`{{${token}}}`, String(value)),
    template
  );
}

for (const variant of variants) {
  fs.writeFileSync(path.join(outputDir, variant.file), render(variant));
  console.log(`Created logo/${variant.file}`);
}
