# Tech Stack and Animation Tooling for a Cross-Platform Desktop, Duolingo-Style Learning App (solo hobbyist, as of 2026-10-31)

Research method note: WebSearch worked normally. WebFetch was blocked for `rive.app` and `blog.duolingo.com` (the session's network allowlist does not include them), so I stopped using WebFetch and relied on search-result content for every source. Claims from those two domains (Rive pricing, Duolingo's blog) come from search snippets and summaries, not full-page reads. Claude API prices come from Anthropic's Claude API reference (pricing table cached 2026-10-06), cited to the official pricing page.

---

## 1. How do Tauri 2.x, Electron, Flutter desktop, Godot 4.x, Avalonia/.NET MAUI, Wails, and Compose Multiplatform compare for this app as of 2026?

### Takeaway
Tauri 2.x fits a solo hobbyist best overall: installers of about 3–10 MB, roughly 40–50 MB of RAM at idle, and the whole web animation ecosystem. It has two real cross-platform risks, though. On Linux, WebKitGTK has rendering and compositing bugs. On macOS, WKWebView limits requestAnimationFrame to about 60 fps by default. Electron removes both risks but its installers are roughly 10–30 times larger and it uses 2–4 times the RAM. Flutter 3.47, where Impeller is now the default desktop renderer, draws everything itself, so it looks the most consistent across platforms. Godot is excellent for game-like "juice" but awkward for app-style UI. Avalonia 12 is viable for C# developers. .NET MAUI has no official Linux support. Wails v3 is still in beta. Compose Desktop ships bundles of about 40–100+ MB because it includes a JRE.

### Cited Findings

