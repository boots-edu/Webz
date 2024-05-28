#!/bin/bash

cd Webz-core
npm run build
npm run pub
cd ../Webz-cli
npm run build
npm run pub
cd ../examples/webz-task
npm i -D @boots-edu/webz
npm run build
cd ../webz-lander
npm i -D @boots-edu/webz
npm run build
cd ../webz-pong
npm i -D @boots-edu/webz
npm run build
cd ../..
./builddocs.sh
