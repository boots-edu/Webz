#!/bin/bash

# Read the version number from package.json
version=$(grep -o '"version": *"[^"]*"' package.json | cut -d'"' -f4)

# Replace strings starting with "const version: string" in ./src/webez.ts
sed -i "s/const version: string.*/const version: string = '${version}';/" ./src/webez.ts
sed -i "s/framework for Typescript.*/framework for Typescript (${version})/" ../README.md
sed -i "s/\"\@gsilber\/webez\"\:.*/\"@gsilber\/webez\"\: \"\^${version}\",/" ./scaffold/package.json
