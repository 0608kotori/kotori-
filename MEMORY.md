# Site Memory

- The frozen design baseline is `DESIGN-SPEC.md`; preserve its page hierarchy and Chinese-first language balance.
- Member visuals must map to the verified names and roles already present in the site.
- Compact 3D member viewers are optional enhancements inside expanded member records, never replacements for readable profile content.
- Keep the site local until the user separately approves deployment.
- Member identity revision (2026-07-19): the user rejected the procedural 3D
  result. Preserve the supplied illustration style in an eight-view sprite
  turntable instead. Map yellow captain to 罗天彪, bear guardian to 何欣, and
  white-suit evaluator to 陈江銮. Render only the open record; support drag,
  touch, keyboard, labelled angle controls, and reduced motion without adding a
  3D dependency.
- Member frame cleanup (2026-07-19): do not enlarge the original contact sheets
  in the browser. Rebuild the 24 deterministic display frames with
  `scripts/prepare-member-frames.py`, preserving the verified art while
  removing sheet labels, palettes, dividers, repeated rows, and connected white
  background. Serve the transparent WebP frames on the existing deep-space
  archive surface.
- 罗天彪 3D pilot (2026-07-19): the user supplied
  `public/models/luo-tianbiao-astronaut.glb` and explicitly requested one small
  preview before applying 3D elsewhere. Use Google's official `<model-viewer>`
  module script, no autoplay, maximum 300px viewer width, lazy open-record
  mounting, `pan-y` touch behavior, and the cleaned front frame as poster and
  failure fallback. 何欣 and 陈江銮 remain eight-view archives.
- Three-model rollout (2026-07-19): the user subsequently supplied and approved
  `he-xin-astronaut-bear.glb` for 何欣 and `chen-jiangluan-astronaut.glb` for
  陈江銮. This supersedes the pilot-only limitation. All three records now use
  the same locally hosted Google `<model-viewer>`, maximum 300px wide, no
  autoplay, one mounted viewer at a time, and their cleaned front frames as
  loading/error posters.
- Member viewer reliability fix (2026-07-19): load the local Google viewer
  module through one persistent promise, force each member model to remount by
  model identity, and reapply source, poster, alt text, and camera orbit after
  the custom element is defined. Desktop browser QA verified the sequence
  罗天彪 -> 何欣 -> 陈江銮 with one ready viewer and a front-facing 90-degree
  orbit for every record.
- UI polish baseline (2026-07-19): unmatched PillNav sections must leave no
  visible active pill. Keep the Lab Notes title on two intentional Chinese
  lines, use small verified process artifacts in Our Story, retain Chinese-first
  two-line OrbitImages captions with metadata outside the orbit, and show
  cleaned poster thumbnails in collapsed member rows. The reduced section,
  MagicBento, and Projects heights are the accepted editorial density for both
  desktop and mobile. Final typecheck, lint, build, rendered tests, desktop QA,
  and 390px QA pass; deployment remains unapproved.
- Copy revision (2026-07-19): use `让排版，配得上你的研究。`, `不只储存，
  还懂得牵线。`, and `让想法，找到栖息之地。` as the approved Chinese
  section headlines, with concise English captions. Expanded member records
  show the model plus factual role, school, and current-work fields only; omit
  the former prototype and verified-record explanatory blocks. Mobile title
  sizing prevents orphaned Chinese characters. Validation and visual QA pass;
  deployment remains unapproved.
- GitHub-ready state (2026-07-19): upload the `site/` directory as the project
  root. `.gitignore` excludes dependencies, generated builds, caches, and
  `*.tsbuildinfo`, but explicitly keeps `.env.example`. Public assets total
  about 55 MB and every individual model stays under GitHub's 100 MB limit.
  No repository initialization, commit, push, or deployment has occurred.
- GitHub upload package (2026-07-19): the local `site/` repository is connected
  to `0608kotori/kotori-` and has a prepared local commit. Keep
  `build/sites-vite-plugin.ts` tracked even though generated build output is
  ignored; `vite.config.ts` imports this source file and a clean deployment
  build fails without it. The verified 82-file manual-upload subset lives at
  `../github-upload-ready`, excludes internal notes, tests, frame-generation
  tooling, unused member contact sheets, and the unused `moc.png`, and passes a
  clean production build. The initial website upload was pushed to
  `origin/main` at commit `1dfa258` on 2026-07-20. Deployment has not been
  performed.
- Navigation and project cleanup (2026-07-19): initial and refreshed hash URLs
  now realign after layout and ScrollTrigger refresh, including `#members` on
  desktop and mobile. Remove the unused D1/Drizzle starter scaffold and keep a
  first-class `typecheck` script; lint, full TypeScript, build, rendered tests,
  and runtime console checks pass. GLB compression remains deferred because no
  verified local optimizer is available and no new dependency was approved.
- Cloudflare Worker runtime fix (2026-07-20): the first successful Workers
  build deployed but every request returned Error 1101. Observability traced it
  to `gsap.registerPlugin(useGSAP, ScrollTrigger)` starting GSAP's timer while
  the client module was evaluated in Worker global scope. Keep plugin
  registration behind a browser-only `typeof window !== "undefined"` guard.
  The corrected source passes typecheck, lint, production build, and rendered
  HTML tests. Cloudflare build `13d6c181` deployed commit `e936ed8`, and the
  production homepage was verified with HTTP 200 and a visual browser check.
