# The update front door (a Cloudflare Worker)

**In simple words:** the installed app asks this tiny program "is there a newer version?". It passes the question on to the project's GitHub Releases page. It is free, stores nothing, and holds no passwords.

- The code: `src/worker.js` (about 50 lines, with comments).
- Its settings: `wrangler.jsonc`.
- How to put it online (the owner's steps) and how updates work: `docs/updates.md`.
- Its tests: `app/src/updateServer.test.ts`, and the real install-and-update test `app/tools/update-e2e.mjs`.
