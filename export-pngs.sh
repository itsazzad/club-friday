#!/bin/sh
set -eu

cd "$(dirname "$0")"

if ! command -v inkscape >/dev/null 2>&1; then
  echo "Error: inkscape is required. Install it with: brew install --cask inkscape" >&2
  exit 1
fi

for source in \
  club-friday-logo.svg \
  club-friday-logo-dark.svg \
  club-friday-logo-bn.svg \
  club-friday-logo-dark-bn.svg
 do
  output=${source%.svg}.png
  inkscape "$source" --export-type=png --export-filename="$output" --export-width=1024 --export-height=1000 --export-background-opacity=0
  echo "Created $output"
done
