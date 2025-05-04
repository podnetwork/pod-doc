#!/bin/bash

# this is template script help develop pod document content locally.
# 1. copy this file to new file with name doc-sync-local.sh
# 2. update the command below following:
#   - <local folder> = local folder path to folder contains markdown content on content repo
# 
# 3. run script by npm (or pnpm) to sync files from content repo to pod doc repo:
#   - npm run docsync:local
#   - pnpm run docsync:local

sh ./doc-sync.sh "local" "<local folder>"
