#! /bin/bash
git fetch
git pull
npm run --prefix frontend/ build
