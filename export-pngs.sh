#!/bin/sh
set -eu

cd "$(dirname "$0")"

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "Error: rsvg-convert is required. Install it with: brew install librsvg" >&2
  exit 1
fi

for source in \
  club-friday-logo.svg \
  club-friday-logo-dark.svg \
  club-friday-logo-bn.svg \
  club-friday-logo-dark-bn.svg
 do
  output=${source%.svg}.png
  rsvg-convert --width 1024 --height 1000 --keep-aspect-ratio --output "$output" "$source"
  echo "Created $output"
done
