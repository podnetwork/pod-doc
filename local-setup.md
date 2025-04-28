Explaining Pod document site local development

Let's say we have two git repositories:

- (A) the pod document site repository (main site)
- (B) the content repository (contains markdown files, manage version by git branch)

We want to run pod doc site (A) locally, then make changes on content (B) and see the changes in the local pod doc site.

Steps:

1. Clone pod document git (A) to local

   - switch to branch want to work on, example branch `dev`

2. Clone content git (B) to local

   - switch to branch want to work on, example branch `doc/v1`

3. Open (A) directory on code editor, open file `doc-sync-local-sample.sh` and read the instruction:

   - copy this file to new file `doc-sync-local.sh`
   - following the command, update the version name and branch name of (B) in the file.
     - example: `v1:doc/v1`
   - following the command, update the path of doc files (B) in the file.
     - example: `<relative path to (B) directory>/docs` (`docs` is folder inside (B) that contains markdown files)
   - run command bellow to sync doc files from (B) to (A):
     - `npm run docsync:local`

4. Install (A) dependencies:
   - run `npm install` (or use yarn, pnpm, etc.). Recommended to use `pnpm`
   - copy file `.env.sample` to `.env` and add dev env variable.

5. Run (A) locally:
   - run `npm run dev` (or use yarn, pnpm, etc.).
   - open browser at `http://localhost:5173`
   - switch to version we want work on (example: `v1`)

6. Make changes on content (B):
   - make changes on content (B)
   - run `npm run docsync:local` to sync changes to (A)
   - site (A) will be hot reloaded
   