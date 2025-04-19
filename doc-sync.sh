#!/bin/bash

# store github pat token 
GITHUB_TOKEN="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"

# store github repo store remote markdown content
REPO_REMOTE_CONTENT="https://$GITHUB_TOKEN@github.com/tapforce/pod-docs-migration-tests.git/docs"

# note: degit & tiged has bug with folder name has special character like ( and )
# solution is we pull content to temp folder and copy back to correct position
# use internal bash shell
CACHE_FOLDER=".pull_cache"

# store local folder doc
FOLDER_DOC="src/routes/(doc)"

# default if argument not provided we should run all versions
ALLVERSIONS="v0,v1"

# argument 1
versions=$1

# load clone folder, if defined then copy directly files from this folder
clone_from=$2

echo "Syncing doc versions: $versions"

# If no version provided, get from env DOC_SYNC_VERSIONS
if [ -z "$versions" ]; then
  versions="${DOC_SYNC_VERSIONS}"
fi

# If no versions provided, use default
if [ -z "$versions" ]; then
  echo "No versions provided, using default: $ALLVERSIONS"
  versions="$ALLVERSIONS"
fi

# Split versions by comma and process each
IFS=',' read -ra VERSION_ARRAY <<< "$versions"
for version in "${VERSION_ARRAY[@]}"; do
  echo "Syncing doc $version..."
  
  rm -rf $CACHE_FOLDER 2>/dev/null || true # remove if exist

  mkdir -p $CACHE_FOLDER
  if [ -z "$clone_from" ]; then
    pnpm tiged --force $REPO_REMOTE_CONTENT#"doc/$version" $CACHE_FOLDER
  else
    cp -rf $clone_from/* $CACHE_FOLDER/
  fi
  
  # copy all file and folder from cache folder to doc folder
  rm -rf $FOLDER_DOC/$version/*
  mkdir -p $FOLDER_DOC/$version/
  cp -rf $CACHE_FOLDER/* $FOLDER_DOC/$version/

  # find and rename all files have name content.md to +page.md, need recursive
  find $FOLDER_DOC/$version/ -type f -name "content.md" -exec sh -c 'mv "$0" "${0/content.md/+page.md}"' {} \;
  echo "Transform content.md to +page.md completed"

  echo "Sync doc $version completed"

  # remove cache folder
  rm -rf $CACHE_FOLDER 2>/dev/null || true
done

# find the highest version follow ALLVERSION
HIGHEST_VERSION=$(echo "$versions" | tr ',' '\n' | sed 's/[^0-9]//g' | sort -n | tail -1)
HIGHEST_VERSION="v$HIGHEST_VERSION"

# copy folder name match HIGHEST_VERSION to new slibing folder named latest
if [ -d "$FOLDER_DOC/$HIGHEST_VERSION" ]; then
  echo "Highest version: $HIGHEST_VERSION"
  echo "Copy folder $FOLDER_DOC/$HIGHEST_VERSION to $FOLDER_DOC/latest"
  cp -rf $FOLDER_DOC/$HIGHEST_VERSION $FOLDER_DOC/latest
fi