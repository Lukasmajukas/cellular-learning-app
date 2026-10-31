# Learning and gamification design for a Duolingo-style desktop app (US LTE/5G bands and cell-site identification)

*Compiled 2026-10-31. This session could not reach Duolingo's own sites (blog.duolingo.com and research.duolingo.com did not resolve). Claims attributed to those pages come from search-engine snippets of the pages and are marked "(via search snippet)". To verify them directly, those domains must be allowed in the session's network settings. Third-party "Duolingo guide" sites are low-authority and are flagged where used.*

---

## 1. Duolingo's core structural and motivational mechanics as of 2026, and what Duolingo has published about which ones work

### Takeaway
Duolingo in 2026 has three layers:
- **Structure:** a linear "path" of short lessons grouped into units and sections, with harder "Legendary" challenges at the end of each unit (since the 2022 redesign).
- **Habit:** XP, a daily goal, a streak protected by Streak Freezes, weekly 10-tier leagues, quests and gems.
- **Error limits:** these moved from Hearts (lose one per mistake) to Energy, rolled out from mid-2025.

Duolingo's published evidence is mostly about engagement and retention, for example streak changes, leaderboards giving +17% learning time, and HLR giving +12% daily engagement. It has published little causal evidence that individual game mechanics improve learning. Its learning claims rest on adaptive difficulty (Birdbrain), spaced review (HLR), and company-funded efficacy studies.

### Cited Findings

