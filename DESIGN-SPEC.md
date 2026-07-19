# ASTRONAUTS / 宇航员 Frozen Design Specification

Status: **FROZEN**  
Approved: **2026-07-19**  
Change control: explicit user approval is required before changing this file or
deviating from it.

## 1. Design direction

The site uses a **Future Lab Editorial** direction:

- 60% premium editorial minimalism;
- 25% cosmic exploration atmosphere;
- 15% restrained technology interaction.

The Hero should feel like a technology-art exhibition. The content should read
like a future research archive. Real questions, experiments, people, and
evidence must create credibility.

Core rule:

> The Hero makes visitors stop, real experiments make them believe, and member
> stories make them remember.

Language hierarchy:

- visible content is approximately 70% Chinese and 30% English;
- Chinese carries the primary narrative, main headings, questions, findings,
  member information, and calls to action;
- English remains as the ASTRONAUTS brand translation, metadata labels, and
  short secondary captions;
- do not repeat every Chinese paragraph with an equally prominent English
  paragraph.

## 2. Target audience and first-visit outcome

Primary audiences:

1. competition judges;
2. teachers and schools;
3. collaborators and potential supporters;
4. people interested in technology and future studies.

Within five seconds, a visitor should understand that ASTRONAUTS / 宇航员 is a
student-led team exploring questions at the intersection of AI, technology,
humanity, and possible futures.

Within thirty seconds, the visitor should encounter at least one real
experiment, one current question, and identifiable team participation.

## 3. Frozen page hierarchy

The homepage order is fixed:

1. Hero
2. Current Question
3. Featured Experiment
4. Exploration
5. Our Story
6. Lab Notes
7. Members
8. Future Projects
9. Contact
10. Footer

Sections may be hidden until verified content exists, but they must not be
filled with fabricated people, achievements, outcomes, partners, or statistics.

## 4. Navigation

- Keep the existing sticky PillNav treatment.
- The 宇航员 brand is the Home control; do not show a separate Home item.
- Desktop navigation contains: 故事, 探索, 成员, 项目, 联系.
- Keep no more than one navigation CTA.
- At medium widths, simplify or hide the secondary CTA before compressing the
  navigation labels.
- Mobile uses the existing accessible collapsible menu.
- Active-section transitions remain restrained and respect reduced motion.

## 5. Section specifications

### 5.1 Hero

- Minimum height: `100svh`.
- Galaxy is allowed only in this section.
- Use GradientText for the verified Chinese name `宇航员`; show `ASTRONAUTS` as
  a restrained English brand caption.
- Chinese is the primary, high-contrast content language. English supporting
  text is quieter and shorter.
- Show one primary action and one visually quieter secondary action.
- Include a concise identity statement explaining who the team is, what it
  explores, and that it turns questions into experiments.
- Keep a small current-exploration indicator near the lower edge.

### 5.2 Current Question

Use a restrained horizontal glass information strip containing:

- question number;
- one specific current question;
- current status;
- last-updated date;
- link to the relevant experiment or lab note.

This section uses no large decorative animation.

### 5.3 Featured Experiment

Use an editorial, introduction-first layout. Per the user's explicit
2026-07-19 revision, do not show one large product screenshot; keep real media
inside the smaller OrbitImages process gallery below the project summary.

Required fields:

- project name;
- exploration question;
- status;
- timeline or date;
- participating members;
- real prototype, screenshot, process image, or short demo;
- what the team learned;
- next step.

StarBorder may be used once for the experiment entry or participation action.

### 5.4 Exploration

- MagicBento is exclusive to this section.
- Preserve the four directions: AI Future, Digital World, Human & Technology,
  and Unknown Possibilities.
- Each card contains one concrete question and an optional link to notes.
- Use one dominant card and supporting cards; avoid a uniform card wall.
- Only the actively hovered card receives a strong glow.
- Tilt and magnetism remain disabled.

### 5.5 Our Story

Use a four-stage editorial timeline:

1. Curiosity
2. Gathering
3. Experimenting
4. Becoming

Pair short bilingual writing with verified sketches, photos, or process
artifacts. Do not use glowing Bento cards here.

### 5.6 Lab Notes

Use a dated research-log list or timeline. Each entry contains:

- note number;
- date;
- question;
- method;
- one process image when available;
- one finding;
- status.

