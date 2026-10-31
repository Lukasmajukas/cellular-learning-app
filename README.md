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

1. **Start a new chat** with this repository selected. Leave the branch on **main**. (Picked another one by mistake? No harm. Claude switches to the newest copy by itself.)
2. **Pick the model** that [TASKS.md](TASKS.md) says. Most of the time that's Sonnet.
3. **Type:** `Do the next task in TASKS.md` (or just `Go`)
4. **Read Claude's last message.** It says what changed, anything it needs from you, and when to start a fresh chat.
5. **Close the chat.** Next task, new chat.

**You don't need to open GitHub or merge anything.** Claude saves its own work into the binder at the end of every chat.
- **One chat at a time.** If you open a second chat while the first is working, it tells you to wait.
- **Not happy?** Tell Claude what to change, or type `Undo the last change`.
- **Want to peek?** Open the GitHub app or github.com. Looking never breaks anything.

How this works, and what to do if something odd happens: [docs/WORKFLOW.md](docs/WORKFLOW.md). More messages to copy and paste: [CHEATSHEET.md](CHEATSHEET.md).

---

## 📁 What's in here (the map)
| Where | What it is | Who it's for |
|---|---|---|
| `README.md` | This page. Start here. | You |
| `ROADMAP.md` | The levels, and where we are | You |
| `TASKS.md` | The to-do list, with which model to use | You and Claude |
| `CHEATSHEET.md` | Messages you can copy and paste to Claude | You |
| `docs/WORKFLOW.md` | How chats share the work without tripping over each other | You and Claude |
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
