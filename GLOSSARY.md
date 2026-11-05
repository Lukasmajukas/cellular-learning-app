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
| **Permission file** | A small file of rules (`.claude/settings.json`) that tells Claude's safety check which jobs are OK without stopping to ask. Only you add it. In Auto mode, three robot jobs ignore it (opening a chat, starting the next run, putting chats away). |
| **Chat / session** | One conversation with Claude. Best kept to one task. |
| **Context** | Claude's short-term memory for one chat. It's like a backpack: the more you stuff in, the harder it is to find things. That's why we start fresh chats. |
| **/clear and /compact** | Two commands you type in a chat. `/clear` empties Claude's backpack (its memory of the chat) and starts fresh in the same chat. `/compact` squashes the backpack into a short summary. A smaller backpack costs less of your limit every time Claude answers. |
| **Handoff note** | A note one chat leaves for the next, like passing the baton in a relay race. |
| **Model** | Which Claude "brain" you use: Haiku (small), Sonnet (medium), Opus (large), Fable (extra large). |
| **Effort** | How hard Claude thinks before answering. Low is a quick answer; High is careful checking. More effort is slower and uses more of your limit. |
| **Robot run** | A chat that starts by itself on a schedule, like an alarm clock that opens a chat and says "Go". |
| **Heartbeat** | The robot's check every hour. If the robot stopped, for example at a usage limit, the heartbeat starts it again. |
| **Chain** | Each robot chat starts the next one when it finishes, like dominoes falling one after another. |
| **Robot launcher** | A small chat that never closes. Every hour the robot's alarm wakes it, and it starts a fresh robot chat with the project attached. Like a doorbell that calls the real worker. |
| **Paid extra usage (overage)** | Using Claude past your plan's limit for extra money. The robot never does this. |
| **Auto-continue** | When a chat hits your usage limit, it waits for the limit to reset and then carries on by itself. |
| **Auto mode** | A setting where Claude's safety check approves routine actions by itself, so a chat doesn't stop to ask you. It's the hands-free setting. |
| **Classifier** | The technical name for Claude's safety check in Auto mode. It looks at each action and decides yes or no by itself, like a guard at a door. It reads `CLAUDE.md`, so an approval you typed and Claude wrote down there helps it say yes. |
| **Bypass permissions** | A setting that turns the safety check off completely. Claude's cloud chats don't offer it, so Auto mode is the hands-free choice. |
| **Usage limit** | How much Claude you can use in a stretch of time. Bigger models, higher effort and longer chats use it up faster. |
| **Usage warning** | A "you're nearly out" sign on your usage limit, like a fuel light. It isn't a stop: the robot keeps working until the limit is really used up. |
| **PRD** | The plan, or blueprint. It says what the app will do before anyone builds it. |
| **MVP** | The first playable version: small, but it works. |
| **Installer** | The file you double-click to put the app on your computer. |
| **Sign-off** | Saying "yes, build it like this" about a plan. Like a parent signing a permission slip: until it's signed, nothing starts. You signed off the plan on Oct 31, 2026. |
| **App engine (Electron / Tauri)** | The base the app is built on, like the engine in a car. The plan recommends Electron. |
| **Browser engine (Chromium)** | The part of a web browser that draws pages. Chromium is the one inside Chrome and Edge. Electron carries its own copy, so the app looks the same everywhere. |
| **TypeScript / React** | TypeScript is the language Claude writes the app in. React is a toolkit for building screens out of small reusable pieces, like Lego bricks. |
| **Code signing** | A paid digital "ID card" that tells Windows who made an app. Without it, Windows shows a "Windows protected your PC" warning the first time; you click More info, then Run anyway. |
| **Save file (JSON)** | The one small file where the app keeps your progress, written in a simple text format called JSON. Copying it is a backup. |
| **Checker (schema)** | A small program that reads the fact and lesson files and refuses to build the app if something is missing, like a teacher checking every answer has a source. |
| **Automatic test** | A little program that clicks through the app by itself and checks it works, so Claude can test without seeing your screen. |
| **SVG** | A picture drawn with code (lines, circles, colours) instead of pixels. It stays sharp at any size, and Claude can draw and animate it. |
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
| **Frame rate (fps)** | How many pictures per second the screen draws, like the pages of a flip-book. Around 60 looks smooth; much lower looks choppy. |
| **Shuffle** | Mixing up the order of the answer buttons each time, like shuffling cards, so you have to read them instead of remembering "it's the top one". |
| **Graphics chip (GPU) / hardware acceleration** | The part of your computer that draws pictures and movement. Apps can ask it to do the drawing, which is usually faster. Now and then a graphics chip or its driver draws wrong things on the screen, and switching it off for one app is a quick test. |
| **Release (GitHub)** | A shelf on GitHub's Releases page where a finished download is kept, like a shop shelf. Files on it don't use the build-file storage. Ours has one slot, "Latest build", that each new build replaces. |
| **Build file (artifact)** | A file GitHub's build robot saves after a build, like an installer. Each project gets only so much space for them, and old ones stay for weeks. |
| **Storage quota** | How much space GitHub lets a project use for build files. When it is full, new files can't be saved until old ones expire or are deleted. |
| **Case-insensitive file names** | Windows treats `HeatMap` and `heatmap` as the same name (it ignores capital letters); Linux treats them as two different names. Two such files work in the cloud but break on Windows. |
| **Style guide** | The app's rulebook for looks: which colours, letters, icons and movements to use, so every screen feels like the same app. Ours is `docs/redesign/DESIGN.md`. |
| **Design tokens** | The named colours, sizes and speeds the style guide picks (like "signal = bright cyan"), kept in one file. Change a token once and every screen follows, like changing a team's kit colour. |
| **Mockup** | A drawing of a screen before it's built, like an architect's sketch. The three looks in T58 were mockups: pictures, not the working app. |
| **Font licence (OFL)** | The "SIL Open Font License": free letters you may put inside your app and share, as long as you keep the licence note with them. |
| **Spring (animation)** | A way of moving that overshoots a little and settles, like a ball on a spring, instead of stopping dead. It makes buttons feel bouncy. |
| **Contrast** | How much words stand out from what's behind them. Too little and they're hard to read; a test checks every colour pair. |
| **CSS variable** | A named slot for a colour, like `--signal`. The token file fills the slots; every screen reads them. Swap what's in the slots and the whole app changes look at once. |
| **WebP** | A picture file type that's much smaller than PNG but looks the same. The gallery uses it so the binder stays light. |
| **Gallery** | A folder of pictures of every screen, made by a tool after each redesign session, so you can see what changed without installing anything. |
| **Ideas board** | The robot's list of "could be better" ideas for the look (`docs/redesign/IDEAS.md`). Your wishes always go to the top. |
| **Emoji** | The little pictures you can type, like 🔥 or ⚙️. Each computer draws them its own way (Windows, Mac and iPhone emoji look different), so the app now uses its own drawn icons instead. |
| **Icon set** | A family of small pictures drawn the same way (same grid, same line thickness, same round ends), so they look like they belong together. Ours is `app/src/theme/icons.ts`. |
| **Design review** | A chat that only looks: it scores every screen against the style guide and decides what to fix next, like a teacher marking a project halfway through. |

