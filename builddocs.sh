#!/bin/bash

cd Webz-core
npm run doc
npm run deploy-cover
cd ../examples/webz-task/
npm run build
cd ../webz-pong
npm run build
cd ../webz-lander
npm run build
