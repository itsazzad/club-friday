#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const outputDir = path.join(root, 'logo');
const template = fs.readFileSync(path.join(root, 'logo-template.svg'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'logo-variants.json'), 'utf8'));

fs.mkdirSync(outputDir, { recursive: true });

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function validateConfig() {
  if (!Array.isArray(config.variants) || !config.artworkPresets || !config.textPresets) {
    throw new Error('logo-variants.json must define artworkPresets, textPresets, and variants');
  }
  const files = new Set();
  for (const variant of config.variants) {
    if (!variant.file || files.has(variant.file)) {
      throw new Error(`Duplicate or missing variant file: ${variant.file || '<empty>'}`);
    }
    resolvePreset(config.artworkPresets, variant.artwork);
    resolvePreset(config.textPresets, variant.text);
    files.add(variant.file);
  }
}

validateConfig();

function mottoMarkup(settings) {
  return settings.motto.map((word, index) => {
    const separator = index === 0 ? '' : `<tspan dx="5" fill="${escapeXml(settings.mottoColors[index - 1])}">•</tspan>`;
    return `${separator}<tspan${index ? ' dx="5"' : ''} fill="${escapeXml(settings.mottoColors[index])}">${escapeXml(word)}</tspan>`;
  }).join('');
}

function mergePreset(base, override) {
  const merged = {...base};
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key]) {
      merged[key] = mergePreset(base[key], value);
    } else if (key !== 'extends') {
      merged[key] = value;
    }
  }
  return merged;
}

function resolvePreset(presets, name, trail = []) {
  const preset = presets[name];
  if (!preset) throw new Error(`Unknown preset "${name}"`);
  if (!preset.extends) return {...preset};
  if (trail.includes(name)) throw new Error(`Circular preset inheritance: ${[...trail, name].join(' -> ')}`);
  return mergePreset(resolvePreset(presets, preset.extends, [...trail, name]), preset);
}

function tokenValues(variant) {
  const artwork = resolvePreset(config.artworkPresets, variant.artwork);
  const text = resolvePreset(config.textPresets, variant.text);
  const value = {
    TITLE: escapeXml(variant.title),
    DESCRIPTION: escapeXml(variant.description),
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
    NAME: escapeXml(text.name),
    NAME_FILL: text.nameFill,
    NAME_SIZE: text.nameSize,
    NAME_SPACING: text.nameSpacing || 0,
    MOTTO_PATH: escapeXml(variant.paths?.motto || 'M121 155 Q256 58 391 155'),
    NAME_PATH: escapeXml(variant.paths?.name || 'M136 426 Q256 400 376 426')
  };
  return value;
}

function render(variant) {
  return Object.entries(tokenValues(variant)).reduce(
    (output, [token, value]) => output.replaceAll(`{{${token}}}`, String(value)),
    template
  );
}

for (const variant of config.variants) {
  fs.writeFileSync(path.join(outputDir, variant.file), render(variant));
  console.log(`Created logo/${variant.file}`);
}
