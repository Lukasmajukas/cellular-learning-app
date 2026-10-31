# 📖 Glossary: tricky words, explained simply

Claude adds new words here whenever they come up.

## Project and computer words
| Word | What it means |
|---|---|
| **Repository (repo)** | The project's binder on GitHub. Everything lives here. |
| **GitHub** | The website that keeps the binder safe online. |
| **Branch** | A photocopy of the binder where changes are made safely, without touching the real one. |
| **Commit** | A save point, like saving your game. |
| **Pull request (PR)** | Claude handing back the photocopy with a list of every change, asking "Can I add this to the real binder?" While a chat works, its pull request is also its "busy" sign. |
| **Merge** | Putting a pull request's changes into the real binder. Claude does this itself at the end of every chat. |
| **main** | The name of the real, official version of the binder. |
| **Draft** | A pull request still marked "not final". Claude un-drafts and merges its own, so you never need to click anything. |
| **Claim ("[in progress]" sign)** | The note a chat hangs on its task that says "I'm working on this right now", like writing "I'm getting the milk" on the fridge note. |
| **Traffic light (start-up check)** | What every chat checks before working: 🔴 another chat is busy, 🟡 a chat stopped halfway (pick it up), 🟢 go. |
| **Take over** | Telling a new chat to finish the work an old chat left half-done. |
| **Stale copy** | An old photocopy of the binder that's missing newer changes. Every chat grabs the newest copy first. |
| **Conflict** | When two chats changed the same lines, so someone has to decide what to keep. Claude sorts it out. |
| **Squash merge** | Merging all of a chat's save points as one single save point, so each task is one neat step in the history. |
| **Undo (revert)** | A new change that exactly reverses an old one. Nothing is erased; the history shows both. |
| **Archive (a chat)** | Putting an old chat away, like a finished worksheet in a drawer. It leaves your list but isn't deleted, and Claude can bring it back. |
| **Permission file** | A small file of rules (`.claude/settings.json`) that tells Claude's safety check which jobs are OK without stopping to ask. Only you add it. |
| **Chat / session** | One conversation with Claude. Best kept to one task. |
| **Context** | Claude's short-term memory for one chat. It's like a backpack: the more you stuff in, the harder it is to find things. That's why we start fresh chats. |
| **Handoff note** | A note one chat leaves for the next, like passing the baton in a relay race. |
| **Model** | Which Claude "brain" you use: Haiku (small), Sonnet (medium), Opus (large), Fable (extra large). |
| **Usage limit** | How much Claude you can use in a stretch of time. Bigger models and longer chats use it up faster. |
| **PRD** | The plan, or blueprint. It says what the app will do before anyone builds it. |
| **MVP** | The first playable version: small, but it works. |
| **Installer** | The file you double-click to put the app on your computer. |
| **App engine (Electron / Tauri)** | The base the app is built on, like the engine in a car. We pick one in the plan. |
| **Bug** | A mistake that makes something in the app not work right. |
| **Progress panel** | A small web page that shows where the project is, like the scoreboard at a game. |
| **claude.ai page (artifact)** | A web page Claude makes that lives on claude.ai. It starts private: only you can open it. |
| **Connector** | A link you set up once between claude.ai and another service, like GitHub. It lets claude.ai fetch things with your login, without anyone seeing your password. |
| **Scheduled task** | An alarm clock for Claude: at a set time, it starts a fresh chat with a set message. Each run uses your limit like a normal chat. |
| **Guard rails / checklist** | Rules the robot checks before starting. If any rule says "no", it stops. |
| **Practice run (dry run)** | The robot does everything except the real work, then tells you what it *would* have done. |
| **GitHub Action** | A little robot that lives on GitHub and does a job when something happens, like building the installer. |
| **GitHub Pages** | A free way to turn files on GitHub into a website. For a private repo it needs a paid plan, and the site is still public. |
| **Access key (token)** | A long secret code that works like a password for one job. Never put it inside a page someone else could see. |
| **Rate limit** | A cap on how often you can ask a website for something, like "5 cookies per hour". |

## Cell phone words
| Word | What it means |
|---|---|
| **Frequency** | How fast a radio wave wiggles. It's measured in MHz (millions of wiggles per second) or GHz (billions). |
| **Band** | A numbered "radio lane". LTE bands start with B (like B12); 5G bands start with n (like n71). |
| **Low / mid / high band** | Low bands travel far and go through walls, but are slower. High bands are super fast, but only reach a short distance. Mid bands are in between. |
| **mmWave** | The highest bands (n258, n260, n261). Very fast, very short range. |
| **LTE (4G)** | The older network type. |
| **5G NR** | The newer network type. "NR" means New Radio. |
| **Uplink / downlink** | Uplink is phone to tower; downlink is tower to phone. |
| **FDD / TDD** | Two ways to share a lane. FDD uses two separate lanes, one up and one down. TDD takes turns on one lane. |
| **Carrier** | The phone company: AT&T, Verizon, T-Mobile. |
| **Cell site** | A place with antennas: a tower, a rooftop, or a pole. |
| **Macro cell / small cell** | A macro cell is a big tower covering miles. A small cell is a little box on a pole covering a few blocks. |
| **Sector** | The slice of the circle one set of antennas covers. Most towers have 3. |
| **Radio (RRU)** | The box that makes the signal. The antenna sends it out. |
| **Massive MIMO** | A big box antenna with lots of tiny antennas inside, used for fast 5G. |
| **eNB / gNB** | A tower's ID "name tag": eNB for LTE, gNB for 5G. |
| **PCI** | A short number that helps phones tell nearby cells apart. It's not unique. |
| **EARFCN / NR-ARFCN** | A channel number that points to one exact frequency. |
| **MCC / MNC (carrier code)** | Two short numbers every cell broadcasts, like a license plate for the phone company. 310/260 means T-Mobile, 311/480 means Verizon. |
| **Stealth site** | Antennas hidden so you don't notice them: inside a church steeple, painted on a chimney, or behind a fake rooftop wall. |
| **FCC ASR** | The government's list of tall towers (mostly over 200 feet). Short and hidden sites aren't on it. |
| **FCC ULS** | The government's list of radio licences. It can show which company is licensed to transmit from a spot. |
| **Permit** | Permission from the town to build or change something, like adding antennas to a water tank. Permits are public records, so they're good evidence. |
| **Resource block** | LTE's small "chunk" of a lane. Phones sometimes report width in chunks: 50 chunks = 10 MHz. |
| **Path loss** | How much a signal fades as it travels. Higher frequencies fade faster, which is why low band reaches farther. |
| **3GPP** | The group that writes the official rules for bands. |
| **Spaced repetition (FSRS)** | The app quizzes you right before you'd forget something, so it sticks. |
| **Streak / XP** | A streak is how many days in a row you practiced. XP is the points you earn for practicing. |
