#! /bin/bash
git fetch
git pull
npm heroku-postbuild