## Cell phone words
| Word | What it means |
|---|---|
| **Frequency** | How fast a radio wave wiggles. It's measured in MHz (millions of wiggles per second) or GHz (billions). |
| **Band** | A numbered "radio lane". LTE bands start with B (like B12); 5G bands start with n (like n71). |
| **Low / mid / high band** | Low bands travel far and go through walls, but are slower. High bands are super fast, but only reach a short distance. Mid bands are in between. |
| **Capacity band** | A wide band (like n41 or n77) that carries lots of data over shorter distances, instead of reaching far. |
| **CBRS** | A shared band at 3550–3700 MHz (B48/n48). |
| **Fingerprint band** | A band that points to one carrier, like n71 for T-Mobile. Check the date: these change. |
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
| **ECI** | The big LTE cell number. It hides two smaller numbers: the tower (eNB) and the cell. ECI = eNB × 256 + cell. |
| **NCI** | The big 5G cell number. It hides the tower (gNB) and the cell, but the screen does not say where the split is. |
| **Sector** | One direction a site's antennas face, about a third of a circle. Each band on a sector is its own cell. |
| **PCI** | A short number that helps phones tell nearby cells apart. It's not unique. |
| **EARFCN / NR-ARFCN** | A channel number that points to one exact frequency. |
| **MCC / MNC (carrier code)** | Two short numbers every cell broadcasts, like a license plate for the phone company. 310/260 means T-Mobile, 311/480 means Verizon. |
| **HNI** | "Home network ID": the country number and carrier number stuck together, like 310-260. |
| **ATIS** | The US industry group that hands out the carrier numbers (HNI codes). Its list is the official US registry. |
| **Stealth site** | Antennas hidden so you don't notice them: inside a church steeple, painted on a chimney, or behind a fake rooftop wall. |
| **FCC ASR** | The government's list of tall towers (mostly over 200 feet). Short and hidden sites aren't on it. |
| **FCC ULS** | The government's list of radio licences. It can show which company is licensed to transmit from a spot. |
| **Permit** | Permission from the town to build or change something, like adding antennas to a water tank. Permits are public records, so they're good evidence. |
| **Resource block** | LTE's small "chunk" of a lane. Phones sometimes report width in chunks: 50 chunks = 10 MHz. |
| **Path loss** | How much a signal fades as it travels. Higher frequencies fade faster, which is why low band reaches farther. |
| **3GPP** | The group that writes the official rules for bands. |
| **Spaced repetition (FSRS)** | The app quizzes you right before you'd forget something, so it sticks. |
| **Streak / XP** | A streak is how many days in a row you practiced. XP is the points you earn for practicing. |

