#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const outputDir = path.join(root, 'logo');
const template = fs.readFileSync(path.join(root, 'logo-template.svg'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'logo-variants.json'), 'utf8'));
const presetCache = new Map();

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
    if (!variant.file || !/^club-friday-logo(?:-[a-z0-9-]+)?\.svg$/.test(variant.file) || files.has(variant.file)) {
      throw new Error(`Duplicate or missing variant file: ${variant.file || '<empty>'}`);
    }
    const artwork = resolvePreset(config.artworkPresets, variant.artwork);
    const text = resolvePreset(config.textPresets, variant.text);
    const paths = variant.paths || {};
    if (!artwork.structure || !artwork.badges || !artwork.ball || !artwork.action || !artwork.joining || !artwork.symbol) {
      throw new Error(`Incomplete artwork preset "${variant.artwork}" for ${variant.file}`);
    }
    if (!text.family || !Array.isArray(text.motto) || text.motto.length !== 3 || !Array.isArray(text.mottoColors) || text.mottoColors.length !== 3 || !text.name || !text.nameFill) {
      throw new Error(`Incomplete text preset "${variant.text}" for ${variant.file}`);
    }
    if (typeof paths.motto !== 'string' || typeof paths.name !== 'string') {
      throw new Error(`Incomplete geometry paths for ${variant.file}`);
    }
    files.add(variant.file);
  }
}

validateConfig();

const expectedFiles = new Set(config.variants.map((variant) => variant.file));
for (const file of fs.readdirSync(outputDir)) {
  if (/^club-friday-logo(?:-[a-z0-9-]+)?\.svg$/.test(file) && !expectedFiles.has(file)) {
    fs.unlinkSync(path.join(outputDir, file));
    const png = file.replace(/\.svg$/, '.png');
    if (fs.existsSync(path.join(outputDir, png))) fs.unlinkSync(path.join(outputDir, png));
    console.log(`Removed stale logo/${file}`);
  }
}

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
  const cacheKey = `${presets === config.artworkPresets ? 'artwork' : 'text'}:${name}`;
  if (!trail.length && presetCache.has(cacheKey)) return presetCache.get(cacheKey);
  const preset = presets[name];
  if (!preset) throw new Error(`Unknown preset "${name}"`);
  if (!preset.extends) {
    const resolved = {...preset};
    if (!trail.length) presetCache.set(cacheKey, resolved);
    return resolved;
  }
  if (trail.includes(name)) throw new Error(`Circular preset inheritance: ${[...trail, name].join(' -> ')}`);
  const resolved = mergePreset(resolvePreset(presets, preset.extends, [...trail, name]), preset);
  if (!trail.length) presetCache.set(cacheKey, resolved);
  return resolved;
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
    JOINING_STROKE: variant.paths?.hideJoiningStroke
      ? ''
      : `<path fill="none" stroke="${artwork.joining}" d="${escapeXml(variant.paths?.name || 'M136 426 Q256 400 376 426')}"/>`,
    SYMBOL: artwork.symbol,
    LEFT_SYMBOL_X: variant.symbols?.leftX ?? 106,
    RIGHT_SYMBOL_X: variant.symbols?.rightX ?? 406,
    SYMBOL_Y: variant.symbols?.y ?? 90,
    TEXT_FAMILY: text.family,
    MOTTO_SIZE: text.mottoSize,
    MOTTO_SPACING: text.mottoSpacing || 0,
    MOTTO_MARKUP: mottoMarkup(text),
    NAME: escapeXml(text.name),
    NAME_FILL: text.nameFill,
    NAME_SIZE: text.nameSize,
    NAME_SPACING: text.nameSpacing || 0,
    MOTTO_PATH: escapeXml(variant.paths?.motto || 'M121 155 Q256 58 391 155'),
    NAME_PATH: escapeXml(variant.paths?.name || 'M136 426 Q256 400 376 426'),
    MOTTO_BACKDROP: artwork.textBackdrop || artwork.structure,
    NAME_BACKDROP: artwork.textBackdrop || artwork.joining,
    MOTTO_BACKDROP_WIDTH: variant.paths?.mottoBackdropWidth || 0,
    NAME_BACKDROP_WIDTH: variant.paths?.nameBackdropWidth || 0,
    MOTTO_DY: variant.paths?.mottoDy || 0,
    NAME_DY: variant.paths?.nameDy || 0,
    TEXT_STROKE: artwork.textStroke || 'none',
    TEXT_STROKE_WIDTH: artwork.textStrokeWidth || 0
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
  const outputPath = path.join(outputDir, variant.file);
  const temporaryPath = `${outputPath}.tmp`;
  fs.writeFileSync(temporaryPath, render(variant));
  fs.renameSync(temporaryPath, outputPath);
  console.log(`Created logo/${variant.file}`);
}
