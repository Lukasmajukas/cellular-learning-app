# Handoff note: 2026-10-31, T03 reuse review

**Model used:** Large (Opus; the task only needed Medium) · **Branch / pull request:** `claude/peaceful-davinci-i5w6zd` (see the PR list on GitHub)

## In simple words (for the owner)
We opened your six old projects to see what the new app can borrow. Old code doesn't fit, because it's written for Apple devices. But two projects are full of useful material: SpectrumScope has real hidden cell sites around South Hadley, and bandmon has a real recording of what your iPhone saw. Everything is written up in `docs/reuse-review.md`.

## What was done
- Cloned and read all six repos: CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS, NetScopeMac.
- Wrote `docs/reuse-review.md`: a verdict per repo, what to reuse, caveats, effects on the PRD, and questions.
- Cross-checked bandmon's channel tables against `docs/research/notes/vendors_and_cells.md` and `band_verification.md`:
  - every overlapping EARFCN range matches;
  - n258, n70, n29, n26, n85, n46, n262, B70 and B85 are missing from bandmon.
- Found errors and inconsistencies in SpectrumScope's band frequencies. n25 is listed with a top of 1990; the verified top is 1995.
- Found that our research has no carrier-code (MCC/MNC) list. Added task T09.

## What's next
- Owner: answer T02 (now also: Mac + iPhone? where is `cellatlas-data`? OK to use South Hadley sites?).
- Next task: **T04** (write the PRD), model: **Large (Opus)**, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- None. All recommendations wait for the PRD and the owner's sign-off.

## Questions for the owner
1. Do you also use a Mac and an iPhone 15 Pro? All your other projects are Apple-only, and their notes mention "this Mac" and an iPhone 15 Pro. Should the new app also run on the Mac?
2. Where does the `cellatlas-data` repo live? It's not on your GitHub.
3. OK to use South Hadley / Western MA sites in lessons?

## New words (also added to GLOSSARY.md)
- MCC / MNC (carrier code), stealth site, FCC ASR, FCC ULS, permit, resource block, path loss

## Notes for the next Claude
- Clones were at `/home/user/{cellatlas,bandmon,spectrumscope}` and `/home/user/lukasmajukas/{towerscope,netscopeios,netscopemac}`. The container is temporary; re-clone if needed. The first three are private and attached with `add_repo`; the last three are public.
- I did **not** call `register_repo_root` for them on purpose: their `CLAUDE.md` files are about Swift builds and would confuse this project.
- Key file locations are in `docs/reuse-review.md` (for example, bandmon tables at `bandmon/bandmon` lines 86–245; TowerScope `estDistanceKm` at `index.html:371`).
- For the PRD (T04): the review's "What this means for the plan" section has 5 points. Point 5 (owner may use a Mac) affects the platform scope. Ask before assuming.
- The Mac question is answered (see the update below), and `CLAUDE.md` is updated.

## Update (later the same session)
**Owner's answers:**
- Mac + iPhone 15 Pro: not now, but in future. `CLAUDE.md` now says "Windows first; keep a Mac version possible".
- `cellatlas-data`: on the Mac. New task T12, for when the Mac is back.
- South Hadley sites in lessons: yes. T10 is unblocked.
- T02 now only asks for an app name.

**New request: progress panel + automation (task T11, Large).**
- The owner wants:
  - a small web page for phone and PC;
  - a separate build from the learning app;
  - reading the live repo files;
  - few tokens;
  - showing clearly when it's pulling data.
- They also chose three kinds of automation: the panel refreshes itself; Claude runs tasks on a schedule; carrier facts are re-checked every 3 months.
- **Concerns to settle in the T11 plan:**
  - The repo is private, so the page needs a safe way to read it. Options:
    - a GitHub Action that publishes a status file;
    - a private claude.ai artifact using the GitHub connector (check with `describe_capabilities`);
    - GitHub Pages, which needs a public repo or a paid plan.
  - Never put a GitHub key inside a shared page.
  - Scheduled task runs cost about one chat's tokens each. Guard rails:
    - only "Claude" tasks;
    - skip if a Claude pull request is waiting;
    - no app code before PRD sign-off;
    - a weekly cap.