## Photo words
| Word | What it means |
|---|---|
| **Licence** | The sticker on a photo that says what you may do with it. |
| **Public domain / CC0** | Anyone may use it, no credit needed. |
| **OGG** | A kind of sound file, like MP3 but free of patents. The app's sounds are OGG files. |
| **Creative Commons (CC BY, CC BY-SA)** | You may use it if you credit the photographer. BY-SA also says a changed copy keeps the same sticker. |
| **NC / ND** | "Non-commercial" and "no changes". We don't use these, because we crop and add arrows. |
| **Wikimedia Commons** | The free photo library behind Wikipedia. |
| **Monopine** | A cell tower dressed up as a pine tree. |
| **MVNO** | A phone company with no towers of its own. It rents another company's towers (e.g. Mint rides on T-Mobile). Its phones usually show the host's carrier code. |
| **FirstNet** | AT&T's special network for police, fire and ambulance crews, with priority on the same towers. |
| **UNVERIFIED** | Our label for a fact nobody has checked yet. The app never asks a quiz question about one. |
| **Has carrier rows / active claim** | In the bands file: "has carrier rows" means some carrier row mentions the band. "Active claim" means that row says CURRENT or PLANNED. Neither means we trust it: only a cited status counts. (This replaced the old "core" column.) |
| **Spectrum change** | When the right to use a slice of radio frequencies is sold or moves to someone else, like one shop selling its parking spaces to another. Owning the spectrum doesn't mean the new owner's towers are using it yet. |
| **LRA (LTE in Rural America)** | A Verizon programme where small local carriers build towers that use Verizon's frequencies in their area. The research names Cellcom and Appalachian Wireless as partners, but that is not confirmed yet. |
| **not_applicable** | A flag in the bands file for a band that the standard lists but marks "not applicable" (B23). The app never teaches it as a live band. |
| **Fact checker** | A small program that reads our facts and lessons before every build and refuses anything that breaks the rules, like a teacher who checks homework for missing sources before it goes in the book. |
| **Locked question ID** | Every quiz question has a name tag (its ID). Once a tag is on the locked list, it can never change or vanish, because the app remembers how well you know each question by that tag. |
| **Path map** | The screen with a trail of lesson circles, like stepping stones. Finished ones turn green, the next one glows blue, and the rest stay locked until you get there. |
| **Lesson player** | The part of the app that asks one lesson's questions one by one and gives you stars at the end. |
| **Save file** | One small file on your computer that remembers your stars and settings, so they're still there when you reopen the app. Like a bookmark that never falls out. |
| **Backup** | A spare copy of the save file, made once a day. If the main file ever breaks, the app uses the newest backup. |
| **Atomic write** | Saving in a way that can't be half done: the app writes a new copy on the side, then swaps it in all at once. If the power dies mid-save, the old file is still fine. |
| **Preload** | A tiny helper that gives the app screen a few safe doors to the save file (load, save, back up, show), and nothing else. |
| **Frame rate (fps)** | How many pictures per second the screen draws. About 60 feels smooth; much lower feels choppy. The ⚙️ switch "Show frame rate" shows it in a corner. |
| **Pivot (rotation point)** | The spot something turns around, like the hinge of a door. The mascot's antenna should turn around the tower tip. |
| **Learn card** | A teaching screen before the questions, like a page in a picture book: it shows one idea with a little drawing. It isn't scored. |
| **Checkpoint** | The last lesson of a unit: a test of everything in it, with no learn cards and no hints. Like an end-of-chapter quiz. |
| **Wrong choices (distractors)** | The wrong answers in a multiple-choice question. Good ones are near-misses (B12 vs B17), not silly ones. |
| **Nesting bands (subset)** | A band that fits completely inside a bigger one, like a small box inside a big box. B17 fits inside B12, and B12 fits inside B85. |
| **Upside-down band** | A band whose uplink (phone → tower) sits above its downlink. In most bands it's the other way round. B13, B14 and B71 are the ones you'll meet. |
| **Downlink-only band (SDL)** | A band that only goes tower → phone, like a one-way street that adds extra lanes for downloads. B29 is one. |
| **Interleaving (mixing)** | Mixing different topics in one practice set instead of doing one topic at a time. It helps you tell look-alikes apart. |
| **Tier** | Which part of the ruler a band is in: low, mid or high. In this app: low is below 1 GHz, high is mmWave, mid is everything in between. |
| **FSRS** | A memory schedule: the app guesses how long until you'd forget each question and asks it again just before that. Right answers push the next time further away; wrong ones pull it closer. |
| **Stability** | In FSRS, the number of days until you'd forget a question about 1 time in 10. |
| **XP** | Points you earn for right answers. They only count how much you practised. |
| **Signal bars** | 1 to 5 bars at the end of a lesson, like phone signal: more bars means more answers right the first time. |
| **Heatmap** | A picture where colour shows how much of something there is. Ours colours each band by how well you remember it: green strong, gold okay, red fading, a dim dashed outline for new. Since R14 a tile also glows brighter the better you know the band, and shows signal bars and a %. |
| **Scenario puzzle** | A question with a little story and several clues. For each clue you say what it tells you. You only get the question right if every clue is right. |
| **ASR** | Antenna Structure Registration. A tall tower (over 200 ft) must be listed with the FCC, like a car with a licence plate. The number is posted near its base. |
| **Monopole** | A cell tower that is one single pole, like a giant flagpole with antennas on top. |
| **Lattice tower** | A cell tower built like an open steel frame, wide at the bottom, like the Eiffel Tower's cousin. |
| **Guyed mast** | A thin tower held up by long cables to the ground, like a tent pole with ropes. |
| **DAS** | Distributed Antenna System. Lots of small antennas inside a stadium or big building, often shared by several carriers. |
| **COW** | Cell On Wheels: a cell tower on a trailer that can be towed to an event or a disaster. |
| **NOC** | Network Operations Center: the phone line where a tower's owner takes problem reports. |
| **Alt text** | A few plain words describing a picture, for when the picture can't load (or for screen readers). Every picture question has one. |
| **Tap the clue** | A question where you tap the right spot on a picture instead of picking from a list. |
| **COW / COLT** | Cell on Wheels (on a trailer) and Cell on Light Truck (built onto a vehicle): temporary cell sites. |
| **Small cell** | A small radio on a street pole or building, with a canister up high and a box below. |
| **Daily review (drive test)** | The purple button on the path map, or the Review tab at the bottom. It replays the questions the memory schedule says are due today, so you see them just before you'd forget. |
| **Streak freeze (🧊)** | A spare day off. You earn one every 7 days in a row. If you miss one day, it is used up and your streak keeps going. |
| **"This changed" card** | A blue card that appears once when a carrier fact changes (for example, a sale closes). Pressing "Got it" makes the related questions come back for review as if new. |
| **Building blocks (components)** | The app's ready-made parts, like LEGO bricks: a button, a card, a switch, an answer tile. Every screen is put together from the same bricks, so it all looks and moves alike. They live in `app/src/ui/`. |
| **Slider** | A bar with a knob you slide left or right to pick an amount, like the volume knob on a radio but straight. The app's volume is one. |
| **Switch (toggle)** | An on/off slider, like a light switch. On = it glows blue and the knob slides right. |
| **Spring (animation)** | A way of moving that feels like a real spring: it speeds up, slows down and settles, maybe with a tiny bounce. Used when buttons squish under your click. |
| **Bottom sheet** | A panel that slides up from the bottom of the window, like the "Right!" / "Not quite" panel after an answer. |
| **Tab bar** | The row of four buttons at the bottom of the app (Path, Review, Heatmap, Settings), like on a phone. The one you're on glows blue. |
| **Speed file** | The one file that holds every speed in the app (how fast things slide, bounce and fade): `app/src/theme/motion.tsx`. Change it there, and the whole app moves differently. |
| **Keyboard shortcut** | A key that does what a click would: in a lesson, 1 to 4 pick an answer, Enter goes on, Esc leaves. |
| **Flip book** | A few pictures taken one right after another while something moves, to check that it really moves smoothly. |
| **Unit banner** | The heading above each unit on the path map: a small "UNIT 3", the unit's name, and how many of its lessons you've done ("2 / 5"). Its glowing bar is blue for the unit you're in and green when it's all done. |
| **Coming on air** | The little show on the path map when you finish a lesson for the first time: its circle turns from blue to green with rings spreading out, the dotted line to the next lesson draws itself, and the next lesson's lock flies off. Like a radio tower being switched on. |
| **Breathing (animation)** | A slow, soft loop that makes something grow a tiny bit and fade a little, then come back, over and over, like breathing. The current lesson's rings do it. |
| **Count-up** | A number that rolls up quickly from the old value to the new one, like a car's meter, so you see how much was added. Your XP does it after a lesson. |
| **Next frame** | The screen redraws about 60 times a second; each redraw is a frame. "On the next frame" means a tiny wait (about 1/60 of a second), so something quick, like Beacon's face, gets drawn first. |
| **Portal** | A way to draw one part of a screen somewhere else in the page, outside the screen's own box. The "Right!" / "Not quite" panel uses it, so it stays stuck to the bottom of the window even while the lesson slides. |
| **Chip** | A small rounded button as wide as its words, like "Low band". Several fit in a row, so the app uses them for short answers (the scenario clues) and for the items you put in order. |
| **Keyframes** | A list of the steps a movement goes through, like a flip book: "6 px left, 6 px right, 4 px left ... back to the middle" is a gentle shake. The app plays them smoothly one after another. |
| **Comeback question** | A question you missed that comes back once, a few questions later, for another try. Since R11 it has a small "Comeback" label, and it doesn't make the "3 / 12" counter grow. |
| **Radar scope (Review tab)** | The round "drive test" picture on the Review tab (since R13): rings like a radar screen, one purple dot ("blip") for each question waiting for you, farther out the longer it has waited, and a soft beam that sweeps round while questions wait. |
| **Layout move** | When something on a page goes away, the things under it move up to fill the gap. A layout move makes them glide up smoothly instead of jumping (since R13, when you close a notice). |
| **Signal burst** | The app's own celebration when you finish a lesson (since R12): rings spread out from Beacon's head and little bits of radio wave fly outward, then everything fades. It replaced confetti, which never showed on your Windows PC. |
| **Scrollbar gutter** | The strip at the side of the window where the scrollbar sits. Keeping it there even when a page is too short to scroll stops everything jumping sideways when you switch screens. |
| **Zig-zag path** | The path map's layout: lesson circles go left, right, left down the screen, with each name beside its circle, joined by a dotted line. |
| **Scrim** | A see-through dark layer laid over a screen behind a panel, so the panel stands out and the screen behind is clearly "paused". Clicking it closes the panel (since R14, behind the heatmap's lessons sheet). |
| **Glow layer** | A soft halo drawn as its own layer behind a tile or circle. To make something glow more or less, only that layer's see-through-ness changes; the blur itself never moves, because a moving blur is slow on some computers (DESIGN.md section 7). |
| **WCAG** | The web's rulebook for making screens easy to read and use for everyone. Its contrast rule says words need to stand out from their background at least 4.5 to 1 (big words 3 to 1). The app's contrast tests use it. |
| **First paint** | The very first picture a window shows when it opens, before anything has loaded. If it's the wrong colour, you see a flash. |
| **Main process** | The part of the app that runs behind the window: it opens the window and reads and writes your save file. The window itself only draws the screens. |
| **Start screen (splash screen)** | The picture an app shows for a moment while it gets ready, like a TV channel's logo before the show. Ours is Beacon, the app's name and "TUNING IN". |
| **Error boundary** | A safety net around the app's screens: if something inside trips over, it catches the problem and shows a friendly "Something went wrong" screen instead of an empty window. |
| **Empty screen (empty state)** | What a screen shows before there's anything to show yet, like the Heatmap before your first lesson. A good one says what will appear and how to get there. |
| **Focus ring** | The glowing outline that shows which button the keyboard is on, like a cursor for buttons. Press Tab to move it, Enter to press. Ours is a thin blue ring. |
| **Keyboard shortcut** | A key that does something straight away, like 1 to pick answer 1 or A to pick partner A in a match. The whole list is in Settings, Keys. |
| **Minimum window size** | The smallest you can drag the window to. Ours is 360 × 560, about a phone screen; every screen is checked at that size. |
| **Colour alone** | Showing something only with a colour (like green for right). Some people can't tell colours apart, so the app always adds a shape too: a tick, a cross, a filled box. |
| **Main thread** | The one worker inside the app that runs its code, works out the styles and lays out the page. If it's busy, everything waits, like a single cashier with a long queue. Smooth apps keep it free. |
| **Graphics chip (GPU)** | The part of the computer that draws pictures on the screen. It can slide, grow and fade a layer all by itself, without the main thread, which is why the app only animates those. |
| **Layer** | A piece of the screen drawn once, like a sticker on a clear sheet, that the graphics chip can then move, grow or fade without drawing it again. |
| **Style pass (style recalculation)** | The main thread working out again how every part of the page should look. Once in a while is fine; 60 times a second while nothing happens is waste. |
| **CPU brake (CPU throttling)** | A test trick: Chromium slows the computer down on purpose (we use a quarter of its speed) to see how the app would feel on an old, slow PC. |
| **Speed check** | The click test that measures how much work the app does: sitting still, scrolling the path, every animation (with the CPU brake on) and start-up. `app/tests/speed.spec.ts`. |
| **Chevron** | A small arrow shaped like a ">" that we turn to point down or up. After the words of a fold-out it means "there's more here: tap to open (or close) it". |
| **Fold-out** | Words you tap to show more underneath them, and tap again to hide it, like "Clue by clue" or "What happened". (On web pages it's called a disclosure, or `<details>`.) |
| **Yardstick** | In a test: a small fixed job timed on the same computer at the same moment, so a result can be judged against how fast that computer is right then, like timing a runner against a friend running beside them. |
| **Hover** | When the mouse pointer rests on something without clicking. Our buttons grow a tiny bit while you hover, to show you can press them. |
