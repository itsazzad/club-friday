#!/bin/sh
set -eu

cd "$(dirname "$0")"

if ! command -v inkscape >/dev/null 2>&1; then
	echo "Error: inkscape is required. Install it with: brew install --cask inkscape" >&2
	exit 1
fi

node generate-logos.js

for source in logo/*.svg; do
	temporary="${source}.tmp.svg"
	inkscape "$source" \
		--export-text-to-path \
		--export-plain-svg \
		--export-filename="$temporary"
	mv "$temporary" "$source"
	echo "Converted text to paths in $source"
done

./export-pngs.sh
