#!/usr/bin/env bash
set -euo pipefail

npm run build
rm -rf android/app/src/main/assets/web
mkdir -p android/app/src/main/assets/web
cp -R dist/. android/app/src/main/assets/web/
printf 'Android WebView assets prepared in android/app/src/main/assets/web\n'
