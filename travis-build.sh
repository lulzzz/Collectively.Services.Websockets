#!/usr/bin/env bash
APP_ENV=""
case "$TRAVIS_BRANCH" in
  "develop")
    APP_ENV="dev"
    ;;
  "master")
    APP_ENV="prod"
    ;;    
esac

npm install