Per the user's explicit 2026-07-19 revision, present the Knowledge Network as
an introduction-first second product and do not show standalone large
screenshots. Keep question, method, finding, date, and status in a restrained
ScrollStack, with each verified image used only as a supporting card visual.

Small and honest experiments are preferred to empty claims of innovation.

### 5.7 Members

Use future-archive cards based only on verified information.

Collapsed card:

- portrait or consistent real visual treatment;
- name;
- role;
- exploration field;
- current project participation.

Expanded record:

- personal story;
- `Why I Explore` statement;
- skills;
- vision;
- related projects.

The current approved member presentation uses three team-provided GLB models:

- 罗天彪 uses the yellow astronaut, 何欣 uses the astronaut bear, and 陈江銮
  uses the white-suit astronaut;
- render every model through the same locally hosted Google `<model-viewer>`
  treatment, at 300px wide or smaller, with no auto-rotation;
- load the viewer module once, remount by member identity when records switch,
  and calibrate the initial orbit so every character opens facing forward;
- only the expanded record mounts its model, and touch interaction must retain
  vertical page scrolling;
- retain each cleaned front-view artwork as the loading poster and failure
  fallback; the former eight-view turntable is no longer the primary member
  presentation;
- keep visible names, roles, school, and participation readable without the 3D
  viewer.

Do not publish repeated Pending profiles. Hide the records or show one honest
founding-team notice until verified information is available.

### 5.8 Future Projects

Present an exploration pipeline, not fabricated completed work:

`SIGNAL -> INVESTIGATING -> PROTOTYPING`

Each entry contains a working title, question, stage, exploration direction,
last-updated date, and collaboration availability.

### 5.9 Contact

- Keep one large, quiet dark panel.
- Use only verified email, social accounts, school, city, or team information.
- Include one primary action.
- SpecularButton may be used for this primary action.
- Avoid additional particle or border systems.

## 6. Component placement

| Component | Frozen placement | Limit |
| --- | --- | --- |
| Galaxy | Hero background | One instance |
| GradientText | H1 and rare strategic highlights | No more than five text elements |
| PillNav | Primary sticky navigation | One instance |
| MagicBento | Exploration | One grid |
| SpecularButton | Primary Hero or Contact actions | Two to three instances maximum |
| StarBorder | Featured Experiment or participation entry | One to two instances maximum |
| SpotlightCard | Current Question | One instance |
| ResearchStepper | Future Projects research pipeline | One instance |
| OrbitImages | Featured Experiment process gallery | One instance |
| ScrollStack | Knowledge Network Lab Notes | One instance |
| MemberModel3D | All expanded member records | One compact manual viewer active at a time |

Do not add another decorative animation component without amending this frozen
specification with explicit user approval.

### React Bits selection record

The user explicitly approved reviewing React Bits components on 2026-07-19.
The approved integration is intentionally narrow:

- `SpotlightCard` is approved for Current Question after reducing the pointer
  light, keeping real link semantics, and adding coarse-pointer,
  reduced-motion, and high-contrast fallbacks.
- `ResearchStepper` is a local, dependency-free adaptation of the React Bits
  Stepper pattern. It is a read-only semantic list for
  `SIGNAL -> INVESTIGATING -> PROTOTYPING`; it does not hide content or use
  form-style Next and Back controls.
- `Folder` is deferred until enough verified Lab Notes exist, and may only be
  used as a secondary archive entry.
- `ProfileCard` is deferred until verified member names, roles, portraits, and
  stories exist.
- `OrbitImages` was explicitly approved by the user for the Featured Experiment
  on 2026-07-19. It uses only verified PaperFit screenshots, replaces the
  static process gallery, pauses off-screen and when the page is hidden, and
  becomes a touch-friendly horizontal gallery on mobile or reduced-motion
  environments.
- `ScrollStack` was explicitly approved by the user for Knowledge Network on
  2026-07-19. The supplied JavaScript concept is adapted to native CSS sticky
  positioning because its CSS was not included and installing Lenis would add
  an unnecessary global scroll runtime. Cards remain semantic and become a
  normal list on mobile and for reduced-motion users.
- `CardSwap`, `AnimatedList`, `GlassSurface`, and additional
  backgrounds are excluded from the current baseline because they duplicate
  existing motion, hide important information, add unnecessary runtime work,
  or weaken the editorial hierarchy.
- Future React Bits source should be brought in as the official TypeScript and
  CSS variant, reviewed locally, and adapted before use. Do not run a component
  installer or add a package dependency without separate explicit approval.

