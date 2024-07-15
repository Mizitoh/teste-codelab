#!/bin/bash

rm -rf ./dist

npm cache clean --force
npm install --legacy-peer-deps
npm dedupe
#npm start
ng serve --watch --host 0.0.0.0 --disable-host-check --port 4200 --poll 2000
