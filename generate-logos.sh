#!/bin/sh
set -eu

cd "$(dirname "$0")"
node generate-logos.js
./export-pngs.sh