## 7. Visual tokens

### Color

| Token | Value |
| --- | --- |
| Space Black | `#05050A` |
| Deep Surface | `#0B0B13` |
| Raised Surface | `#12121D` |
| Primary Violet | `#5560DD` |
| Human Rose | `#E38DB3` |
| Soft Lavender | `#B8B4FF` |
| Primary Text | `#F5F4F8` |
| Secondary Text | `#AAA6B8` |
| Border | `rgba(255, 255, 255, 0.12)` |

Rules:

- Violet is the primary accent.
- Rose is mainly a gradient transition color.
- Use no more than one obvious glow region per viewport.
- Content sections rely primarily on black, white, and neutral gray.
- Do not add generic neon blue or fluorescent green.

### Typography

- Display English: Space Grotesk or the existing compatible display sans.
- Body English: Geist, Inter, or the existing compatible body sans.
- Chinese: PingFang SC or Noto Sans SC.
- Dates, states, and identifiers: a restrained monospace face.
- Uppercase is reserved for metadata, labels, and identifiers.
- Small titles and body copy remain solid color; do not make every heading a
  gradient.

### Radius

| Element | Radius |
| --- | --- |
| Large panel | `28px` |
| Card | `20px` |
| Button | `16px` |
| Pill | `999px` |

### Spacing

Use the scale: `8, 12, 16, 24, 32, 48, 64, 96`.

- Desktop section spacing: approximately 96-128px.
- Mobile section spacing: approximately 72-88px.
- After a section title appears, some meaningful content should also be visible
  in the same viewport.
- Reduce the current non-Hero vertical whitespace by roughly 15-20% where it
  delays meaningful content.

## 8. Motion rules

- Initial page reveal: 500-700ms.
- Stagger between related elements: 60-100ms.
- Hover response: 180-240ms.
- Pointer parallax displacement: no more than 8-12px.
- Demo media may autoplay only when muted, looping, and lazily loaded.
- Disable pointer-dependent effects on coarse pointers.
- Respect reduced-motion, high-contrast, Save-Data, off-screen, and hidden-page
  states.
- Never run several attention-seeking animations in the same viewport.
- Motion must reveal hierarchy, state, or real work; it must not exist only as
  decoration.

## 9. Responsive and accessibility rules

- Fix the mobile eyebrow so Chinese words do not break awkwardly.
- Maintain readable Chinese text contrast on purple-black surfaces.
- Keep interactive targets at least 44px in both dimensions.
- Preserve keyboard navigation, visible focus, semantic headings, and usable
  expanded-member controls.
- Keep WebGL and decorative content outside the accessibility tree.
- Every meaningful image or demo requires appropriate alternative text or an
  adjacent text explanation.

## 10. Required verified assets

Before public release, prepare:

- 宇航员 logo or monogram;
- one real featured experiment;
- one real demo video, GIF, prototype, or interface capture;
- three to six process images, sketches, or screenshots;
- verified member names and roles;
- consistent portraits or a truthful alternative;
- one `Why I Explore` statement per member;
- at least three Lab Notes;
- verified contact and social links;
- verified founding date, school, city, or team context when disclosed;
- project status and update dates.

## 11. Prohibited patterns

- no additional particle background;
- no 3D globe;
- no code rain;
- no additional neon border system;
- no glow on every card;
- no gradient on every heading;
- no fake members, data, partners, awards, or project outcomes;
- no component-gallery effect created by stacking more animation widgets;
- no generic rocket, robot, brain, or circuit imagery used as filler.

## 12. Implementation order

1. Current Question and Featured Experiment
2. Verified Members
3. Lab Notes
4. Page-density and editorial-rhythm refinement
5. Navigation simplification and component-placement alignment
6. Mobile line-break, contrast, motion, and accessibility refinement
7. Final desktop and mobile visual QA

## 13. Acceptance criteria

The refinement is complete only when:

- the team identity is understandable within five seconds;
- a real current question and real experiment appear within thirty seconds;
- every published project identifies status, date, participants, process, and
  next step;
- no public placeholder implies unverified member or project information;
- each viewport has a clear primary point of attention;
- the site does not feel like a collection of unrelated animation components;
- mobile text does not break awkwardly or lose contrast;
- reduced-motion and coarse-pointer experiences remain complete;
- lint, type checks, production build, rendered-content tests, and desktop and
  mobile visual checks pass;
- no deployment occurs without separate explicit user approval.
