#!/usr/bin/env bash
set -e

echo "==============================================================================="
echo "        WORLD MODEL: LEARN, IMAGINE, ACT - WEB APPLICATION LAUNCHER"
echo "                NBA Accreditation Showcase (20 Nov 2026)"
echo "==============================================================================="
echo ""

HOST_ARG="127.0.0.1"
for arg in "$@"; do
    if [ "$arg" == "--lan" ]; then
        HOST_ARG="0.0.0.0"
    fi
done

echo "[*] Target host: $HOST_ARG"
echo "[*] Starting World Model Web Server..."

python3 -m web.server --host "$HOST_ARG" "$@"
