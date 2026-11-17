# 🔄 How the app updates itself

**In simple words:** you install the app by hand one last time. After that it looks for a newer version by itself, fetches it quietly, and uses it the next time you open the app. It's like a phone app updating overnight. (Built in task T76, Nov 2026.)

## What you'll see
- **Nothing, most of the time.** About 15 seconds after the app opens, and then every 4 hours, it asks "is there a version newer than mine?".
- **"A new version is ready"**, a small blue note at the top, once a newer version has been fetched. You can ignore it or close it: you get the new version the next time you open the app. Or press **Restart now** to get it at once.
- **Never in the middle of a lesson.** The note only shows on the path and the other tabs.
- **In ⚙️ Settings, the "Updates" card:**
  - **Update by itself**: a switch. Off means the app never looks.
  - **Version**: the number of the version you have, what the updater is doing, and a **Check now** button.

## What you don't have to do any more
- Download `Setup.exe` for every new version.
- Click past Windows' blue "Windows protected your PC" box each time. An update the app fetches itself shouldn't show it. (That's how Windows normally works, but nobody has seen it on your PC yet: if the box does show after an update, tell Claude.)

## Your one-time steps
### Step 1: install the new installer once (you must)
The version on your PC from Nov 15 can't update itself yet: the updater isn't in it.
1. Open https://github.com/Lukasmajukas/cellular-learning-app/releases/tag/latest-build
2. Download **`Cell-Learning-Setup.exe`** and double-click it. The blue box shows one last time: **More info**, then **Run anyway**.
3. Open ⚙️ Settings. The "Updates" card shows a version number like `0.1.180`. Your stars are still there.

From now on, updates come by themselves. They already work at this point, through GitHub (the spare address).

### Step 2: switch on the Cloudflare front door (when you like; about 10 clicks)
Until you do this, the app asks GitHub directly, which works fine. Cloudflare adds one address that never changes, even if the files move one day.

I can't click in your Cloudflare account, so these steps are yours. Nothing secret is needed, and never paste a password or key into a chat. *(Button names read from Cloudflare's help pages on 2026-11-17. If a button is called something else, send Claude a screenshot.)*

1. Go to https://dash.cloudflare.com and make a free account (email and password). It doesn't ask for a bank card for this.
2. In the menu on the left, click **Workers & Pages**.
3. Click **Create application**.
4. Choose **GitHub**. Sign in to GitHub when it asks. If it asks which repositories it may see, choose **Only select repositories** and pick `cellular-learning-app`.
5. Pick `cellular-learning-app` from the list.
6. On the "configure your project" page, set:
   - **Project name:** `cell-learning-updates` (exactly; a different name makes it fail)
   - **Root directory:** `update-server`
   - leave everything else as it is (the branch is `main`, the deploy command is `npx wrangler deploy`)
7. Click **Save and Deploy**. Wait about a minute.
8. Cloudflare shows the new address. It ends in **`.workers.dev`**, like `https://cell-learning-updates.yourname.workers.dev`. Open it in your browser. It should say: `Cell Learning update server: OK`.
9. **Paste that address into any chat** and type `Switch on the Cloudflare address`. Claude puts it into the app, and the next update carries it to your PC by itself.

Two tidy-ups, while you're there (optional, they only save noise):
- **Settings → Build → Branch control:** untick **Enable Preview Builds**. Otherwise Cloudflare writes a comment on every pull request.
- **Settings → Build → Build watch paths:** set the include path to `update-server/*`. Then Cloudflare only rebuilds the front door when the front door itself changes.

**If step 4 to 7 won't work:** tell Claude. The fallback is to paste the 50 lines of `update-server/src/worker.js` into Cloudflare's own editor.

## What if...?
| What happened | What to do |
|---|---|
| I don't want updates for a while | ⚙️ Settings → Updates → switch off **Update by itself**. |
| I want the newest version right now | ⚙️ Settings → Updates → **Check now**. If there is one, the note appears after the download (about 160 MB). |
| Settings says "Couldn't look just now" | Nothing. No internet is normal; it tries again by itself. If it stays for days, open "What happened" under it and tell Claude what it says. |
| A new version looks broken | Tell Claude in any chat. Claude fixes it, and the fix arrives by itself. If the app won't open at all, download `Cell-Learning-Setup.exe` again (Step 1): your progress stays. |
| My internet has a data limit | Each update is about 160 MB. Switch off **Update by itself** and use **Check now** when you're on Wi-Fi. |
| Cloudflare stops working one day | Nothing. The app asks GitHub instead, by itself. |

## What leaves your PC
Only the question "is there a version newer than mine?" (with your version number). Cloudflare and GitHub see your internet address, like any website you visit. Nothing about your lessons, stars or progress is sent, ever.

## How it works (for Claude and the curious)
```
the app (15 s after start, then every 4 h)
   │  asks the first address in app/electron/update-feeds.json
   ▼
Cloudflare Worker  /win/RELEASES ──fetches──▶ GitHub Releases, slot "latest-build"
   │  if that fails, the app asks the next address:
   └────────────────────────────────────────▶ GitHub Releases directly
```
- **The files** live on the project's Releases page, in the one "Latest build" slot: `Cell-Learning-Setup.exe` (first install), `CellLearning-<version>-full.nupkg` (the package), and `RELEASES` (a tiny list naming the newest package, its size and a check code).
- **Who puts them there:** the Windows build (`.github/workflows/app-build.yml`), after every change to the app on `main`, and only if every test passed. That includes a test that really installs an old version and lets it update itself (`app/tools/update-e2e.mjs`).
- **Version numbers:** `0.1.<number of saved changes>`, stamped by the build (`app/tools/stamp-version.mjs`). They only go up.
- **The updater:** `app/electron/updater.cjs` (the thinking, with tests), started in `app/electron/main.cjs` before any window. It uses the installer's own helper, `Update.exe`, which is already on the PC.
- **The front door:** `update-server/src/worker.js`. It hands over the list and points at GitHub for the package. No storage, no secrets.
- **Free:** Cloudflare's free plan allows 100,000 requests a day; the app makes a handful. GitHub Releases are free for public projects.
- **Not built:** Mac updates (Apple demands paid signing); smaller "only the changed parts" downloads; a mode for a private repository (the Worker would then need a GitHub token, kept inside Cloudflare).