#### Versions and release status (late 2026)
- **Tauri:** core v2.9.0 shipped 2025-10-20 and v2.10.0 shipped 2026-02-02, with 2.11.x releases continuing through July 2026. — [Tauri release list](https://v2.tauri.app/release/tauri/)
- **Tauri CEF runtime:** a `tauri-runtime-cef` crate (3.0.0-alpha.0), "a Tauri runtime interface for Chromium Embedded Framework", exists. It includes sandboxing and devtools modules. None of the 2.x release notes I found show it as shipped, so treat a Chromium-backed Tauri as alpha. — [docs.rs tauri-runtime-cef](https://docs.rs/crate/tauri-runtime-cef/latest/source/src/lib.rs)
- **Electron 43:** Chromium 150.0.7871.46, V8 15.0, Node 24.17.0. Supported until 2027-01-05. — [Electron blog: Electron 43.0](https://electronjs.org/blog/electron-43-0)
- **Electron 44.0.0:** Chromium 152. Release date is 2026-08-24 in one source and 2026-08-25 in another (conflict). Support ends 2027-03-02. The 44.7.x patch line carries Chromium 152.0.7977.130 and Node 24.21.0. — [GitClear v44.0.0](https://www.gitclear.com/open_repos/electron/electron/release/v44.0.0); [endoflife.ai Electron 44](https://endoflife.ai/electron/44); [tech-insider Electron 44.7.0](https://tech-insider.org/electron-44-7-0-chromium-152-node-24-2026/)
- **Electron 45:** secondary sources report beta.1 on 2026-10-08 (Chromium 156.0.8078.12) and stable on 2026-10-20, at which point 42 dropped out of support. This comes from a single secondary source and was not checked against Electron's official release page. — [tech-insider](https://tech-insider.org/?p=33483); [endoflife.ai](https://endoflife.ai/article-electron-42-eol)
- **Electron cadence:** a new major every 8 weeks, tracking even-numbered Chromium releases. The Chromium version is usually bumped within 1–2 weeks of a new stable Chromium. — [Electron Releases doc](https://electronjs.org/de/docs/latest/tutorial/electron-timelines); [endoflife.date](https://endoflife.date/electron)
- **Flutter 3.47.0:** reached stable on 2026-08-12 with Dart 3.13.0. Impeller is now the default renderer on Windows, Linux and macOS. The `--no-enable-impeller` opt-out is slated for removal. Signed-distance-field text and vector rendering is enabled on desktop. This is from a secondary blog; I did not check the official release notes. — [startdebugging.net](https://startdebugging.net/2026/08/flutter-3-47-impeller-default-renderer-on-desktop/)
- **Flutter renderer conflict:** one migration guide says the Windows embedder still draws through OpenGL ES over ANGLE, while other posts describe Vulkan on Windows. — [startdebugging.net RU migration guide](https://startdebugging.net/ru/2026/10/migrate-a-flutter-windows-or-linux-desktop-app-to-impeller/)
- **Godot:** 4.6.0 is dated 2026-01-26, 4.6.2 is 2026-04-01 and 4.6.3 is 2026-05-20. These dates come from an unofficial APK mirror plus a GameDev.net item. — [APKMirror (unofficial)](https://www.apkmirror.com/?p=12268842); [GameDev.net 4.6.3 RC](https://gamedev.net/news/3212-release-candidate-godot-463-rc-1/)
- **Godot 4.7:** reported released around 2026-06-19 with an AreaLight3D node and a **new offset-transform system for Control nodes**. That system is relevant to UI micro-animations because it moves a node's visual transform without disturbing layout. — [WN Hub news](https://wnhub.io/zh/news/engines/item-51174)
- **Avalonia 12:** released 2026-04-07 according to a Korean blog. The latest stable is 12.1.4 (2026-10-09), and Linux is supported. The Avalonia WebView went open-source in v12. The "Accelerate" brand was dropped and licensing was restructured. — [wikidocs blog (licensing overhaul)](https://wikidocs.net/blog/@lukewire/11052/); [wikidocs blog (Avalonia 2026)](https://wikidocs.net/blog/@lukewire/9758/); [Wikipedia](https://en.wikipedia.org/wiki/Avalonia_(software_framework))
- **.NET MAUI:** officially supports Android, iOS, macOS, Windows and Tizen, with **no Linux desktop**. Microsoft reportedly called Linux "not planned" (secondhand). — [byteiota](https://byteiota.com/net-maui-linux-support-two-paths-forward-in-2026/); [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/1637588/will-net-maui-include-official-support-for-linux)
- **Avalonia backend for MAUI:** reported in Nov 2025 and previewed on .NET 11 by March 2026. It targets Linux and WebAssembly and stays in development until .NET 11 GA in November 2026, so API changes are expected. A community "open-maui" Linux backend (MIT, SkiaSharp, X11/Wayland) is in preview. — [The Register](https://www.theregister.com/2025/11/13/dotnet_maui_linux_avalonia/); [mewayz news](https://news.mewayz.com/news/101675/Technology/March-23-2026/Avalonia-bolts-Linux-and-WebAssembly-onto-NET-MAUI); [NuGet OpenMaui.Controls.Linux](https://packages.nuget.org/packages/OpenMaui.Controls.Linux/1.0.0-preview.2)
- **Wails v3:** still pre-release. The highest tag I found is v3.0.0-beta.26, whose notes say the "API is stable" but issues are possible before the final 3.0. — [GitHub release v3.0.0-beta.26](https://github.com/wailsapp/wails/releases/tag/v3.0.0-beta.26)
- **Compose Multiplatform 1.12.0:** released 2026-08-26 with AI-assistant tooling, web resource improvements and finer control over desktop window states. Releases follow Jetpack Compose with a 1–3 month lag. — [JetBrains Kotlin blog](https://blog.jetbrains.com/kotlin/2026/08/compose-multiplatform-1-12-0/); [daily.dev summary](https://daily.dev/posts/compose-multiplatform-1-12-0-released-73hsdandx.md); [Kotlin docs: compatibility & versioning](https://kotlinlang.org/docs/multiplatform/compose-compatibility-and-versioning.html)

#### Installer size and RAM (mostly blog benchmarks; methodologies vary)
- **Tauri vs Electron (tech-insider, Sept 2026):** hello world about 3.2 MB for Tauri 2.x vs about 85 MB for Electron 43. Idle RAM about 42 MB vs about 168 MB. With six windows, 172 MB vs 409 MB. — [tech-insider](https://tech-insider.org/tauri-vs-electron-2026/)
- **Tauri vs Electron (Hopp, macOS):** bundle 8.6 MiB vs 244 MiB. After opening 6 windows, about 172 MB vs about 409 MB. Hopp attributes the gap to Electron bundling Chromium and Node.js. The identical 172/409 MB figures in tech-insider suggest it reused Hopp's data. — [Hopp blog](https://www.gethopp.app/blog/tauri-vs-electron)
- **Typical ranges:** 2–10 MB (Tauri) vs 80–200 MB (Electron), with idle RAM around 50 MB vs 120+ MB. — [buildmvpfast](https://www.buildmvpfast.com/blog/tauri-v2-vs-electron-desktop-apps-2026)
- **Outlier:** BetterStack's test app measured 57 MB (Tauri) vs 323 MB (Electron). — [BetterStack](https://betterstack.com/community/guides/scaling-nodejs/tauri-vs-electron-vs-deno-vs-electrobun.md)
- **Flutter desktop:** about 25 MB installer, about 90 MB idle RAM and about 1.8 s cold start. The same post gives Tauri about 8 MB / 45 MB / 1.4 s and Electron about 165 MB / 180 MB / 3.2 s. It describes no methodology. — [Fyrosoft](https://fyrosofttech.com/blog/cross-platform-desktop-apps-2026/)
- **Godot:** the default Windows export on 4.4 is about 92.8 MB uncompressed (about 30.6 MB zipped). A custom-compiled template on 4.5 (optimize=size, lto=full, disable_3d, disable_advanced_gui) came to about 5.37 MB, but you have to compile the templates yourself. — [popcar blog](https://popcar.bearblog.dev/how-to-minify-godots-build-size/)
- **Compose Desktop:** packages are about 100 MB+ for simple apps, and the bundled JRE alone is about 68 MB. jlink trimming cut Widgets Gallery from 129.7 to 96 MB uncompressed and its macOS DMG from 76 to 40 MB. — [Kotlin Slack thread](https://slack-chats.kotlinlang.org/t/10320208/i-d-like-to-share-a-lesson-learned-with-you-which-you-may-fi); [Kotlin Slack thread](https://slack-chats.kotlinlang.org/t/520682/i-m-surprised-whole-jre-is-packed-with-the-compose-in-just-4); [JetBrains native-distribution README](https://github.com/JetBrains/compose-jb/blob/master/tutorials/Native_distributions_and_local_execution/README.md)
- **Wails:** binaries under 10 MB at hello-world scale. One real-app comparison measured 52 MB vs 324 MB for Electron. — [dev.to](https://dev.to/0012303/wails-has-a-free-api-build-desktop-apps-with-go-and-web-technologies-1bf5); [stork.ai](https://www.stork.ai/blog/gos-secret-weapon-for-desktop-apps)
- **Caveat:** sources disagree widely on Electron's size (80 to 350 MB depending on the app). PkgPulse advises benchmarking your own workload. — [PkgPulse](https://www.pkgpulse.com/guides/electron-vs-tauri-2026)

#### Animation smoothness, GPU path, 60/120 fps, cross-platform consistency
- **Tauri on Linux:** renders through WebKitGTK. Documented symptoms are blank windows, flicker during resize and crashes, mostly caused by WebKitGTK's DMABUF renderer requesting buffer formats NVIDIA drivers don't provide. The workaround `WEBKIT_DISABLE_DMABUF_RENDERER=1` gives up the faster rendering path. — [Tauri docs: Linux graphics issues](https://v2.tauri.app/develop/debug/linux-graphics/)
- **WebKit bug 255328:** CSS 3D transforms and animations glitch in the GTK and WPE ports, with parts of elements missing compared with Chromium. — [WebKit Bugzilla 255328](https://bugs.webkit.org/show_bug.cgi?id=255328)
- **WebKit bug 265048:** a gradient-mask wipe animation is "pretty laggy in webkitgtk". The reporter suspects images are software-scaled every frame. — [WebKit Bugzilla 265048](https://bugs.webkit.org/show_bug.cgi?id=265048)
- **Old Linux thread:** an unverified, old thread reports animations "vastly slower" in WebKit apps than in Chromium on Linux. This is weak evidence. — [Linode community](https://www.linode.com/community/questions/1/how-can-i-optimize-animation-performance-in-webkit-on-linux)
- **macOS 60 fps clamp:** WKWebView limits `requestAnimationFrame` to about 60 fps by default through WebKit's `PreferPageRenderingUpdatesNear60FPSEnabled` flag, which is on in WKWebView and off in Safari.
  - `tauri-plugin-macos-fps` turns the flag off through the private `_features` API. That is not App Store safe.
  - The plugin claims macOS 26 removed the cap, but commenters on WebKit bug 294338 contradict this.
  - An April 2026 comment says developers still rely on private-API workarounds.
  - Sources: [docs.rs tauri-plugin-macos-fps](https://docs.rs/crate/tauri-plugin-macos-fps/0.1.0); [WebKit Bugzilla 294338](https://bugs.webkit.org/show_bug.cgi?id=294338); [Apple Developer Forums: WKWebView 120hz](https://developer.apple.com/forums/thread/773222)
- **Wails engines:** Wails uses the same OS engines as Tauri (WebKit on macOS, WebView2 on Windows, WebKitGTK on Linux). v3 moved Linux to GTK4 and WebKitGTK 6.0. WebView2 offers Evergreen mode or a Fixed Version mode, which ships a pinned engine build for consistent rendering at the cost of app size. — [Wails v3 architecture](https://v3.wails.io/de/concepts/architecture); [braindetox Wails v3 guide](https://braindetox.kr/en/posts/wails_v3_go_desktop.html)
- **Avalonia animation controls:** a community Lottie control renders Lottie JSON through SkiaSharp Skottie inside the normal control tree. `CompositionAnimatedControl` provides per-frame updates driven by Avalonia's composition scheduler. Both packages are at 12.0.0. No source states a 60 fps target. — [Lottie for Avalonia](https://wieslawsoltes.github.io/Home/projects/lottie/); [NuGet CompositionAnimatedControl](https://www.nuget.org/packages/CompositionAnimatedControl)
- **Godot tweens:** Godot 4 animates in code with `create_tween()` and easing, for example UI slide-ins. Tweens are single-use: recreate them to replay, and kill active tweens before retriggering. — [uhiyama-lab Godot Tween guide](https://uhiyama-lab.com/en/notes/godot/tween-smooth-animation/); [godot-tweening skill doc](https://claudeskills.info/skills/thedivergentai/gd-agentic-skills/godot-tweening/)

#### Packaging, code signing, auto-update, offline
- **macOS signing:** the Apple Developer Program costs $99/year and is needed for macOS signing and notarization. — [dev.to: Tauri v2 code signing](https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-code-signing-for-macos-and-windows-part-12-3o9n)
- **Windows certificates:** community estimates put traditional certificates at about $200–700/year depending on validation level, and cloud-HSM certificates from DigiCert or Sectigo at about $300–600/year. — [GitHub issue aikami #104](https://github.com/BearlySleeping/aikami/issues/104); [GitHub issue NekoAI #132](https://github.com/nucket/NekoAI/issues/132)
- **Azure Trusted Signing:** Electron's docs call it the cheapest Windows code-signing option and say it removes SmartScreen warnings, but it is limited to developers in certain countries. An older cached version narrowed eligibility to US/Canada organizations and individuals. A community estimate puts it at about $10/month; I found no official price. — [Electron code signing docs](https://electronjs.org/docs/tutorial/code-signing); [GitHub issue TrueMain #1679](https://github.com/ilyanfraimbault/TrueMain/issues/1679)
- **Tauri signing and updates:**
  - macOS notarization runs automatically at build time from Apple environment variables.
  - Windows signing uses `bundle.windows.signCommand`, for example with `trusted-signing-cli` against Azure.
  - The built-in updater needs its own signing keypair, separate from the OS certificates.
  - Sources: [dev.to: Tauri v2 code signing](https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-code-signing-for-macos-and-windows-part-12-3o9n); [GitHub issue aikami #104](https://github.com/BearlySleeping/aikami/issues/104)
- **Electron updates:** Squirrel.Mac needs a signed app before automatic updates work at all. The third-party electron-updater checks signatures on macOS and Windows before applying updates. — [Electron code signing docs](https://electronjs.org/docs/tutorial/code-signing)

### Inferences
- **Comparison matrix (my synthesis of the findings above; † = prior knowledge, not re-verified this session):**

| Framework (late-2026) | Installer (reported) | Idle RAM (reported) | Rendering path | "Duolingo-feel" animation tooling | Hobbyist learning curve | Main risk for this app |
|---|---|---|---|---|---|---|
| Tauri 2.11.x | ~3–10 MB | ~42–50 MB | OS webview: WebView2 (Chromium) / WKWebView / WebKitGTK | Entire web stack (Motion, GSAP, Rive web, Lottie, CSS) | Low–medium: TS front end plus light Rust/config | WebKitGTK glitches on Linux; ~60 fps clamp in WKWebView |
| Electron 44/45 | ~85–250 MB | ~120–180 MB | Bundled Chromium on every OS | Same web stack, identical rendering everywhere | Lowest for web devs | Size/RAM; 8-week major cadence (only 3 lines supported); native-module rebuilds |
| Flutter 3.47 | ~25 MB (one blog) | ~90 MB (one blog) | Own engine; Impeller default on desktop | Built-in implicit/explicit/physics animation† + first-class Rive (Rive Renderer not on Linux) | Medium: Dart + widget model | Smaller desktop plugin ecosystem; Dart learning |
| Godot 4.6/4.7 | ~93 MB raw / ~31 MB zipped default; ~5 MB custom build | not found | Own engine (Vulkan/OpenGL†) | Tweens, AnimationPlayer†, particles†, shaders†; 4.7 Control offset transforms | Medium: GDScript easy, app UI harder | App-style UI (text-heavy lessons, lists, accessibility) is clunky |
| Avalonia 12.1 | not found | not found | Skia with own compositor† | XAML transitions†; Lottie via Skottie control; per-frame composition control | Medium–high unless you know C#/XAML | Few motion-design tools/assets; no official Rive runtime found |
| .NET MAUI | — | — | Native controls | — | — | **No official Linux** (excluded) |
| Wails v2 / v3-beta | <10 MB (hello world), 52 MB (real app) | not found | OS webview (same caveats as Tauri) | Web stack | Low–medium for Go devs | v3 still beta; same Linux/macOS webview issues as Tauri; smaller community |
| Compose MP 1.12 | ~40–100+ MB (JRE) | not found | Skia/Skiko on JVM† | Compose animation/spring APIs† | Medium–high: Kotlin + Gradle | Bundle size; desktop is a niche target; no Rive desktop runtime found |

- **Webview stacks (Tauri, Wails):**
  - The Duolingo feel comes mostly from easing, timing and character animation, not raw frame rate, so a 60 fps cap on macOS is acceptable for a learning app. Treat 120 Hz as a nice-to-have.
  - The real risk is Linux. Test on a WebKitGTK machine (ideally one with an NVIDIA GPU) in week 1.
  - Stick to compositor-friendly properties: `transform` and `opacity`. Avoid CSS 3D transforms, mask or gradient wipes, and heavy filters, because the WebKitGTK bugs above involve exactly these.
- **Electron's appeal:** for this app, Electron's strongest argument is identical Chromium rendering on all three OSes. Because the front-end code is the same web code, Electron works as a zero-rewrite fallback if Tauri's Linux behavior proves unacceptable. Keep platform calls (storage, file system, updater) behind a small adapter interface so the switch stays cheap.
- **Flutter and Godot:** both render themselves, so animations look and time the same everywhere. That removes the webview-variance problem at the cost of a non-web language. Godot only makes sense if the hobbyist already knows it or wants a game-first presentation.
- **Measuring RAM:** RAM figures for webview apps depend heavily on whether the separate browser-engine helper processes are counted. Treat all RAM numbers as order-of-magnitude.
- **Offline use:** all the candidates run fully offline once installed, as long as content ships inside the app bundle. Auto-update is the only feature that needs the network, and it can fail silently.
- **Signing costs:** for a hobby release, budget $99/year for Apple, plus Windows signing (about $10/month via Azure Trusted Signing if eligible, otherwise about $200–700/year), or ship unsigned Windows builds and accept SmartScreen warnings. Linux builds need no paid signing.

### Gaps
- **Benchmarks:**
  - No independent, controlled 2026 benchmark covers all seven frameworks.
  - The Flutter numbers come from one blog with no methodology.
  - I found no RAM figures for Godot, Avalonia, Wails or Compose Desktop.
- **Versions not confirmed at the source:**
  - The official Flutter 3.47 release notes were not checked; the claim rests on a secondary blog.
  - Godot 4.7/4.8 status was not confirmed on godotengine.org.
  - The Electron 45 stable date comes from one secondary source.
- **Frame rates:** I could not verify 120 Hz behavior for Electron/Chromium on macOS or for WebView2 on Windows. Whether macOS 26 still has the WKWebView 60 fps cap is unresolved because the sources conflict.
- **Surveys and ecosystem size:** I did not retrieve developer-survey data (Stack Overflow 2025, State of JS 2025) or GitHub-star or ecosystem-size metrics.
- **Distribution formats:** I did not re-verify the exact bundle formats per OS (MSI/NSIS, DMG, deb/rpm/AppImage) or Linux distribution channels (Flatpak/Snap).

---

## 2. Which animation tools produce the polished, bouncy "Duolingo feel," and what are their runtimes and licenses?

### Takeaway
**Yes, Duolingo uses Rive for its characters.** Its own blog describes Rive state machines for lip-sync visemes, poses and idle behaviors. Rive's runtimes are MIT-licensed, including web and Flutter, but the editor is proprietary. The free plan is limited, and sources conflict on whether free exports are allowed with a splash screen or need a paid plan. Paid tiers start around $9 per seat per month. The best combination for a hobbyist:
- **Rive** for the mascot and celebration moments.
- **A spring-based code library** for UI micro-interactions: Motion (MIT) in React, Flutter's built-in physics, or Godot tweens.
- **GSAP** is optional. It is now free (custom, revocable license).
- **dotLottie/Lottie** for non-interactive one-shot effects, since dotLottie's interactivity is still early.

### Cited Findings

#### Duolingo and Rive
- Duolingo's engineering blog post "world character visemes" describes using Rive, a real-time interactive design and animation tool, for character lip-sync. The team built separate mouth-shape (viseme) states alongside each character's general poses and covered idle behaviors such as head nods, blinking and eyebrow movement. Seen via search summary only; the page fetch was blocked. — [Duolingo Blog: world character visemes](https://blog.duolingo.com/world-character-visemes)
- Rive's case study on Duolingo's AI Video Call (character "Lily") says a **state machine blends animations at runtime** instead of using pre-baked clips. Eight head and eight body animations combine into **more than 64 idle variations**. — [Rive blog: Duolingo's AI-powered video call](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)
- Third-party Rive-agency posts argue that Rive beats Lottie for Duolingo-style interactive mascots. This is marketing content and low authority. — [dev.to (UI Animation agency)](https://dev.to/uianimation/want-duolingo-style-interactive-animation-in-your-app-stop-using-lottie-heres-how-with-rive-5247)

#### Rive: runtimes, licensing, pricing
- Rive's pages say its runtimes (e.g., Unity, Unreal, C++) are **MIT-licensed with no royalties or runtime fees**, and that the Rive Renderer is MIT too. — [Rive game UI](https://rive.app/game-ui); [Rive Renderer](https://rive.app/renderer); [Rive runtimes](https://rive.app/runtimes); [Rive runtimes getting started](https://rive.app/docs/runtimes/getting-started)
- The editor and the `.riv` format are proprietary. A GitHub issue reply from Rive's side says Rive monetizes the editor and enterprise services. — [rive-flutter issue #476](https://github.com/rive-app/rive-flutter/issues/476)
- **Export restrictions (conflict):**
  - Rive's own blog says the **editor stays free but exports moved to paid plans**, so exporting for use in an app, game or website requires a paid plan. — [Rive blog: new $9/mo plan](https://rive.app/blog/rive-s-new-9-mo-plan)
  - A competitor's 2026 FAQ says free-plan exports work but **show a Rive splash screen**, and removing it requires a paid plan. — [ExodeUI FAQ](https://www.exodeui.com/questions/is-rive-free-for-commercial-use/)
- **Prices from aggregators (not confirmed on rive.app/pricing):**
  - Billed yearly: Free $0; $9 per seat per month (max 3 seats); $32 per seat per month (max 25 seats); $120 per seat per month (for companies with $10M+ annual revenue). — [FrontdeskReview, Sept 2026](https://frontdeskreview.com/software/design-tools/rive/)
  - The free plan is limited to about 3 files (or 3 collaborative files and 1 project). — [vijaytalksai](https://vijaytalksai.com/rive-pricing-explained/)
  - ExodeUI names the $9 tier "Cadet". TrustRadius lists a different $24 starting price (conflict). — [ExodeUI FAQ](https://www.exodeui.com/questions/is-rive-free-for-commercial-use/); [TrustRadius](https://tr-web.dev.trustradius.com/products/rive-app/pricing)
- **Rive web runtime packages (same API, different renderers):**
  - `@rive-app/webgl2` is recommended for most projects. It uses the Rive Renderer, which on the web depends on a draft WebGL extension, `WEBGL_shader_pixel_local_storage`.
  - `@rive-app/canvas` draws with Canvas2D. It is smaller and has no context limit, so it suits pages showing many animations at once.
  - `@rive-app/canvas-lite` drops the text, layout, audio and scripting engines.
  - `@rive-app/webgl` is deprecated.
  - Source: [Rive docs: canvas vs webgl](https://rive.app/docs/runtimes/web/canvas-vs-webgl)
- **Rive in Flutter:** the runtime is `rive_native`. The Rive Renderer arrived in Flutter runtime 0.14.0 and is **not supported on Linux through Flutter**, where you choose either the Rive renderer or Flutter's own (Skia/Impeller). — [Rive docs: choose a renderer](https://rive.app/docs/runtimes/choose-a-renderer/overview.md)
- Rive now markets itself as an "agent-native 2D and 3D engine for games, apps, and UI". — [rive.app](https://rive.app/)

#### Lottie / dotLottie
- LottieFiles added interactivity (state machines stored inside `.lottie` files) in `@lottiefiles/dotlottie-web` v0.30.2, across its Web, iOS and Android players. — [dotlottie-web discussion #313](https://github.com/LottieFiles/dotlottie-web/discussions/313)
- LottieFiles' docs warn that interactivity "is currently in its early stages of development and not production ready". State machines are authored with dotlottie-js. The state-machine wiki was last edited 2026-02-12. — [LottieFiles docs: interactivity](https://docs.lottiefiles.com/en/format/dotlottie/interactivity); [dotlottie-web wiki: State Machines](https://github.com/lottiefiles/dotlottie-web/wiki/State-Machines)
- LottieFiles said its new dotLottie players are built on the ThorVG renderer, moving away from lottie-web to get cross-platform parity. This is an older post. — [LottieFiles blog: dotLottie development update](https://lottiefiles.com/blog/working-with-lottie-animations/development-update-of-dotlottie-format)
- LottieFiles' Spring Curve plugin exposes duration and bounce. Higher bounce means more overshoot, with presets from smooth through snappy to bouncy. — [LottieFiles docs: Spring Curve](https://docs.lottiefiles.com/en/creator/14_plugins/spring-curve)

#### Motion (formerly Framer Motion)
- Motion is MIT-licensed. React users import from `motion/react` instead of `framer-motion`. Motion+ is a "one-time fee, lifetime update membership" with premium examples and components such as Cursor and Ticker. No price was found. — [npm: motion](https://npmjs.com/package/motion); [GitHub motiondivision/motion](https://github.com/motiondivision/motion)
- Version 12.42.x is on unpkg, and 13.x builds exist (motion@13.1.0). — [unpkg motion@12.42.2](https://unpkg.com/motion@12.42.2/README.md); [jsDelivr motion@13.1.0](https://cdn.jsdelivr.net/npm/motion@13.1.0/README.md)

#### GSAP (after Webflow)
- Webflow announced on **2025-04-30** that GSAP is 100% free for everyone, Webflow customer or not. That includes the formerly paid Club plugins, and commercial use is covered. — [Webflow blog](https://webflow.com/blog/gsap-becomes-free); [GSAP pricing page](https://www.gsap.com/pricing/)
- GSAP is not OSI open source. It ships under a separate "Standard No Charge" license, which says **Webflow may terminate the license and revoke access at its discretion**. — [Wind River license mirror](https://open.windriver.com/info/uni-license-list/licenses/gsap-standard-no-charge-2025.html); [ScanCode LicenseDB](https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html)
- The previous standard license required written permission for use in no-code visual animation-builder tools. I could not confirm whether that still applies. The `gsap-trial` package is deprecated. — [Webflow forum](https://discourse.webflow.com/t/webflow-makes-gsap-100-free/319967); [npm gsap-trial](https://npmjs.com/package/gsap-trial)

#### Native-engine animation systems
- **Godot:** `create_tween()` handles code-driven UI animation with easing. Godot 4.7 adds Control-node offset transforms, which let you animate UI without breaking layout. — [uhiyama-lab](https://uhiyama-lab.com/en/notes/godot/tween-smooth-animation/); [WN Hub news](https://wnhub.io/zh/news/engines/item-51174)
- **Avalonia:** Lottie plays through a SkiaSharp Skottie control. — [Lottie for Avalonia](https://wieslawsoltes.github.io/Home/projects/lottie/)

#### Design principles behind the feel (community guidance; low authority but consistent)
- **Spring easing vs spring physics:** spring easing sets duration plus overshoot and suits toggles and checkmarks. Spring physics (stiffness, damping, mass) suits drag and swipe. A "back" easing combines anticipation (a small wind-up) with overshoot. — [skills.cat: animation principles](https://skills.cat/skills/dylantarre/design-system-skills/animation-principles); [playbooks: react-spring principles](https://playbooks.com/skills/dylantarre/animation-principles/react-spring)
- **Disney principles mapped to UI:** anticipation for button presses and drag starts; follow-through for modals and toasts; squash-and-stretch used sparingly for toggles and icons to get a "playful, elastic feel". — [skills.cat: animation principles](https://skills.cat/skills/dylantarre/design-system-skills/animation-principles)
- **Timing:** about 50–100 ms for immediate feedback, 100–200 ms for standard transitions and 200–300 ms for complex sequences. A toggle that overshoots slightly should settle within 150–200 ms. Respect reduced-motion preferences. — [skills.cat: micro-interactions](https://skills.cat/skills/dylantarre/animation-principles/micro-interactions)

### Inferences
- **Recommended split of animation work:**
  1. **Rive:** the mascot, reactions to correct and wrong answers, and the streak, level-up and lesson-complete celebrations. Its state machines map naturally to quiz states (idle, thinking, correct, wrong, celebrate), which is the same pattern Duolingo uses.
  2. **Motion springs:** buttons (press squash, release overshoot), answer-card selection, the progress bar filling with overshoot, path nodes popping in with staggered spring reveals, and page and layout transitions.
  3. **A particle/confetti layer:** canvas-based, for lesson-complete moments.
  4. **Short sound effects:** played at the moment of feedback and synchronized to the spring's peak.
  5. **A "reduce motion / effects" setting:** this doubles as the Linux low-GPU fallback.
- **Rive on Tauri/Linux:** use `@rive-app/canvas` (Canvas2D) as the safe default. `@rive-app/webgl2` relies on a draft WebGL extension that WebKitGTK and WKWebView may not expose. Test both, and keep `canvas` unless profiling shows a need.
- **GSAP vs Motion:** for a React UI, Motion is the lower-friction choice (MIT, declarative springs, layout animations). GSAP's strength is long choreographed timelines, and it is now free, but its license is proprietary and revocable. Either is fine for a hobby project.
- **Lottie's role:** Lottie remains useful for free, non-interactive one-shots from the large LottieFiles library (trophies, confetti bursts). It is not the right tool for an interactive mascot until dotLottie's state machines mature.
- **Rive cost and alternatives:** the main costs are about $9/month for a paid plan, if one is needed to export without a splash screen, plus the time to learn the editor or commission assets. If that's a blocker, a free alternative is a mascot built from SVG parts animated with Motion springs, or Lottie one-shots.

### Gaps
- **Rive pricing:** the official pricing page could not be fetched. Plan names, prices and whether free-plan exports are allowed (splash screen vs paid-only) conflict between Rive's own blog and third-party 2026 sources. Verify at rive.app/pricing.
- **Duolingo's wider stack:** I found no Duolingo source describing its in-app (non-character) micro-interaction stack, sound design or confetti implementation, and the Duolingo blog content was seen only via search summary.
- **Web Animations API and CSS:** not researched. I did not verify support for the CSS `linear()` easing (spring approximations) or WAAPI behavior in WKWebView and WebKitGTK.
- **Flutter animation APIs:** I did not re-verify the specifics (implicit/explicit animations, `SpringSimulation`, the `flutter_animate` package).
- **Motion details:** I found no Motion+ price and did not review the Motion v13 changelog.
- **Rive runtimes on other frameworks:** I found no official Rive runtime for Avalonia, Compose Desktop or Godot.
- **WebGL in WebKitGTK:** I found nothing on whether WebKitGTK exposes the WebGL extension Rive's renderer uses.

---

## 3. What are the options for local persistence and spaced repetition?

### Takeaway
Use SQLite as the single source of truth for progress and review logs. In Tauri that means tauri-plugin-sql (sqlx, migrations); in Flutter, drift; in Electron, better-sqlite3, which needs native rebuilds. For scheduling, use FSRS:
- **ts-fsrs** (FSRS-6, v5.4.x) for TypeScript stacks.
- The pure-Dart **`fsrs`** package (MIT) for Flutter.
- **fsrs-rs** (Rust; BSD-3 per one source; used by Anki) if you want Rust-side scheduling or parameter optimization.
- **py-fsrs** (MIT) for offline tooling scripts.

### Cited Findings
- **ts-fsrs:**
  - Implements the **FSRS v6** algorithm. The npm README for **v5.4.1** carries an FSRS-v6 badge and requires Node ≥ 20.0.0. — [jsDelivr ts-fsrs@5.4.1 README](https://cdn.jsdelivr.net/npm/ts-fsrs@5.4.1/README.md)
  - Parameter optimization from review history is handled by the companion `@open-spaced-repetition/binding`. — [ts-fsrs docs index](https://docsearch.algolia.com/mcp/docs/repo/open-spaced-repetition/ts-fsrs); [ts-fsrs docs site](https://open-spaced-repetition.github.io/ts-fsrs)
  - Apps use ts-fsrs for FSRS-6, e.g., "True Recall for Obsidian". — [awesome-fsrs](https://github.com/open-spaced-repetition/awesome-fsrs)
- **fsrs-rs:** the main Rust implementation (optimizer plus scheduler), "designed to be used in Anki". One source lists it as **BSD-3-Clause**. — [ecosyste.ms project page](https://science.ecosyste.ms/projects/42833)
- **rs-fsrs:** a separate Rust crate. Its listing shows both MIT and a "Custom license" label (conflict); check the LICENSE file. — [lib.rs rs-fsrs](https://lib.rs/crates/rs-fsrs)
- **py-fsrs:** the PyPI `fsrs` package is **MIT** across versions 0.1.3 through 2.5.1. — [PyPI fsrs 2.5.1](https://pypi.org/project/fsrs/2.5.1)
- **Dart `fsrs` (pub.dev):** v2.0.1 is a pure Dart implementation, **MIT**, © Open Spaced Repetition, depending only on `meta`. It is ported from py-fsrs. — [pub.dev fsrs license](https://pub.dev/packages/fsrs/license); [pub.dev fsrs](https://pub.dev/packages/fsrs)
- **fsrs-rs-dart:** the Rust implementation with Flutter/Dart bindings through flutter_rust_bridge, plus a scheduler with py-fsrs-style learning and relearning steps. **MIT**. — [GitHub fsrs-rs-dart](https://github.com/open-spaced-repetition/fsrs-rs-dart)
- **fsrs_dart:** a separate MIT package by an individual developer. It needs a Rust toolchain. — [pub.dev fsrs_dart license](https://pub.dev/packages/fsrs_dart/license)
- **tauri-plugin-sql (official):**
  - Built on sqlx, with SQLite, MySQL and PostgreSQL selected via Cargo features. Needs Rust ≥ 1.80.
  - Migrations are defined in Rust, each with a version, description, SQL and type (Up/Down), registered per connection string and applied automatically when the plugin initializes.
  - Sources: [Tauri docs: SQL plugin](https://v2.tauri.app/jp/plugin/sql); [npm @tauri-apps/plugin-sql](https://www.npmjs.com/package/@tauri-apps/plugin-sql); [GitHub tauri-plugin-sql](https://github.com/tauri-apps/tauri-plugin-sql)
- **Community `tauri-plugin-sqlite` variants:** these use sqlx's migration system with numbered `.sql` files embedded at compile time, track applied migrations in `_sqlx_migrations`, and have `Database.load()` wait until migrations finish. Several forks exist and the maintainer is ambiguous. — [GitHub velocitysystems/tauri-plugin-sqlite](https://github.com/velocitysystems/tauri-plugin-sqlite)
- **better-sqlite3 in Electron:**
  - It is a native addon that must be **recompiled against Electron's ABI**. The symptom is a `NODE_MODULE_VERSION` mismatch, and the standard fix is `@electron/rebuild`, which Electron Forge and Packager call during packaging.
  - Users report rebuild failures on newer Electron versions, and one user reports electron-builder's `install-app-deps` broken for Electron 20+.
  - Sources: [michaelheap.com via scour](https://scour.ing/p/https://michaelheap.com/electron-node-module-version); [better-sqlite3 issue #126](https://www.github.com/WiseLibs/better-sqlite3/issues/126); [BlackGlory notes](https://blackglory.me/notes/electron/Electron(v28)/Persistence/Databases/better-sqlite3(v7.4.4,_Requires_electron-rebuild)?variant=en)
- **drift (Flutter):**
  - A reactive persistence library on SQLite. `NativeDatabase` (dart:ffi) covers Android, iOS, **Windows, Linux and macOS** with no further setup; running it in an isolate is recommended.
  - It does not detect changes made by external tools.
  - The official repository is simolus3/drift.
  - Sources: [drift docs index](https://docsearch.algolia.com/mcp/docs/repo/simolus3/drift); [drift repo mirror](https://github.com/momadvisor/drift)

### Inferences
- **Minimal schema (implementation sketch):**
  - `cards`: content_item_id, content_version, and the FSRS state fields: due, stability, difficulty, elapsed/scheduled days, reps, lapses, state, last_review.
  - `review_logs`: card_id, rating, reviewed_at, response_ms, was_hint_used.
  - `lesson_progress`, `xp_events`, `streak_days`, `settings`.
  - Keep stable content IDs so content updates don't orphan review history (see Q4).
- **Mapping quiz outcomes to FSRS ratings:** wrong → Again; correct but slow or with a hint → Hard; correct → Good; correct and fast → Easy. The other researcher owns the pedagogy; this is only the plumbing. Default FSRS parameters are fine for an MVP. Add optimization (the ts-fsrs binding or fsrs-rs) after a user has a few hundred reviews.
- **Why not IndexedDB or JSON:**
  - IndexedDB lives inside the webview's profile storage, which is engine-specific (WebView2, WKWebView, WebKitGTK) and harder to back up, export or inspect. A SQLite file in the app-data directory is portable and easy to back up.
  - Plain JSON is fine for settings if written atomically (write a temp file, then rename), but it is fragile for an append-heavy review log.
- **Electron alternative:** if choosing Electron, prefer a SQLite option that doesn't need per-Electron-version native rebuilds, or budget for the `@electron/rebuild` step in CI.
- **Mature, permissive options everywhere:** ts-fsrs, the Dart `fsrs` package, py-fsrs and fsrs-rs come from the same open-spaced-repetition organization, so all the candidate stacks have one. The FSRS scheduler isn't a factor in choosing a stack.

### Gaps
- **ts-fsrs:** its license was not confirmed in this session (believed MIT, unverified). The v5.4.1 release date is unknown, and browser bundle size and compatibility were not checked.
- **fsrs-rs:** the BSD-3-Clause license comes from a single aggregator.
- **IndexedDB:** I did not research durability or eviction behavior in WKWebView, WebKitGTK and WebView2.
- **Electron SQLite alternatives:** I did not verify Electron-friendly options that avoid native rebuilds (e.g., WASM SQLite or Node's built-in SQLite).

---

## 4. How should lesson content be authored and versioned (files, schemas, images, hotspots, band-data updates)?

### Takeaway
1. Author lessons as plain-text files in git (YAML, JSON, or Markdown with front matter) and validate them against a schema in CI.
2. Compile them into a versioned "content pack" (JSON plus WebP images) that ships inside the app.
3. Keep the cellular band and spectrum facts in a separate, source-cited data table that *generates* quiz items, so a spectrum change is a one-file data edit plus a rebuild.
4. Draw hotspot regions for "tap the radio" items with an embeddable annotation library such as Annotorious (BSD-3) inside a small authoring page, and store coordinates normalized to 0–1.

### Cited Findings
- **Annotorious:** a JavaScript image-annotation library. The current TypeScript/Svelte line is **BSD-3-Clause**; some older forks say MIT. Rectangle and polygon modes exist; an R wrapper exposes a rectangle/polygon toggle. — [GitHub Annotorious mirror](https://github.com/rssaini01/annotorious); [npm @cogic/annotorious](https://www.npmjs.com/package/@cogic/annotorious); [CRAN recogito reference](https://mirror.uned.ac.cr/cran/web/packages/recogito/refman/recogito.html)
- **Image format support in the target webviews:**
  - Safari has supported **WebP since Safari 14** (macOS Big Sur). — [Appwrite blog](https://appwrite.io/blog/post/webp-support-for-safari.md)
  - **AVIF** arrived with Safari 16 and macOS Ventura. — [Michael Tsai: Safari 16](https://mjtsai.com/blog/2022/09/13/safari-16)
  - AVIF worked in the WebKitGTK and WPE ports before Apple's ports (2021). — [Frontend Focus link: Why WebKit supports AVIF but Safari does not](https://frontendfoc.us/link/112771/rss)
  - A WebKit bug reports WKWebView failing to render AVIF in some macOS configurations ("designed for iPad" apps), still affecting Safari 18.0 at the time. — [WebKit Bugzilla 277794](https://bugs.webkit.org/show_bug.cgi?id=277794)
- **Rive file weight:** `@rive-app/canvas-lite` omits the text, layout, audio and scripting engines, so `.riv` files that don't use those features can use a smaller runtime. — [Rive docs: canvas vs webgl](https://rive.app/docs/runtimes/web/canvas-vs-webgl)
- **Shipping content updates:** Tauri's updater uses its own signing keypair, so content shipped inside app releases inherits signed updates. — [dev.to: Tauri v2 code signing](https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-code-signing-for-macos-and-windows-part-12-3o9n)

### Inferences
- **Repository layout:**
  - `content/units/*.yaml`: units, lessons and exercises.
  - `content/data/bands.yaml` (or CSV): band number, name, duplex mode, uplink and downlink ranges, regions or carriers, source reference, `verified_on` date.
  - `content/media/` holds the originals. A `build-content` script validates everything, generates band-derived quiz items, converts images and emits `dist/content-pack.json` with a semver `content_version` and a schema version.
- **Schema:** define the lesson schema once (e.g., Zod in a TypeScript stack, exporting JSON Schema for editor autocompletion in VS Code YAML files). Model exercise types as a discriminated union on `type`: `mcq`, `image_mcq`, `hotspot`, `match_pairs`, `order`, `type_answer`. Validation failures break CI, so bad content never ships.
- **Images:**
  - Default to **WebP**, the safest across WebView2, WKWebView (Safari 14+) and WebKitGTK.
  - Treat AVIF as optional, given the WKWebView rendering bug and build-dependent WebKitGTK support.
  - Export at about 2x the maximum on-screen display size and strip metadata. Keep originals out of the shipped bundle.
- **Hotspots:**
  - Draw polygons in an internal authoring page (Annotorious over the photo).
  - Save as `{shape: polygon, points: [[x, y], ...]}` normalized to 0–1, so hit-testing survives responsive resizing.
  - Allow a tolerance margin.
  - Store one or more correct regions plus optional "near-miss" regions for feedback text.
- **Band and spectrum updates:**
  - Keep `bands.yaml` as the only place frequencies live, and generate quiz items from it at build time, never hand-typing frequencies into lessons.
  - Every row carries a source and a `verified_on` date.
  - When spectrum changes (refarming, a new band, an auction), edit the row, rebuild, bump `content_version` and ship.
- **Delivering content updates:**
  - Option 1, bundle content with app releases: simplest, signed through the updater, and works offline after install.
  - Option 2, publish a separately versioned, signed content pack (e.g., a GitHub Release asset) that the app checks for occasionally, falling back to the bundled pack offline.
  - Start with option 1.
- **Preserving review history:** content edits must keep exercise IDs stable. Removed items are tombstoned, not deleted, and the app migrates or retires orphaned FSRS cards by `content_item_id` when the pack version changes.

### Gaps
- I did not verify versions or features of the schema tools (Zod, JSON Schema validators like Ajv) or image tooling (e.g., sharp, squoosh).
- I did not research alternative hotspot and annotation tools (VGG Image Annotator, makesense.ai, Label Studio, CVAT). Only Annotorious was checked.
- I have no mapping from WebKitGTK version to AVIF/WebP support.
- I did not check authoritative band-table sources (3GPP/FCC); the other researcher covers bands.

---

## 5. Which starter templates or open-source projects shorten the path, and what is a realistic MVP effort?

### Takeaway
Scaffold with `npm create tauri-app@latest`, choosing React or Svelte with TypeScript. Borrow UI patterns (lesson flow, hearts, XP, path layout) from MIT-or-similar Next.js Duolingo clones, and strip out their server stack (Clerk, Neon/Postgres, Stripe, Drizzle). I found no published effort data. My estimate for one hobbyist experienced in web development is about **115–220 engineering hours plus 30–80 hours of content authoring**, roughly 3–6 months at 10–15 hours a week.

### Cited Findings
- **create-tauri-app:**
  - Run `npm create tauri-app@latest`, then `npm run tauri dev`.
  - Front-end templates: vanilla, Vue, Svelte, React, Solid, Angular and Preact (TS or JS), plus the Rust front ends Yew, Leptos and Sycamore.
  - Language options are Rust, TypeScript/JavaScript or .NET. Package managers: pnpm, yarn, npm, bun.
  - Sources: [Tauri docs: Create a Project](https://v2.tauri.app/guides/create/); [Tauri docs (DE): create project](https://v2.tauri.app/de/start/create-project/)
- **Vite:** a third-party guide says the React, Vue and Svelte templates are Vite-based. Tauri's docs also document the "create Vite app, then add the Tauri CLI" route and recommend the TypeScript variants. — [playbooks: tauri-project-setup](https://playbooks.com/skills/dchuk/claude-code-tauri-skills/tauri-project-setup); [Tauri v1 docs: Vite setup](https://v1.tauri.app/v1/guides/getting-started/setup/vite)
- **Open-source Duolingo clones:**
  - **bryanjenningz/react-duolingo:** React, TypeScript, Next.js, Tailwind and Zustand, scaffolded with create-t3-app. It has a live Vercel demo and no payments, making it the simplest to strip down. — [GitHub react-duolingo](https://www.github.com/bryanjenningz/react-duolingo)
  - **BernieTv/Duo-Clone:** Next.js 14, Drizzle, Stripe and Tailwind, with a hearts shop and paid tier. — [GitHub Duo-Clone](https://github.com/bernietv/duo-clone)
  - **NickCoder123/duolingo-clone:** Next.js 14 RSC, server actions, shadcn/ui, Tailwind, Drizzle, Stripe, Clerk and Neon. — [GitHub duolingo-clone](https://github.com/NickCoder123/duolingo-clone)
  - **RikhiSingh/Duolingo-Clone:** Next.js, TypeScript, Tailwind, shadcn/ui, Drizzle, Neon, Zustand, a react-admin dashboard, Stripe and Google SSO. — [GitHub Duolingo-Clone](https://github.com/RikhiSingh/Duolingo-Clone)
  - More clones are listed on [GitHub topic: duolingo (TypeScript)](https://github.com/topics/duolingo?l=typescript).
  - Several are tutorial follow-alongs; check licenses and last-commit dates before reusing code. — [GitHub topic: duolingo](https://github.com/topics/duolingo?l=typescript)

### Inferences
- **MVP effort estimate.** This is my synthesis, not a sourced figure. It assumes a hobbyist comfortable with TypeScript/React, the Tauri stack, uses an AI coding assistant, and has these MVP features: path map, 4 exercise types, FSRS reviews, XP/streak, a Rive mascot, three-OS builds with auto-update.

| Work item | Hours (low–high) |
|---|---|
| Project setup, CI builds for Win/macOS/Linux (GitHub Actions) | 8–15 |
| Learning-path map UI and navigation | 15–25 |
| Exercise engine and 4 types (MCQ, image MCQ, tap-the-hotspot, match pairs) | 25–45 |
| SQLite schema, FSRS integration, review queue | 10–20 |
| Animation polish (springs, transitions, confetti, SFX, Rive integration) | 20–40 |
| Content pipeline (schema, validation, image processing, hotspot authoring page) | 15–25 |
| Packaging, signing, updater, release process | 8–20 |
| Cross-OS testing and bug fixing (incl. Linux WebKitGTK) | 15–30 |
| **Engineering subtotal** | **~115–220** |
| Content authoring (e.g., ~10 units × 5 lessons, images, hotspots) | 30–80 |
| Rive mascot authoring, if self-made (learning curve + rig + state machine) | +10–40, or commission/buy |

- **Fastest path:** treat the clones as a design and pattern reference, not as a base. Their server-centric architecture (RSC, server actions, Postgres, auth, payments) is the opposite of an offline desktop app. Start from create-tauri-app and port components selectively.
- **Comparison by stack (relative):** Flutter costs about the same as Tauri for someone fluent in Dart, and more if Dart is new. Godot is faster for "juice" but slower for app UI. Electron is the same as Tauri minus the Rust/toolchain setup, plus native-module rebuild work.
- **Recommended first step:** a 1–2 day spike. Build one animated lesson screen (Rive mascot, spring buttons, confetti) and run it on all three OSes, including a Linux machine. Do this before committing to the stack.

### Gaps
- I found no published data on MVP build time for comparable apps; the hours above are an estimate.
- I did not verify the clone repos' licenses, maintenance status or star counts.
- I found no maintained Tauri- or Flutter-specific Duolingo-style template, and did not research reusable "gamified quiz engines" (e.g., H5P-like libraries).
- I did not research Flutter starter templates.

---

## 6. What would optional AI features cost and require (Claude API or local model), and how would that affect offline use?

### Takeaway
To keep the app fully offline, use AI **at authoring time, not at runtime**. Batch-generate draft explanations and quiz items into the content repo and review them by hand (essential for frequency facts). At late-2026 Claude prices this costs pennies to a few dollars per thousand items. Runtime AI breaks offline use and needs either the user's own API key or a proxy server. Local models (Ollama/llama.cpp) keep offline use but need about 8–16 GB of RAM and multi-GB downloads, and they're weaker on niche technical facts.

### Cited Findings
- **Claude API prices** per million tokens (input/output), from Anthropic's model/pricing reference cached 2026-10-06. — [Anthropic pricing docs](https://platform.claude.com/docs/en/about-claude/pricing)
  - **Claude Haiku 5.5** (`claude-haiku-5-5`): $0.10 / $0.50 for prompts up to 100K tokens; $0.50 / $2.50 beyond.
  - **Claude Sonnet 5.5** (`claude-sonnet-5-5`): $2 / $10; cache reads $0.20.
  - **Claude Opus 5.5** (`claude-opus-5-5`): $4 / $20; cache reads $0.20.
  - **Claude Haiku 4.5:** $1 / $5.
- **Message Batches API:** runs asynchronously at **50% of the standard cost**. — [Anthropic batch processing docs](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- **Prompt caching:** reuses a stable prefix (e.g., a fixed system prompt plus the lesson schema), and cached reads are billed at the much lower cache-read rate. — [Anthropic prompt caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- **Structured outputs:** `output_config.format` constrains responses to a JSON schema, so generated quiz items can match the lesson schema. — [Anthropic structured outputs docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- **Local models (RAM guidance):**
  - Very small models (0.5–1.5B parameters) run in about 8 GB of system RAM, and 2–4B models need about 8–16 GB.
  - On an 8 GB machine without a GPU, 3B models (e.g., llama3.2:3b, qwen3:3b) are "slow but usable for small tasks". tinyllama:1.1b is a 1.5 GB download.
  - Other guides set a 16 GB baseline for CPU-only inference, at 3–6 tokens/s on small models.
  - Ollama wraps llama.cpp and adds overhead. Q4_K_M quantization is the common sweet spot.
  - Sources: [itsourcecode Ollama tutorial](https://itsourcecode.com/web-dev/run-local-llms-with-ollama-2026-tutorial/); [SitePoint Ollama guide](https://www.sitepoint.com/ollama-setup-guide-2026/); [dataaspirant](https://dataaspirant.com/blog/run-llms-locally-with-ollama/); [TransIP knowledge base](https://transip.eu/knowledgebase/which-ai-model-llm-and-server-size-should-i-use/); [TDS local LLMs notes](https://tds.s-anand.net/2026-02/docs/week-2/11-local-llms/)

### Inferences
- **Worked cost example**, computed from the prices above. Assume 1,000 generated explanations or items, each with about 1,500 input tokens (mostly a cacheable system prompt plus schema) and about 300 output tokens, i.e., 1.5M input and 0.3M output tokens in total.
  - **Haiku 5.5:** about $0.15 input + $0.15 output ≈ **$0.30**, or about $0.15 via Batches.
  - **Sonnet 5.5:** $3.00 + $3.00 ≈ **$6**, or about $3 batched.
  - **Opus 5.5:** $6 + $6 ≈ **$12**, or about $6 batched.
  - Prompt caching lowers input costs further.
  - At hobby scale, AI-assisted content generation is effectively free. The real cost is human review time.
- **Accuracy:** LLMs can hallucinate band numbers and frequency ranges. Generated items about spectrum must be checked against the source-cited `bands.yaml` (Q4), ideally automatically: generate wording with the LLM, but take frequencies only from the data table.
- **API keys:** never embed an API key in a distributed desktop app, because it can be extracted from the binary. Runtime AI options:
  - The user supplies their own key, stored in the OS keychain.
  - A tiny serverless proxy with rate limits. This adds hosting work and cost.
  - Either way, the feature should degrade gracefully offline: hide it and fall back to static explanations.
- **Local models:** optional integration with a user-installed Ollama (localhost API) keeps offline use without bloating the installer. Bundling a model would add gigabytes and defeat Tauri's size advantage.
- **Recommended MVP scope:** none at runtime. Add a `scripts/generate-items` authoring tool that calls Claude (Batches plus structured outputs) and writes YAML drafts for review.

### Gaps
- The Haiku 5.5 price ($0.10 / $0.50) is roughly 10x lower than Haiku 4.5's. It comes from Anthropic's reference cached 2026-10-06 and should be confirmed on the live pricing page before budgeting.
- I have no measured token counts for this app's actual prompts, so the costs above are illustrative.
- I did not evaluate local-model quality on radio and cellular technical content.

---

## 7. Recommendation: which stack (primary plus runner-up) should a solo hobbyist choose, and what are the trade-offs?

### Takeaway
**Primary: Tauri 2.x + React (or Svelte) + TypeScript + Vite + Tailwind.**
- Animation: Motion for springs and layout, the Rive web runtime (`@rive-app/canvas`) for the mascot and celebrations, plus a lightweight confetti/particle layer and short sound effects.
- Data: ts-fsrs for scheduling, SQLite via tauri-plugin-sql for persistence.
- Content: schema-validated YAML/JSON content packs with WebP images and Annotorious-drawn hotspots.
- Distribution: Tauri updater plus GitHub Releases.

**Runner-up: Flutter 3.47 + Rive (`rive_native`) + drift + the Dart `fsrs` package.** Pick it if consistent, self-rendered animation on every OS (and freedom from webview quirks) matters more than installer size and the web ecosystem. **Electron** is the zero-rewrite escape hatch for the primary stack's front end if WebKitGTK on Linux proves unacceptable.

### Cited Findings
- **Tauri's size and memory advantage over Electron:** about 3–10 MB vs about 85–250 MB installers, and about 42–50 MB vs about 120–170 MB idle RAM. — [tech-insider](https://tech-insider.org/tauri-vs-electron-2026/); [Hopp blog](https://www.gethopp.app/blog/tauri-vs-electron); [buildmvpfast](https://www.buildmvpfast.com/blog/tauri-v2-vs-electron-desktop-apps-2026)
- **Tauri's known weak spots:**
  - On Linux, WebKitGTK's DMABUF/NVIDIA issues and CSS-animation bugs. — [Tauri Linux graphics docs](https://v2.tauri.app/develop/debug/linux-graphics/); [WebKit Bugzilla 255328](https://bugs.webkit.org/show_bug.cgi?id=255328); [WebKit Bugzilla 265048](https://bugs.webkit.org/show_bug.cgi?id=265048)
  - On macOS, the WKWebView ~60 fps rAF clamp. — [WebKit Bugzilla 294338](https://bugs.webkit.org/show_bug.cgi?id=294338); [docs.rs tauri-plugin-macos-fps](https://docs.rs/crate/tauri-plugin-macos-fps/0.1.0)
- **Animation ecosystem for the primary stack:** Rive's MIT web runtimes with a Canvas2D option, Motion (MIT), and GSAP, now free under a custom license. — [Rive docs: canvas vs webgl](https://rive.app/docs/runtimes/web/canvas-vs-webgl); [npm motion](https://npmjs.com/package/motion); [Webflow blog](https://webflow.com/blog/gsap-becomes-free)
- **Duolingo's character pipeline uses Rive state machines,** which validates Rive as the "Duolingo feel" tool. — [Duolingo Blog](https://blog.duolingo.com/world-character-visemes); [Rive case study](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)
- **Runner-up facts:**
  - Flutter 3.47 made Impeller the default on desktop (secondary source). — [startdebugging.net](https://startdebugging.net/2026/08/flutter-3-47-impeller-default-renderer-on-desktop/)
  - Rive's Flutter runtime is `rive_native`, but the Rive Renderer isn't available on Linux in Flutter. — [Rive docs: choose a renderer](https://rive.app/docs/runtimes/choose-a-renderer/overview.md)
  - drift's NativeDatabase covers Windows, Linux and macOS. — [drift docs index](https://docsearch.algolia.com/mcp/docs/repo/simolus3/drift)
  - The Dart `fsrs` package is pure Dart and MIT. — [pub.dev fsrs](https://pub.dev/packages/fsrs/license)
- **Excluded or deprioritized:**
  - .NET MAUI has no official Linux. — [byteiota](https://byteiota.com/net-maui-linux-support-two-paths-forward-in-2026/)
  - Wails v3 is still beta. — [GitHub Wails v3.0.0-beta.26](https://github.com/wailsapp/wails/releases/tag/v3.0.0-beta.26)
  - Compose Desktop bundles a JRE (~68 MB) and ships ~100 MB+ packages. — [Kotlin Slack thread](https://slack-chats.kotlinlang.org/t/10320208/i-d-like-to-share-a-lesson-learned-with-you-which-you-may-fi)
  - Godot's default export is ~93 MB uncompressed. — [popcar blog](https://popcar.bearblog.dev/how-to-minify-godots-build-size/)

### Inferences
- **Why Tauri is primary for this hobbyist:**
  1. Tiny downloads and low RAM make the app pleasant to share.
  2. The richest animation tooling (Rive, Motion, GSAP, Lottie, CSS), the most tutorials, and the best AI-assistant fluency (TypeScript/React).
  3. Almost no Rust is needed: official plugins cover SQL, the updater and the file system.
  4. ts-fsrs is a drop-in FSRS-6 scheduler.
  5. The front end stays portable to Electron if Linux rendering disappoints.
- **Trade-offs accepted with Tauri:**
  - Three different engines to test: Chromium-based WebView2, WKWebView and WebKitGTK.
  - A probable 60 fps ceiling on macOS (fine for this app).
  - Linux GPU/driver quirks, mitigated by compositor-only animations, a reduce-effects toggle, the `@rive-app/canvas` renderer and early Linux testing.
  - Rust toolchain setup.
- **When to choose the runner-up (Flutter) instead:**
  - You want pixel-identical animation on Linux and macOS without testing three web engines.
  - You're happy to learn Dart.
  - You value Flutter's built-in animation and physics primitives and first-class Rive integration.
  - You accept about 25 MB installers, a smaller desktop plugin ecosystem, and Rive falling back to Flutter's renderer on Linux.
- **When to choose Electron instead:**
  - Rendering consistency and maximum ecosystem maturity (Forge, autoUpdater, extensive docs) outweigh size.
  - Or the week-1 Linux spike shows unacceptable WebKitGTK jank.
  - Note: the 8-week Electron major cadence means regular upgrades.
- **When Godot makes sense:** only if the hobbyist already knows Godot, or wants the app to feel like a game first and a form-heavy app second.
- **Decision rule:** run the 1–2 day spike (one animated lesson screen on Windows, macOS and Linux).
  - If it's smooth on all three in Tauri, commit to Tauri.
  - If Linux is janky but you want to stay on web tech, move the same code to Electron.
  - If you'd rather leave web tech, switch to Flutter.
- **Budget:**
  - Software: $0 (all MIT/BSD/free tools) plus an optional Rive paid plan (about $9/month if needed for clean exports).
  - Signing: optional $99/year for Apple and roughly $120/year (Azure Trusted Signing, if eligible) to $200–700/year for Windows.
  - AI generation: optional, a few dollars at hobby scale.

### Gaps
- I have no hands-on measurement of Rive-in-Tauri (canvas vs webgl2) frame timing on WebKitGTK or WKWebView. This is the single biggest unknown for the primary recommendation, and the spike is meant to answer it.
- The hobbyist's prior language experience (TS, Dart, C#, Go, GDScript) is unknown and could legitimately change the ranking. The recommendation assumes web/TypeScript familiarity.
- The official Rive pricing and export terms couldn't be verified, which affects whether Rive costs $0 or about $9/month.
