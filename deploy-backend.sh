#!/bin/bash

while getopts e: flag
do
    case "${flag}" in
        e) branch=${OPTARG};;
    esac
done

case $branch in
  master) 
    environment="prod";
    ;;
  develop) 
    environment="dev";
    ;;
esac

echo "Deploying to $environment";

cd backend
python3 --version
npm ci
./node_modules/.bin/serverless deploy --stage $environment
