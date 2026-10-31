# 📡 Cellular Learning App (working name)

## What is this?
A learning game for your computer, like Duolingo. Instead of a language, it teaches you two things:
1. **Cell phone bands.** These are the "radio lanes" phones use in the US, like n71, n41 and n77. You'll learn what frequencies they use and which phone company uses which.
2. **Spotting cell towers.** You'll learn what kind of site you're looking at, what brand of equipment is on it, and which phone company runs it.

It's just for you, not for sale. Claude writes the code; you decide what you want and test it.

---

## 🗺️ Where are we?

Level 1 Research ✅ → **Level 2 The Plan 👉 you are here** → Level 3 Test build → Level 4 First playable version → Level 5 Polish → Level 6 Keep it fresh

All the levels are explained in [ROADMAP.md](ROADMAP.md).

---

## 🎮 How to work with Claude (do this every time)

1. **Start a new chat** with this repository selected.
2. **Pick the model** that [TASKS.md](TASKS.md) says. Most of the time that's Sonnet.
3. **Type:** `Do the next task in TASKS.md`
4. **Look at the pull request.** When Claude finishes, it gives you one: a "here's what I changed" page. Look at it, then merge it (steps below).
5. **Close the chat.** Next task, new chat. Claude will also tell you when it's time.

There are more messages you can copy and paste in [CHEATSHEET.md](CHEATSHEET.md).

### How to merge a pull request (accept Claude's changes)
1. On GitHub, click **Pull requests** at the top of the page and open the newest one.
2. If it says **Draft**, click **Ready for review**.
3. Click **Merge pull request**, then **Confirm merge**. Done ✅

Not happy? Don't merge. Just tell Claude what to change.

---

## 📁 What's in here (the map)
| Where | What it is | Who it's for |
|---|---|---|
| `README.md` | This page. Start here. | You |
| `ROADMAP.md` | The levels, and where we are | You |
| `TASKS.md` | The to-do list, with which model to use | You and Claude |
| `CHEATSHEET.md` | Messages you can copy and paste to Claude | You |
| `GLOSSARY.md` | Every tricky word, explained simply | You |
| `CLAUDE.md` | Claude's memory card. Claude reads it first in every chat. | Claude |
| `docs/PROGRESS-LOG.md` | A diary: one line per chat about what happened | You |
| `docs/DECISIONS.md` | Every decision we made, and why | You and Claude |
| `docs/sessions/` | Handoff notes: how one chat passes the baton to the next | Claude (you can peek) |
| `docs/research/` | The research report and notes | Claude (you can peek) |
| `content/` | Later: band facts and lessons | (empty for now) |
| `app/` | Later: the app's code | (empty for now) |

---

## 🧠 Which Claude model to use
Think of the models as brains of different sizes. A bigger brain is smarter, but uses up your limit faster.

| Size | Model right now | Use it for |
|---|---|---|
| Small | Haiku | Tiny chores: typos, renaming |
| Medium | Sonnet ⭐ | Most work: building features, writing lessons (the default) |
| Large | Opus | Big thinking: planning, hard bugs, checking work |
| Extra large | Fable | Only when Opus gets stuck |

New versions come out over time, but the sizes stay the same. Pick the newest model of the size you need.
