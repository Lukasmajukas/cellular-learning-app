# Handoff note: 2026-11-15, T76 the app updates itself (Cloudflare front door, GitHub spare)

**Status:** IN PROGRESS
**Model used:** Extra large (Fable), High effort, a chat the owner started · **Branch / pull request:** claude/practical-bardeen-0ma5s5, pull request pending

## In simple words (for the owner)
You asked for the app to update itself, with Cloudflare as the server, for free. I'm building that: you install by hand one last time, and after that the app finds and fetches new versions by itself.

## What was done
- (in progress) The owner approved the plan in chat on 2026-11-15, with three choices: Cloudflare is the front door and GitHub the spare; updates arrive quietly and are used at the next start; every tested build may reach the PC.
- Started while another chat was busy with T67 (pull request #176): the owner chose "Do both at the same time" when asked. That chat uses T74, T75 and session 171, so this is T76 and session 172.

## What's next
- (in progress)

## Decisions made (also added to docs/DECISIONS.md)
- (in progress)

## Questions for the owner
- (in progress)

## New words (also added to GLOSSARY.md)
- (in progress)

## Notes for the next Claude
(in progress) The approved plan: version numbers from the commit count, `RELEASES` and the `.nupkg` on the `latest-build` release, `app/electron/updater.cjs`, a Worker in `update-server/`, a real install-and-update test on the Windows build.