**Learning path (2022 redesign)**
- The branching skill tree was replaced by a linear path in 2022. Appleosophy reported it rolling out to iOS users on Aug 30, 2022, after a May 2022 announcement — [Appleosophy](https://appleosophy.com/2022/08/30/new-duolingo-design-begins-rolling-out-to-ios-users/). Another source dates the Path's introduction to Nov 1, 2022 (probably the general rollout), so exact dates conflict — [iTechGuides](https://www.itechguides.com/duolingo-app-update-with-path-ui-facing-backlash-from-users-but-the-2026-controversy-is-bigger-than-the-redesign/). Von Ahn interview on the redesign: [NBC News](https://www.nbcnews.com/tech/tech-news/duolingos-update-redesign-luis-von-ahn-interview-rcna44655).
- Duolingo's FAQ for the redesign says:
  - lessons were reordered to mix concepts and grouped into smaller units;
  - Legendary status now applies to a whole unit, with the Legendary challenges at the end of each unit, rather than to a single skill;
  - during migration, a completed unit was marked Legendary if more than 50% of its levels came from skills already at Legendary.
  — [Duolingo blog, "new home screen design" (via search snippet)](https://blog.duolingo.com/new-duolingo-home-screen-design)
- Criticism of the redesign:
  - the flattened path makes a very long timeline and assumes learners follow the set sequence rather than learning non-linearly — [UX Collective](https://uxdesign.cc/down-the-wrong-path-the-disaster-of-the-latest-duolingo-ui-update-a4cdd1e6ea1c);
  - users complained that old material was mixed into new lessons and that they could no longer choose lesson types on mobile — [Hacker News](https://news.ycombinator.com/item?id=33673522);
  - the reorganization scrambled many learners' progress — [Korben](https://korben.info/en/duolingo-overhauled-courses-alienated-users.html).
- **2026:** the main backlash is about rebuilt courses that changed content sequencing. On Apr 1, 2026, Duolingo reportedly acknowledged transition problems and announced catch-up lessons (secondary source) — [iTechGuides](https://www.itechguides.com/duolingo-app-update-with-path-ui-facing-backlash-from-users-but-the-2026-controversy-is-bigger-than-the-redesign/).

**How lessons adapt (Birdbrain, half-life regression, LLM content)**
- **Birdbrain** models the probability of a correct answer from two quantities: exercise difficulty and learner ability. Difficulty is built from features such as exercise type and vocabulary. After every exercise both estimates update: a wrong answer lowers the learner's estimated ability and raises the exercise's estimated difficulty. A "session generator" uses these predictions to choose the exercises for the next lesson — [IEEE Spectrum](https://spectrum.ieee.org/duolingo).
- Duolingo says Birdbrain finds exercises "at just the right difficulty level for this specific learner." It also says A/B tests show that building lessons at the right difficulty "has consistently helped learners learn more" — [Duolingo blog, Introducing Birdbrain (via search snippet)](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain).
- Exercises are now written by an LLM and reviewed by human experts, with prompts that vary by course and difficulty level. Birdbrain still selects the exercises — [Duolingo blog, LLM lessons (via search snippet)](https://blog.duolingo.com/large-language-model-duolingo-lessons/).
- **Half-life regression (HLR)**, Settles & Meeder, ACL 2016, "A Trainable Spaced Repetition Model for Language Learning":
  - The abstract reports 45%+ lower error than several baselines at predicting recall, and a 12% improvement in daily student engagement in an operational user study — [ACL Anthology P16-1174](https://preview.aclanthology.org/landing_page/P16-1174).
  - Settles told VentureBeat: "When we put it into production, we saw a 12% boost in user engagement" — [VentureBeat](https://venturebeat.com/ai/how-duolingo-is-using-ai-to-humanize-virtual-language-lessons).
  - Duolingo's write-up says that on more than 12M practice sessions, HLR's error was nearly half that of the Leitner system used in the first version of Duolingo — [Duolingo blog, "how we learn how you learn" (via search snippet)](https://blog.duolingo.com/how-we-learn-how-you-learn).
  - About 13M learning traces were released publicly — [Gigazine](https://www.gigazine.net/gsc_news/en/20170112-duolingo-half-life-regression).
- **HLR model form:** recall probability p = 2^(−Δ/h), where Δ is the time since the item was last practiced. The half-life is h = 2^(Θ·x), where x holds features such as practice-history counts and word tags — [ACL Anthology P16-1174](https://preview.aclanthology.org/landing_page/P16-1174). (I recalled this formula from the paper; I could not re-check it in this session.)
- A 2026 PMLR paper revisits HLR for "explainable and personalized" spaced repetition and reports gains over the original — [PMLR v339](https://proceedings.mlr.press/v339/ilidio26a.html).
- In the independent open-spaced-repetition benchmark, HLR does far worse than FSRS: log loss 0.469 vs 0.346 for FSRS-6, and AUC 0.637 vs 0.703 — [srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark).

**XP, daily goal, streak, Streak Freeze**
- Historically the daily goals were XP tiers: Casual 10, Regular 20, Serious 30, Intense 50. One guide says recent updates removed this choice, so what is offered now is unclear (low-authority source) — [duolingoguides](https://duolingoguides.com/how-to-change-daily-goals-on-duolingo/).
- **Streak decoupled from the daily goal.** Previously a learner had to meet the daily XP goal to extend the streak; Duolingo separated the two. For new learners, the share of daily users on a streak rose (a 19% figure is reported), and the number of learners on a 7+ day streak rose by more than 40%. Learners who reach a 7-day streak are reported to be 2.4x more likely to come back the next day — [Duolingo blog, "improving the streak" (via search snippet)](https://blog.duolingo.com/improving-the-streak).
- **Retention team (Group PM Jackson Shuttleworth):**
  - 600+ streak experiments over four years, about half shut down for no positive result;
  - the first seven days are the most fragile;
  - switching from an XP-based streak to a one-lesson-per-day streak was a huge driver of engagement;
  - the episode also covers a "Perfect Streak" feature and how Streak Freeze was developed.
  — [Lenny's Newsletter episode page](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks); [recall.it summary (auto-generated)](https://www.recall.it/summary/lennys-podcast/behind-the-product-duolingo-streaks-or-jackson-shuttleworth-group-pm-retention-team)
- Streak Freeze pauses the streak for a day. Duolingo later let learners hold up to two Freezes at once — [Duolingo blog, keeping your streak on vacation (via search snippet)](https://blog.duolingo.com/how-to-keep-your-streak-on-vacation).
- Secondary reports of A/B tests:
  - emphasizing the streak: +1% DAU;
  - tiered achievement badges: +1% DAU and +1% D14 retention;
  - re-engagement emails sent 23.5 h after the last lesson worked best.
  — [Econsultancy](https://econsultancy.com/six-a-b-tests-used-by-duolingo-to-tap-into-habit-forming-behaviour/)

**Hearts → Energy (2025–2026)**
- Under Hearts, each mistake cost free learners one of five hearts — [Duolingo blog, Energy (via search snippet)](https://blog.duolingo.com/duolingo-energy/); [lingoly, Aug 2026](https://lingoly.io/duoling-hearts-vs-energy/).
- Duolingo said Hearts "was not the most effective way to support learning." A stated reason was that beginners were twice as likely to run out of Hearts mid-lesson — [Duolingo blog, Energy (via search snippet)](https://blog.duolingo.com/duolingo-energy/); coverage: [AOL](https://www.aol.com/news/duolingo-bringing-energy-language-learning-120004759.html), [Feedbagel](https://feedbagel.com/post/duolingo-introduces-energy-feature-to-replace-hearts-for-enhanced-learning).
- **Timeline:** The Verge reported the change in May 2025, according to secondary guides — [lingoly](https://lingoly.io/duoling-hearts-vs-energy/). A fan wiki says Energy testing began on Jul 3, 2025 — [Duolingo Fandom wiki](https://duolingo.fandom.com/wiki/Energy). Management said the first half of 2026 faced a "particularly tough compare" partly because of the 2025 Energy rollout — [Q4 FY2025 call summary](https://bullfincher.io/companies/duolingo/earnings-call/fy2025-q4); [Q1 2026 call](https://www.marketbeat.com/earnings/reports/2026-5-4-duolingo-inc-stock/).
- **Mechanics (sources conflict):**
  - most guides describe a 25-unit pool;
  - Duolingo says "the main way to earn back energy is by getting questions right," and streaks of correct answers give bonus energy;
  - guides disagree on whether energy is spent on every question or only on mistakes;
  - refills come from waiting (fully recharged in about a day), gems (750 is cited), or ads;
  - Super and Max subscribers get unlimited Energy;
  - A/B tests make the rules differ between users, and some reports say the web version still used Hearts.
  — [duolingoguides (2026)](https://duolingoguides.com/duolingo-energy-system/); [lingoly](https://lingoly.io/energy-duolingo/); [Fandom wiki](https://duolingo.fandom.com/wiki/Energy)
- **Reception:** a change.org petition, "Hearts, Not Energy" — [change.org](https://www.change.org/p/duolingo-hearts-not-energy). An Android Authority writer quit over it — [Android Authority](https://www.androidauthority.com/quitting-duolingo-energy-system-3599842/). UX analysis of the switch: [UX Collective](https://uxdesign.cc/duolingos-small-ui-switch-that-changes-everything-fae257203633).

**Leagues, quests, gems, Score**
- Leagues are weekly, with 30 random learners per league. There are 10 tiers from Bronze to Diamond (5 at launch, 5 added later). How many learners are promoted varies by tier, and sources conflict on the cutoffs. Top Diamond players qualify for a "Diamond Tournament" — [duoplanet](https://duoplanet.com/duolingo-leagues-the-essential-guide-everything-you-need-to-know/); [Deconstructor of Fun](https://duolingo.deconstructoroffun.com/mechanics/leagues); [We Got This Covered](https://wegotthiscovered.com/fyi/all-duolingo-leagues-explained/).
- **Origin of leaderboards** (former CPO Jorge Mazal):
  - modeled on FarmVille 2-style leagues;
  - +17% overall learning time and three times as many highly engaged learners;
  - the wider growth program shifted focus from new-user retention to current-user retention and grew DAU 4.5x over four years.
  — [Lenny's Newsletter, "How Duolingo reignited user growth"](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- Daily quests can unlock XP boosts. "Duolingo Score" counts only path progress, unlike XP — [duoplanet](https://duoplanet.com/duolingo-leagues-the-essential-guide-everything-you-need-to-know/).

**Practice Hub, Legendary, Super/Max**
- **Practice Hub** (Super):
  - mistakes practice, vocabulary matching, Stories, and all-speaking lessons;
  - "mistakes review" is a personalized lesson of only the items you got wrong, refreshed daily;
  - a "Words" collection was added by Aug 2023.
  — [Duolingo blog, Practice Hub guide (via search snippet)](https://blog.duolingo.com/guide-to-duolingo-practice-hub/); [duolingoguides](https://duolingoguides.com/duolingo-practice-hub/)
- **Legendary** is a harder lesson with no hints, taken after a node is finished. It costs 100 gems for free users and is free for Super; the node turns gold (secondary source) — [duolingoguides](https://duolingoguides.com/duolingo-practice-hub/).
- **Max** includes everything in Super (unlimited hearts, no ads, Practice Hub review) plus two AI-powered features, one of them Explain My Answer — [Duolingo blog, Max (via search snippet)](https://blog.duolingo.com/duolingo-max); [AI Chat Daily](https://www.aichatdaily.com/tools/duolingo).
- **2026 changes (low-authority sources):**
  - Explain My Answer was reportedly made free for everyone on Jan 1, 2026;
  - Video Call is moving into Super;
  - the CEO said "we may actually sunset Max."
  — [AI Chat Daily](https://www.aichatdaily.com/tools/duolingo). Coverage of the Q2 2026 call is headlined "Max plan may be discontinued" — [Longport](https://longportapp.cn/news/295028818).

**Scale and context, 2025–2026**
- Q2 2026: DAUs of 58.7M, up 23% year over year from 47.7M; 12.7M paid subscribers, up 17% — [Duolingo shareholder letter (static file)](https://duolingo.gcs-web.com/static-files/3c8277ee-bc94-4f5d-9b77-0db3e46f88b8); [Longport](https://longportapp.cn/news/295028818).
- Apr 30, 2025: Duolingo launched 148 new courses built with generative AI in under a year, mostly at beginner level (CEFR A1–A2). The launch followed the "AI-first" memo and its backlash — [Duolingo IR](https://investors.duolingo.com/news-releases/news-release-details/duolingo-launches-148-new-language-courses); [TechCrunch](https://techcrunch.com/2025/04/30/duolingo-launches-148-courses-created-with-ai-after-sharing-plans-to-replace-contractors-with-ai).

**What Duolingo publishes about learning outcomes and method**
- **Jiang et al. 2021, Foreign Language Annals:** 225 US learners who used only Duolingo through the beginner content reached Intermediate Low in reading and Novice High in listening. The authors compared this with university students at the end of their 4th semester — [NAU](https://experts.nau.edu/en/publications/evaluating-the-reading-and-listening-outcomes-of-beginning-level-/); [press release](https://www.globenewswire.com/news-release/2022/01/12/2365800/0/en/Leading-Language-Research-Journal-Publishes-Study-Showing-Duolingo-Learning-Outcomes-Are-Comparable-to-University-Classes.html). A critique notes that most participants already had university degrees and questions the "only tool" claim — [CALL-EJ](https://callej.org/index.php/journal/article/download/419/347/1013).
- **"The Duolingo Method"** is five principles drawn from learning research and "more than a decade studying how our self-guided learners learn best." They include being interactive from the start, personalizing with AI and learning science, focusing on the most important content, and keeping motivation through a light-hearted experience — [Duolingo blog, teaching method (via search snippet)](https://blog.duolingo.com/duolingo-teaching-method); [talk by Duolingo learning scientist Audrey Kittredge](https://cogsci.arizona.edu/events/virtual-research-behind-duolingo-course-design-efficacy-audrey-kitteridge-duolingo).

### Inferences
- Duolingo's mechanics fall into four groups, and they transfer very differently:
  - **(a) Learning engine** (adaptive difficulty, spaced review, mistakes review): transfers directly and is backed by evidence.
  - **(b) Habit engine** (streak, daily goal, XP, quests): its evidence is retention metrics tuned at a scale of 50M+ DAU, partly for monetization.
  - **(c) Social and competitive features** (leagues, friend quests): irrelevant for a solo learner.
  - **(d) Monetization gates** (Hearts/Energy, gems): irrelevant, and counterproductive for a personal app.
- Duolingo itself dropped "lose a life per mistake" on learning grounds. Beginners running out mid-lesson is exactly the failure mode to avoid. That supports never punishing errors in this app.
- The linear path of short lessons with review mixed in fits a bounded technical syllabus better than it fits a language. The band and vendor curriculum is finite, so the path can actually be "completed" and then kept fresh by spaced review. That avoids the "endless path" complaint.
- The streak lessons that transfer:
  - make the minimum needed to keep the streak tiny (one lesson);
  - keep it separate from a more ambitious daily goal;
  - protect it with freezes.
- Birdbrain is essentially IRT/Elo-style ability-by-difficulty modeling. A solo app can approximate it with per-item accuracy and response time plus a simple ability estimate per topic. Learner data from one person is too sparse for anything fancier.

### Gaps
- Primary Duolingo pages (blog, research site) could not be fetched; the domains must be allowed for direct verification. Duolingo's ACL paper PDF was also unreachable, so the HLR A/B design details are unverified beyond the abstract and the VentureBeat quote.
- Not verified from primary sources:
  - current (2026) lesson length or exercises per lesson;
  - XP per lesson;
  - which daily-goal options are offered now;
  - checkpoint and section-test mechanics;
  - quest formats;
  - exact Energy rules (pool size, cost per exercise vs per mistake, refill rate), which conflict across sources and are A/B-tested.
- I found no Duolingo-published data on whether Energy changed learning outcomes. The only signal is investor commentary implying it lifted 2025 business metrics.
- Duocon 2025 announcements were not found.

---

## 2. What learning science says about the techniques relevant to this app

### Takeaway
The strongest evidence supports two techniques: retrieval practice with feedback, and spacing (best implemented today with FSRS). Interleaving reliably helps learners tell apart similar visual categories, but blocking beat it for word-like material. Perceptual-learning modules produce large, durable gains in medical image identification: many short classification trials on varied real images, immediate feedback, and adaptive sequencing driven by accuracy and response time. Evidence for number mnemonics is weak and short-lived, so they should support spaced retrieval, not replace it.

### Cited Findings

**Spacing and spaced-repetition algorithms**
- **Cepeda et al. 2008** (>1,350 participants; gaps up to 3.5 months; tests up to 1 year later):
  - retention first rises, then falls, as the gap between sessions grows;
  - the best gap gets longer as the test delay gets longer, but shrinks as a fraction of that delay (about 20–40% for a 1-week test);
  - the press release suggests about 20% for a test 3 weeks away and about 5% for recall years later;
  - a gap that is too short hurts more than one that is too long.
  — [USF Scholar Commons](https://scholarcommons.usf.edu/psy_facpub/1766); [paper PDF](https://www.evullab.org/pdf/CepedaVulRohrerWixtedPashler-PS-2008.pdf); [York U news](https://yfile.news.yorku.ca/?p=9454)
- **srs-benchmark** (9,999 Anki collections, about 350M reviews, same-day reviews excluded; lower log loss is better, higher AUC is better):

  | Model | Log loss | RMSE (bins) | AUC |
  |---|---|---|---|
  | FSRS-6 | 0.3460 | 0.0653 | 0.7034 |
  | FSRS-rs (Rust port) | 0.3443 | 0.0635 | 0.7074 |
  | FSRS-5 | 0.3561 | 0.0742 | 0.7010 |
  | FSRS-4.5 | 0.3625 | 0.0764 | 0.6891 |
  | DASH | 0.3682 | 0.0838 | 0.6311 |
  | ACT-R | 0.4033 | 0.1074 | 0.5225 |
  | HLR | 0.4694 | 0.1275 | 0.6369 |
  | Ebisu v2 | 0.4989 | 0.1627 | 0.6051 |
  | GRU (503 parameters) | 0.3328 | 0.0549 | 0.7324 |
  | LSTM (8,869 parameters) | 0.3332 | 0.0538 | 0.7329 |
  | RWKV-Instant (2.76M parameters) | 0.2773 | 0.0250 | 0.8329 |
  | Always-average baseline | 0.3945 | 0.1034 | 0.4997 |

  — [srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark)
- SM-2 does not appear in the current benchmark tables. Secondary sources say FSRS beats SM-2 on roughly 97–99.6% of collections, with figures varying by source — [Anki forums](https://forums.ankiweb.net/t/fsrs-vs-sm2-in-2-seperate-profiles/52171); [diane.app](https://www.diane.app/en/guides/fsrs-vs-sm2). SuperMemo argues that log loss and AUC are the wrong measures for judging schedulers — [SuperMemo blog](https://supermemo.com/en/blog/supermemo-is-better-than-fsrs-by-far).
- **FSRS libraries:**
  - fsrs-rs: Rust, BSD-3-Clause, includes both optimizer and scheduler;
  - ts-fsrs: TypeScript, MIT;
  - py-fsrs: Python;
  - go-fsrs: Go, MIT;
  - bindings for Swift, Dart, Ruby, Elixir, C, Node, PHP and the browser;
  - srs-simulator, and the curated list awesome-fsrs (CC0).
  — [GitHub: open-spaced-repetition](https://github.com/open-spaced-repetition)

**Retrieval practice and study-technique utility**
- **Rowland 2014** (159 effect sizes from 61 studies): testing beats restudy with g = 0.50. The effect is g = 0.73 with feedback vs 0.39 without, and larger when the final test is at least a day later (0.69 vs 0.41) — [WSU review PDF](https://education.wsu.edu/documents/2018/01/rethinking-use-tests.pdf/); [secondary compilation](https://studycardsai.com/blog/active-recall-statistics).
- **Adesope et al. 2017** (272 effect sizes): g = 0.61 under a fixed-effects model and 0.70 under random effects; classroom studies g = 0.67. Multiple-choice gave stronger testing effects than short answer, whereas Rowland found the opposite — [WSU review PDF](https://education.wsu.edu/documents/2018/01/rethinking-use-tests.pdf/); [Frontiers 2018](https://www.frontiersin.org/articles/10.3389/fpsyg.2018.02412/pdf).
- **Dunlosky et al. 2013** rated study techniques by utility:
  - high: practice testing, distributed practice;
  - moderate: elaborative interrogation, self-explanation, interleaved practice;
  - low: keyword mnemonic, imagery for text, rereading, highlighting, summarization.
  — [APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)

**Interleaving and contrast (category learning)**
- **Brunmair & Richter 2019** meta-analysis (59 studies, 238 effect sizes):
  - overall g = 0.42;
  - interleaving helped more when categories looked alike, when items within a category looked different, and when material was complex;
  - for words, blocking was better (g = −0.39);
  - math g = 0.34; expository texts showed no significant effect.
  — [meta-analysis PDF](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)
- Spacing helped learners learn bird families better than massed study. Showing birds in pairs to highlight the differences between families increased the benefit — [PMC3085105](https://pmc.ncbi.nlm.nih.gov/articles/PMC3085105).
- Interleaving helps for categories that are hard to tell apart, while massing works better for easily distinguished ones (Zulkiply & Burt 2012) — [PDF](https://www.gwern.net/docs/spaced-repetition/2012-zulkiply.pdf).
- The benefit of interleaving comes mainly from comparing across categories, not from temporal spacing (Carvalho & Goldstone) — [Frontiers 2014](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00936/pdf). A dissertation found interleaving beat blocking regardless of how similar the stimuli were — [U Memphis](https://digitalcommons.memphis.edu/etd/3578).
- A 2024 modeling study of bird categorization found that larger blocks gave higher accuracy during training, but smaller blocks gave higher accuracy on the post-test — [arXiv 2407.15020](https://arxiv.org/pdf/2407.15020).

**Perceptual learning and visual identification**
- **Kellman's perceptual learning modules (PLMs)** improved pattern recognition, structure extraction and fluency in math — [Kellman lab report](https://kellmanlab.psych.ucla.edu/files/kellman_massey_2005.pdf). An independent paper raises methodological concerns about how PLM effects are measured — [Unuma & Hasegawa](https://kgwu.repo.nii.ac.jp/record/130/files/kiyou%2024-1%205%20unuma%20ot.pdf).
- **Perceptual and adaptive learning modules (PALMs)** combine perceptual learning with adaptive sequencing:
  - **Histopathology:** a module with 261 images improved medical students' pattern recognition, with good retention — [Krasne et al. 2013](https://kellmanlab.psych.ucla.edu/files/krasne_kellman_hillman_drake_2013.pdf).
  - **Dermatology:** "large improvements" in identifying lesion morphologies, configurations and distributions — [Rimoin et al. 2015](https://kellmanlab.psych.ucla.edu/files/rimoin_altieri_craft_krasne_kellman_2015.pdf).
  - **ECG:** similar gains with 12-month follow-up, per a review — [Kellman & Krasne 2018](https://kellmanlab.psych.ucla.edu/files/kellman_krasne_2018.pdf).
  - **Conflict of interest:** Kellman runs Insight Learning Technology, which holds approved and pending patents on adaptive and perceptual learning technology (disclosed in the PALM literature).
- **ARTS (adaptive response-time-based sequencing):**
  - It uses both accuracy and response time to recompute each item's priority after every response, and defines mastery as both fluent and accurate — [Mettler, Massey & Kellman 2011](https://kellmanlab.psych.ucla.edu/files/mettler_massey_kellman_2011.pdf).
  - In perceptual category learning, adaptive category sequencing was more efficient than random presentation or mini-blocks. The effect lasted at least 1 week and was larger for new, unseen examples. The advantage was bigger for low-variability categories — [Mettler & Kellman 2014](https://kellmanlab.psych.ucla.edu/files/mettler_kellman_2014.pdf); [PMC6124487](https://pmc.ncbi.nlm.nih.gov/articles/PMC6124487).
- **Radiology (Boutis/Pusic):**
  - Trainees worked through a web bank of 234 pediatric ankle radiographs. Immediate feedback highlighted the finding on the image and showed the radiologist's report, and individual learning curves were tracked — [CanadiEM on ImageSim](https://canadiem.org/imagesim-building-competency-for-visually-diagnosed-tests-in-emergency-medicine/).
  - About 120 cases (about 1 hour) of deliberate practice raised accuracy by about 15% on average. This comes from a conference poster, so treat it as preliminary — [Cureus poster](https://www.cureus.com/posters/1305-competency-based-learning-of-pediatric-musculoskeletal-radiographs-using-imagesim).
  - The authors argue that far more practice may be needed than trainees usually get — [UBC research rounds](https://med-fom-ches-sandbox22.sites.olt.ubc.ca/files/2012/05/Research-Rounds-March-2010.pdf).
- **Plants (Kirchoff et al. 2014):** a cognitive-psychology-based homework program (Image Quiz) built to develop expert-level visual recognition of plants. It treats a category as both its typical examples and the variation within it — [CBE—Life Sciences Education](https://www.lifescied.org/doi/10.1187/cbe.13-11-0224); [UNCG news](https://research.uncg.edu/news/keys-to-visual-expertise-kirchoff-develops-novel-learning-method/).
- **Machine teaching (Mac Aodha et al., CVPR 2018):** adding visual explanations that highlight the image regions responsible for the label, on top of label-only feedback, improved learners' test performance on visual categories. Teaching images were chosen to be both representative and easy to explain — [CVF](https://openaccess.thecvf.com/content_cvpr_2018/html/Aodha_Teaching_Categories_to_CVPR_2018_paper.html); [Caltech](https://authors.library.caltech.edu/records/3a3cz-2t870).

**Feedback content and timing**
- **Van der Kleij et al. 2015** (40 studies, 70 effect sizes):
  - elaborated feedback that explains: 0.49;
  - showing the correct answer: 0.32;
  - right/wrong only: 0.05;
  - elaborated feedback did especially well for higher-order outcomes;
  - immediate feedback tended to work better for lower-order learning and delayed feedback for higher-order, but this interaction was not significant.
  — [ACU](https://acuresearchbank.acu.edu.au/item/86y84/effects-of-feedback-in-a-computer-based-learning-environment-on-students-learning-outcomes-a-meta-analysis); [Hechinger Report](https://hechingerreport.org/three-lessons-from-data-on-the-best-ways-to-give-feedback-to-students/)
- Multiple-choice tests can plant wrong answers (lures) in memory (Roediger & Marsh 2005). Feedback increases the benefit of multiple-choice testing and reduces that harm (Butler & Roediger 2008) — [paper PDF](https://mrbartonmaths.com/resourcesnew/8.%20Research/Formative%20Assessment/Feedback%20enhances%20the%20positive%20effects%20and%20reduces.pdf); [Learning Scientists](https://www.learningscientists.org/blog/2018/8/2).
- **Feedback timing matters for perceptual categories:**
  - Delayed feedback hurts "information-integration" learning, which is implicit and similarity-based, but not rule-based learning (Maddox, Ashby & Bohil 2003) — [Ashby lab](https://labs.psych.ucsb.edu/ashby/gregory/node/249).
  - Delays of 2.5 s or more impair information-integration learning, while rule-based learning tolerates delays of 10 s — [Frontiers 2014](https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00643/text).
  - Fully informative feedback reduces the delay effect — [Dunn, Newell & Kalish 2012](https://cogsci.syr.edu/wp-content/uploads/2021/03/DunnNK2012.pdf).

**Mastery learning and worked examples**
- **Kulik, Kulik & Bangert-Drowns 1990** (108 controlled evaluations): mastery programs had positive effects on exam performance. The average of about 0.52 SD comes from a secondary summary and is unverified — [academia.edu summary](https://www.academia.edu/81783373/Effectiveness_of_Mastery_Learning_Programs_A_Meta_Analysis); [Slavin 1987](https://www.gwern.net/doc/psychology/1987-slavin.pdf).
- **Expertise reversal:** worked examples help novices but become redundant or harmful for experienced learners. "Fading" moves learners from full examples to solving on their own, and works best when tailored to the individual — [Wikipedia](https://en.wikipedia.org/wiki/Expertise_reversal_effect); [Kalyuga PDF](https://faculty.engineering.asu.edu/mre/wp-content/uploads/sites/31/2020/02/Exp_Rev_LI06.pdf).

**Numeric facts and mnemonics**
- Dunlosky et al. rated the keyword mnemonic low utility, while elaborative interrogation and self-explanation were rated moderate — [APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html).
- **Number mnemonics:**
  - small, older studies show gains on immediate and 2-day tests;
  - in college students, a three-part number mnemonic improved recall of invention dates immediately but not after 1 week;
  - no controlled trial isolates the Major System.
  — [Wikipedia: peg system](https://en.wikipedia.org/wiki/Mnemonic_peg_system); [Masaryk thesis](https://is.muni.cz/th/nxted/?lang=en). The study details come from a secondary search summary; I did not check the originals.

### Inferences
- The domain contains two different learning problems, which call for two engines:
  - **(A) Paired-associate facts**, such as band number ↔ frequency range, duplex mode, or carrier. Use retrieval with feedback, FSRS spacing and elaboration. Introduce bands in blocks by spectrum family (600/700/850 low-band, PCS/AWS mid-band, 2.5/3.5/3.7 GHz, mmWave) before mixing them. Brunmair's result for words suggests that mixing unrelated facts early may not help.
  - **(B) Perceptual categories**, such as vendor radios and antennas, site types (macro, monopole, stealth, rooftop, small cell, DAS) and cell types. Use a PALM-style design:
    - many short image-classification trials on varied real photos;
    - interleave the confusable classes;
    - give feedback within about 1–2 s that highlights the distinguishing feature;
    - set ARTS-like mastery criteria using accuracy and response time;
    - test transfer on photos the learner has never seen.
- Use FSRS (ts-fsrs or fsrs-rs; both permissively licensed) for fact items. HLR matters historically but performs much worse, and SM-2 cannot predict recall probability.
- Record response time on every trial. It costs nothing, and both ARTS and the radiology learning-curve work use it as a fluency and mastery signal.
- Treat mnemonics as optional hooks shown at introduction. Lasting retention has to come from spaced retrieval, because mnemonic gains for numbers faded within a week in the available studies.
- Elaborative "why" prompts give band facts meaning, and Dunlosky rates this technique moderate. Example questions: why is this band in that block, why does this carrier hold it, what is the band used for?

### Gaps
- Several meta-analytic figures (Rowland, Adesope, Kulik) were checked only through secondary summaries.
- I found no studies of training visual identification of telecom equipment or cell sites; the recommendations extrapolate from medical, bird and plant domains.
- Not researched: aircraft-recognition training (for example the WWII flash-card and tachistoscope programs), the hypercorrection effect, and confidence-based learning.
- FSRS's typical "desired retention" setting (commonly cited as 0.9) was not verified in this session.
- I found no studies specifically on chunking or elaboration for memorizing frequency ranges.

---

## 3. Exercise types that fit this domain, how to sequence them, and what good feedback looks like

### Takeaway
The best-supported formats here are:
- image classification multiple-choice with near-miss (contrastive) distractors and explanatory feedback;
- "tap the feature that tells you" hotspots, which mirror visual-explanation teaching and radiology image highlighting;
- recall-style fill-ins and matching for band facts;
- scenario puzzles for integrating facts and visual evidence.

Sequence each unit from an annotated example, to recognition, to discrimination between confusable items, to recall, to transfer (new photos and scenarios), to spaced mixed review. Feedback should be immediate, explanatory and visual, and missed items should come back in the same session.

### Cited Findings
- Multiple-choice produces strong testing effects (g ≈ 0.6–0.7 overall; Adesope found MC stronger than short answer). However, its wrong options can be learned as facts unless feedback follows — [WSU review](https://education.wsu.edu/documents/2018/01/rethinking-use-tests.pdf/); [Butler & Roediger PDF](https://mrbartonmaths.com/resourcesnew/8.%20Research/Formative%20Assessment/Feedback%20enhances%20the%20positive%20effects%20and%20reduces.pdf).
- **Evidence for contrastive presentation:**
  - pairing birds to highlight differences between families improved learning — [PMC3085105](https://pmc.ncbi.nlm.nih.gov/articles/PMC3085105);
  - interleaving works through comparison across categories — [Frontiers 2014](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00936/pdf);
  - interleaving helps most for similar categories — [Brunmair & Richter](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf).
- **Evidence for highlight-the-feature feedback (hotspots):**
  - explanations that highlight the discriminative image regions improved learning — [Mac Aodha et al.](https://openaccess.thecvf.com/content_cvpr_2018/html/Aodha_Teaching_Categories_to_CVPR_2018_paper.html);
  - radiograph trainers highlight the finding in their immediate feedback — [CanadiEM](https://canadiem.org/imagesim-building-competency-for-visually-diagnosed-tests-in-emergency-medicine/).
- **GeoGuessr training tools** are the closest analog for identifying infrastructure from photos. Learnable Meta shows a note after each guess explaining the round and the clues the player missed. Its practice maps work best in "No Move" mode, where players practice spotting poles, road lines and bollards — [Learnable Meta about](https://learnablemeta.com/about); [docs](https://learnablemeta.com/docs/getting-started).
- Explanatory feedback beats right/wrong-only feedback (0.49 vs 0.05), especially for higher-order tasks such as scenarios. Testing with feedback roughly doubles the testing effect (0.73 vs 0.39) — [Van der Kleij et al.](https://acuresearchbank.acu.edu.au/item/86y84/effects-of-feedback-in-a-computer-based-learning-environment-on-students-learning-outcomes-a-meta-analysis); [Rowland via WSU](https://education.wsu.edu/documents/2018/01/rethinking-use-tests.pdf/).
- Feedback delays of 2.5 s or more impair implicit perceptual category learning — [Frontiers 2014](https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00643/text).
- **Sequencing evidence:**
  - larger blocks help during training, while smaller blocks and interleaving help the post-test — [arXiv 2407.15020](https://arxiv.org/pdf/2407.15020);
  - adaptive sequencing beats random order and mini-blocks, and the gains reach new examples — [Mettler & Kellman 2014](https://kellmanlab.psych.ucla.edu/files/mettler_kellman_2014.pdf);
  - include both typical examples and the variation within each category — [Kirchoff et al.](https://www.lifescied.org/doi/10.1187/cbe.13-11-0224);
  - fade worked examples as expertise grows — [Kalyuga](https://faculty.engineering.asu.edu/mre/wp-content/uploads/sites/31/2020/02/Exp_Rev_LI06.pdf).
- Response time is a legitimate mastery and fluency signal — [Mettler, Massey & Kellman 2011](https://kellmanlab.psych.ucla.edu/files/mettler_massey_kellman_2011.pdf). About 120 radiograph cases in about an hour gave measurable gains — [Cureus poster](https://www.cureus.com/posters/1305-competency-based-learning-of-pediatric-musculoskeletal-radiographs-using-imagesim).
- **Retrying missed items:**
  - Duolingo's mistakes review re-practices only the items the learner got wrong — [Duolingo Practice Hub (via search snippet)](https://blog.duolingo.com/guide-to-duolingo-practice-hub/);
  - ARTS recomputes item priority after every response — [Mettler et al. 2011](https://kellmanlab.psych.ucla.edu/files/mettler_massey_kellman_2011.pdf);
  - HamStudy's "Explain" button shows the reasoning, formulas and tips after a miss — [App Store](https://apps.apple.com/app/id1371288324).

### Inferences
**Exercise formats ranked for this domain** (by evidence and fit):

| Format | Best for | Evidence strength | Design notes |
|---|---|---|---|
| Image multiple-choice ("Which vendor / site type / cell type?") | Perceptual categories | Strong (testing effect + perceptual learning) | Start with 2 options as a contrastive pair, grow to 4. Distractors should be the classes most often confused with the answer, not random ones. Always follow with explanatory feedback, because lures are a risk. |
| Hotspot ("Tap what tells you this is a [vendor] radio") | Locating the cues that tell classes apart | Moderate–strong (visual explanation, radiology highlighting) | Use after basic recognition. Accept a tolerance region. On a miss, outline the correct region and add a one-line rationale. Photos need region annotations. |
| Matching pairs (band↔frequency, band↔carrier) | First exposure to fact sets | Weak–moderate (recognition-level retrieval) | Good warm-up. Keep each set within one spectrum family. Do not use matching as the only test, because recall is needed later. |
| Fill-in or type-the-number ("B__ = 600 MHz", "n77 spans __") | Recall of facts | Strong (retrieval practice) | Accept numeric tolerance for frequencies. Schedule these items with FSRS. |
| Ordering (low→high frequency) | Building a mental "spectrum ruler" | Weak (no direct studies) | Use as a consolidation exercise at the end of a unit, and show the result on a spectrum bar. |
| Slider estimation (place a band on a frequency axis) | Rough magnitude sense | Weak (no direct studies) | Use generous tolerance and show the true position and error afterward. Good as a low-stakes variant. |
| True/false | Quick checks | Weak; risk of learning false statements | Use sparingly, always with correction. |
| Scenario puzzles (combine band evidence and equipment photo, then infer carrier or site type) | Transfer and integration | Moderate (explanatory feedback matters most for higher-order tasks) | Use after component mastery. Feedback should walk through each clue and how it narrows the answer. |
| Timed review rounds | Fluency, after accuracy is mastered | Moderate (response time as a mastery signal) | Measure response time rather than imposing a countdown on novices. Offer a timed mode as optional "speed drills" once accuracy is mastered. |

**Feedback pattern, within about 1–2 s of the answer:**
1. A clear correct/incorrect state.
2. The correct answer.
3. A one-line "why," with the deciding feature highlighted on the photo.
4. On an error, show the chosen class and the correct class side by side so the difference is visible.
5. Re-queue the missed item a few trials later and again at the end of the session, then hand it to FSRS.
6. Keep any celebration animation short, so it does not delay the corrective information on errors.

**Unit sequence template** (for example, a unit on "Vendor A vs Vendor B radios"):
1. An annotated example card, i.e. a worked example.
2. 2-option contrastive multiple-choice.
3. A hotspot on the distinguishing feature.
4. Mixed 3–4-option multiple-choice that also brings back earlier classes.
5. A transfer test on new photos.
6. A scenario that combines this unit with band knowledge.
7. A Legendary-style no-hint mastery check.
8. FSRS review of the facts, plus periodic mixed perceptual drills.

**Mastery gate:** require accuracy (for example 90% or more on recent trials) and fluency (response time under a threshold, per ARTS) before the path unlocks the next unit. Spaced review continues after the gate.

### Gaps
- I found no studies comparing matching, ordering, slider or true/false formats with each other for learning outcomes.
- I found no study comparing hotspot and multiple-choice efficacy outside medicine.
- I found no evidence on the best number of options for image multiple-choice in perceptual learning.
- The thresholds in the inferences above (90% accuracy, 1–2 s feedback, re-queue spacing) are design heuristics, not values established in the literature, apart from the ≥2.5 s delay finding.

---

## 4. Comparable apps and open-source building blocks, and the gaps they leave

### Takeaway
I found no app that combines US cellular band facts and cell-site/vendor photo identification with spaced repetition and gamification. The closest analogs are:
- ham-radio exam apps: adaptive question pools with explanations;
- image-identification trainers: BirdID, ImageSim, Kirchoff's Image Quiz;
- the GeoGuessr learning ecosystem: Plonkit and Learnable Meta teach infrastructure clues, with an explanation after each guess;
- CellMapper: reference data, not teaching.

The best building blocks are the permissively licensed FSRS libraries. LibreLingo is AGPL and only partly active.

### Cited Findings
- **HamStudy (HamStudy.org, iOS):**
  - "intelligent study algorithms" that track progress and adjust pacing;
  - can limit study to chapters of a license manual;
  - an "Explain" button with reasoning, formulas and tips;
  - practice exams;
  - free account sync and support for multiple users;
  - updated free when question pools are revised every four years.
  — [App Store](https://apps.apple.com/app/id1371288324)
- **KC3ICT Ham Study (F-Droid)** is a separate free Android app that requests no permissions and offers flashcards plus a pool of wrong answers to review — [F-Droid](https://f-droid.org/fr/packages/com.neyhard.hamstudy/).
- **BirdID (Nord University, since 2006):**
  - web-based identification of birds by appearance and sound;
  - an interactive e-book plus quizzes over large image and sound banks;
  - training sets in exam mode;
  - free, multilingual, with an online exam.
  — [birdid.no](https://birdid.no); [Nord study plan](https://www.nord.no/en/studies/study-plans/birdid-national-birdidnat-shorter-programme-autumn-2026)
- **Kirchoff's Image Quiz and Image Sort** are plant-ID visual learning tools; Kirchoff founded Metis LLC in 2013 to expand them — [CBE-LSE](https://www.lifescied.org/doi/10.1187/cbe.13-11-0224); [NCSU Image Sort](https://herbarium.ncsu.edu/ImageSort/intro.htm).
- **ImageSim** is a commercial case-based radiograph trainer derived from the Boutis/Pusic research — [CanadiEM](https://canadiem.org/imagesim-building-competency-for-visually-diagnosed-tests-in-emergency-medicine/).
- **GeoGuessr ecosystem:**
  - community sites such as Plonkit teach visual clues, and GeoGuessr published its own book in 2026 — [Wikipedia](https://en.wikipedia.org/wiki/GeoGuessr);
  - Learnable Meta is a userscript plus tagged practice maps (many built from Plonkit content), with an explanation note after each guess — [about](https://learnablemeta.com/about); [maps](https://learnablemeta.com/maps).
- **CellMapper:**
  - crowdsourced coverage maps showing individual tower sectors and bands;
  - tower clustering, plus move/delete/restore editing;
  - an ARFCN/UARFCN/EARFCN frequency calculator;
  - 5G gNB ID handling;
  - Android version 5.6.5 listed as of Oct 30, 2025.
  — [APKMirror 5.6.4](https://www.apkmirror.com/apk/cellmapper-net/cellmapper/cellmapper-5-6-4-release/cellmapper-5-6-4-android-apk-download/); [APKMirror 5.0.9](https://www.apkmirror.com/?p=178865)
- **Enthusiast visual-ID content exists but is scattered:**
  - Hackaday's 2016 "field guide to the North American communications tower" explains, for example, collocation of several carriers on one tower — [Hackaday](https://hackaday.com/2016/04/05/a-field-guide-to-the-north-american-communications-tower/);
  - a 2019 Reddit "T-Mobile site equipment guide" lists vendor clues: Nokia Flexi/AirScale radio heads, Ericsson RRUS 11/12 radios, Ericsson AIR antennas with integrated radios, and an easily recognized CommScope 700 MHz panel. It warns that equipment varies by market, and its contents are now dated — [Reddit mirror](https://redlib.ssps.io/r/tmobile/comments/b005ko/tmobile_site_equipment_guide);
  - vendors can also be identified from LTE Layer-3 signaling parameters, a non-visual method — [pedroc.co.uk](https://pedroc.co.uk/content/lte-vendor-recognition-layer-3-signalling).
- **LibreLingo** is a "community-owned language-learning platform" under AGPL-3.0. Its main repository is kantord/LibreLingo, and it has a YAML course loader — [GitHub fork](https://github.com/dhelmr/LibreLingo); [ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fkantord%2FLibreLingo).
  - AlternativeTo lists it as discontinued — [AlternativeTo](https://alternativeto.net/software/librelingo).
  - A 2025 Chaos Communication Congress project aimed to "bring LibreLingo back from the dead," noting open difficulties such as audio — [CCC hub](https://events.ccc.de/congress/2025/hub/project/detail/so/librelingo).
  - A user comment says content was Spanish-only — [lemm.ee](https://next.lemm.ee/post/9320916).
- **FSRS ecosystem:** fsrs-rs (BSD-3), ts-fsrs (MIT), go-fsrs (MIT), py-fsrs, the srs-benchmark and srs-simulator, plus Anki, Obsidian and RemNote plugins — [GitHub org](https://github.com/open-spaced-repetition). Anki users run FSRS and SM-2 side by side — [Anki forums](https://forums.ankiweb.net/t/fsrs-vs-sm2-in-2-seperate-profiles/52171).

### Inferences
**Gaps this app can fill:**
1. A curated, annotated photo bank of US cell-site types and vendor equipment, with "why" explanations (scattered today across Reddit and Hackaday).
2. Spaced retrieval of band facts, tied to carriers and to visual evidence.
3. Scenario reasoning that combines RF facts with what is visible on site, which no ham, bird or GeoGuessr tool does.
4. A personal, offline desktop experience with no ads or paywalls.

**Worth borrowing:**
- HamStudy's "Explain" button and readiness/practice-exam concept;
- Learnable Meta's explanation after each guess and its "No Move" practice of spotting specific details;
- BirdID's exam mode on held-out media;
- ImageSim's case-volume framing and learning curves (show the learner their accuracy curve);
- CellMapper as a reference for real-world band and site examples, subject to its terms and the photographers' copyright.

**Licensing:** LibreLingo's AGPL means any code reused in a distributed app brings AGPL obligations, so it is better as a design reference than as a code dependency. ts-fsrs (MIT) and fsrs-rs (BSD-3) are safe to embed.

### Gaps
- I found no gamified consumer training app for US cellular bands or cell-site identification. This is absence of evidence, based on a few searches.
- Not researched: consumer bird and plant quiz apps (Merlin, Larkwire, iNaturalist/Seek), aircraft-recognition apps, and telecom training courses (for example vendor RF courses).
- Whether CellMapper hosts user tower photos, and its terms on reusing data, were not confirmed.
- I did not check LibreLingo's current commit activity.

---

## 5. Intellectual-property boundaries for a Duolingo-like app

### Takeaway
US copyright does not protect game ideas, titles, or methods of play. Streaks, XP, paths, leagues and lives are therefore free to reuse. Expression is protected, though. *Tetris v. Xio* shows that a near-identical look-and-feel clone can infringe both copyright and trade dress even when the mechanics themselves are free. Duolingo's name and the Duo owl are core registered and brand assets. The Duolingo patent filings I found concern assessment and test personalization, not gamification, and their grant status is unverified.

For a purely personal, never-distributed app, the practical risk is negligible. Sharing it raises the risk mainly through visual and branding similarity. So use an original name, theme, mascot (or none), palette, art, sounds and layout.

### Cited Findings
- **Copyright Office games factsheet (FL-108):** copyright does not protect the idea for a game, its name or title, or "the method or methods for playing it." Registration covers text and artwork, but cannot turn a method of play into protected subject matter — [archived FL-108](https://webharvest.gov/peth04/20041015011900/http://copyright.gov/fls/fl108.pdf).
- ***Tetris Holding v. Xio Interactive*, 863 F. Supp. 2d 394 (D.N.J. 2012):**
  - the court granted Tetris summary judgment on both copyright and trade dress;
  - it separated unprotectable rules and functionality from protectable expression, and found Xio copied the expression;
  - Xio's functionality defense to trade dress failed because the colors and style were "arbitrary flourishes";
  - fair use was rejected;
  - a permanent injunction followed in 2013.
  — [Loeb & Loeb](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc); [Proskauer](https://newmedialaw.proskauer.com/2012/06/19/videogame-app-developer-breaks-the-rules-on-copyright-infringement/); [IPWatchdog](https://ipwatchdog.com/2013/02/12/tetris-gets-permanent-injunction-against-xio/)
- ***Spry Fox v. Lolapps/6waves* (Triple Town vs Yeti Town, 2012):** the court said the mechanics have little protection, but the clone's style and expression were too similar to Triple Town. It denied the motion to dismiss, and the case then settled — [Wikipedia](https://en.wikipedia.org/wiki/Spry_Fox,_LLC_v._Lolapps,_Inc.); [PocketGamer](https://www.pocketgamer.com/news/6waves-settles-with-spry-fox-in-yeti-town-triple-town-clone-debate/).
- **Duolingo trademarks:** Justia records show several DUOLINGO word-mark filings and registrations, including a registration issued in 2014 whose Section 8 & 15 declarations were accepted in 2019, a registration dated Feb 16, 2021, and filings covering clothing and stickers. Sub-brands such as "DUOLINGO ABC" are also filed — [Justia 86171435](https://trademark.justia.com/861/71/duolingo-86171435.html); [Justia 88718536](https://trademarks.justia.com/887/18/duolingo-88718536.html); [Justia "DUOLINGO ABC"](https://trademark.justia.com/979/17/duolingo-97917228.html).
- Duo the owl is central to Duolingo's marketing, as shown by the Feb 2025 "death of Duo" publicity stunt — [KRON4](https://www.kron4.com/news/duolingo-owl-dead-killed-by-cybertruck-company-says/amp/).
- **Duolingo patents:** GlobalData lists publications including US20230087817A1, "Systems and methods for educational and psychological modeling and assessment," and WO2017070496A1, "Automatic test personalization." CB Insights says Duolingo has filed 4 patents. Grant status was not verified — [GlobalData](https://www.globaldata.com/company-profile/duolingo-inc/patents/); [CB Insights](https://cbinsights.com/company/duolingo).
- **Adjacent patents:** Kellman's company (Insight Learning Technology) holds approved and pending patents on adaptive and perceptual learning technology — [Kellman lab PALM papers, conflict-of-interest disclosures](https://kellmanlab.psych.ucla.edu/files/rimoin_altieri_craft_krasne_kellman_2015.pdf).

### Inferences
**Reuse freely, as unprotectable ideas and methods:**
- a linear path of units and lessons;
- XP, daily goals, streaks and freezes;
- mastery challenges at the end of a unit;
- mistakes review and spaced review;
- quests and achievements;
- combo bonuses.

**Avoid copying expression and brand.** Even mechanics-only clones get into trouble when the presentation is copied (*Tetris*, *Spry Fox*). Concretely:
- no owl or other bird mascot, and no Duolingo-like character cast;
- no name containing "Duo" or "-lingo";
- do not imitate Duolingo's signature green, its chunky cartoon art style, sound effects, celebration animations, or the exact winding path of round lesson nodes;
- do not rip any Duolingo assets (sprites, sounds, fonts), even privately.

**Give it a distinct RF/telecom theme** that is clearly original and fits the subject:
- progress as a coverage map, or towers "lighting up";
- mastery tiers as signal bars;
- a streak framed as "uptime";
- review as "drive testing";
- a mastery challenge framed as "site certification."

This is safer legally and arguably more motivating for this learner.

**Risk by scenario:**
- **Personal, unshared app:** trademark and trade dress claims turn on confusion in the market, so a never-distributed app has essentially no practical exposure.
- **Sharing later (for example on GitHub):** exposure appears if the name, art or UI echoes Duolingo. The defense is an original theme from the start, so that nothing needs rebranding.
- **Third-party photos:** photos of cell sites taken from CellMapper, Reddit or forums are owned by the photographers. They are tolerable for private study, but sharing the app requires permission, CC-licensed images, or the learner's own photos.

**Patents:** core Duolingo mechanics do not appear to be patented based on what I found. If the app ever implements a close copy of ARTS-style response-time sequencing for distribution, check Insight Learning Technology's patents. This is a low concern for personal use, but it has not been legally analyzed.

### Gaps
- Not verified:
  - registration numbers for Duolingo's owl design mark;
  - any trade dress or sound-mark registrations;
  - which Duolingo patent applications, if any, were granted;
  - the claims of Kellman/Insight patents.
- A USPTO patent titled "Method and system for object identification" (US 11,335,087) appeared in a search for Kirchoff's plant-ID work. I did not verify its inventor, assignee or claims, and it may be relevant to visual-ID quiz tools — [USPTO PDF](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11335087).
- I did not research how US patent and copyright law treats purely private, non-commercial use: whether a personal-use defense exists, and how narrow the experimental-use exception is. Get legal advice before any commercial distribution.

---

## 6. Which motivational mechanics a solo learner should get, and which dark patterns to avoid

### Takeaway
**Build:**
- a forgiving streak: a tiny minimum to keep it, freezes or repair, and kept separate from the daily goal;
- a small daily goal;
- XP or progress tied to real mastery;
- a visible progress map;
- achievements based on mastery;
- competition with one's own past results.

**Avoid:**
- energy or hearts limits;
- guilt-tripping or loss-framed notifications;
- leaderboards against fake opponents;
- random-reward loot;
- anything that punishes mistakes.

Gamification has small positive effects on average, but it can erode intrinsic motivation. Broken streaks lead people to abandon the activity unless the streak can be repaired. Duolingo itself dropped Hearts because they did not support learning.

### Cited Findings
- **Sailer & Homner 2020** meta-analysis:
  - small positive effects of gamification on cognitive (g = .49), motivational (g = .36) and behavioral (g = .25) learning outcomes;
  - the cognitive effect held up in rigorous studies, while the motivational and behavioral effects were less stable;
  - game fiction and social interaction moderated the behavioral effects.
  — [Springer](https://link.springer.com/article/10.1007/s10648-019-09498-w)
- **Hanus & Fox 2015** (80 students over a semester): badges, coins and a leaderboard went with lower intrinsic motivation, satisfaction and final exam scores than in a non-gamified course. Lower intrinsic motivation mediated the effect on exam scores. Other studies find no harm, so the overall evidence is mixed — [review table](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-017-0042-5/tables/13); [PMC8916940](https://pmc.ncbi.nlm.nih.gov/articles/PMC8916940).
- **Silverman & Barasch 2023**, Journal of Consumer Research (seven studies):
  - a broken logged streak lowers the chance of repeating the behavior, regardless of actual past behavior, because keeping the streak becomes a goal in itself;
  - the drop is larger when people blame themselves and smaller when the streak can be "repaired";
  - in a language-learning app, people switched to a new language after a streak broke instead of rebuilding;
  - streak-pressure messaging "typically doesn't work."
  — [CU Boulder news](https://www.colorado.edu/business/news/2023/04/20/research-streaks-marketing-tech-barasch); [UDSpace](https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb)
- Duolingo's own streak changes: separating the streak from the daily goal and making it one lesson per day raised streak participation. The freeze lets a streak pause — [Duolingo blog (via search snippet)](https://blog.duolingo.com/improving-the-streak); [Lenny's](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks); [vacation post (via search snippet)](https://blog.duolingo.com/how-to-keep-your-streak-on-vacation).
- Duolingo replaced Hearts because they "w[ere] not the most effective way to support learning," and beginners were running out mid-lesson. Energy is still criticized as a paywall-like limit — [Duolingo blog (via search snippet)](https://blog.duolingo.com/duolingo-energy/); [change.org](https://www.change.org/p/duolingo-hearts-not-energy); [Android Authority](https://www.androidauthority.com/quitting-duolingo-energy-system-3599842/).
- **Castro & Valença, IHC 2025** (qualitative interface analysis): Duolingo uses both "bright" patterns (clear interfaces) and deceptive ones, including excessive notifications, emotionally charged visuals, "friendly pressure" such as fear of breaking a streak, and monetization tactics — [SBC](https://sol.sbc.org.br/index.php/ihc/article/view/37677); [deceptive.design](https://deceptive.design/articles/teaching-or-manipulating-on-the-adoption-of-bright-and-deceptive-patterns-by-duolingo).
- Tiered achievement badges produced about +1% DAU and +1% D14 retention at Duolingo (secondary source) — [Econsultancy](https://econsultancy.com/six-a-b-tests-used-by-duolingo-to-tap-into-habit-forming-behaviour/). Leaderboards produced large effects, but they depend on social comparison — [Lenny's / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth).

### Inferences
**Worth building (solo, desktop):**
1. **Streak with dignity.**
   - One lesson or one review session keeps it.
   - Automatic freezes (for example, earn one per 7 days, hold up to 2).
   - A "repair" option within 48 h, by doing a double session.
   - Show "days studied this month" next to the streak, so one miss does not erase the visible history. This draws on the repair and self-attribution findings.
2. **Daily goal set by the learner** (for example 5, 10 or 20 minutes, or a number of reviews), kept separate from the streak. Finish the day's due reviews before new material.
3. **XP tied to mastery,** not volume: weight first-correct recall and new-image transfer above repeats, and give less XP for grinding easy items. Keep a separate "mastery %" for each band family and vendor, in the spirit of Duolingo's Score.
4. **Progress map:** an RF-themed path of units ("towers lit"), plus a "spectrum chart" heatmap showing which bands are mastered and which are fading by FSRS retrievability. The map doubles as a review planner.
5. **Achievements based on mastery and skill,** for example "identified 50 new site photos," "all low-band bands at 90% retention," or "10 scenario solves with no hints." Avoid achievements that just reward time spent.
6. **Competition with your past self:** personal bests on speed drills and weekly accuracy trends. Sailer & Homner note that social interaction moderates behavioral effects, which a solo app cannot offer, so these act as a partial substitute.
7. **A Legendary-like optional "certification" per unit,** with no hints and held-out photos. Make it free and repeatable.

**Dark patterns to avoid:**
- hearts or energy limits on practice (they directly cut retrieval practice, which is the most effective activity);
- guilt-laden or loss-framed notifications ("You'll lose your streak!"), crying-mascot imagery, or streak-loss shaming;
- fake leaderboards or bot opponents;
- random-reward loot boxes or gem economies;
- countdown timers on novices;
- streak resets with no repair path;
- any purchase-like friction.

At most one gentle, opt-in desktop reminder at a time the learner chooses.

### Gaps
- I found no studies specifically on motivation for a single adult hobby learner using a desktop learning app; most gamification evidence comes from classrooms or apps with millions of users.
- I found no controlled study measuring anxiety or guilt from streak notifications; Castro & Valença is a qualitative interface analysis.
- The heuristics above (freeze rate, repair window, XP weights) are design proposals that the literature has not tested.
