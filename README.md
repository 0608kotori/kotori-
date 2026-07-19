# 宇航员 ASTRONAUTS Website

A bilingual brand website for a student innovation team exploring the
intersection of AI, digital technology, and humanity.

Visible copy follows a Chinese-first 70:30 language hierarchy. Chinese carries
the main narrative and decisions; English is reserved for the ASTRONAUTS brand,
metadata, and short secondary captions.

## Product intent

The site is designed for competition judges, teachers, collaborators, and
people interested in technology. Its first job is to explain, within seconds:

- who the team is;
- why its members came together;
- what future-facing questions they want to explore.

The experience uses Apple-inspired product-design principles—clear hierarchy,
restrained materials, accessible controls, and purposeful motion—without
copying Apple assets or platform-only behavior.

## Design baseline

The approved and frozen design direction is documented in
[`DESIGN-SPEC.md`](./DESIGN-SPEC.md). It is the source of truth for page
hierarchy, component placement, visual tokens, responsive behavior, motion,
content evidence, and acceptance criteria.

## Local development

Requirements:

- Node.js 22.13 or newer
- pnpm 11

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before a public release so
canonical, Open Graph, robots, and sitemap URLs use the production domain.

## Verification

```bash
pnpm lint
pnpm test
```

`pnpm test` performs a production build and checks the rendered HTML plus key
accessibility safeguards.

## Content updates

Primary page content is in `app/SiteExperience.tsx`. Replace the founding-team
notice and closed contact-channel status only with verified team information.
Do not invent project outcomes, member biographies, partnerships, or contact
channels.

Global visual tokens and responsive behavior are in `app/globals.css`.

## Current status

- The initial local implementation is complete.
- The refined design specification has been approved and frozen.
- The Current Question, semantic research pipeline, simplified navigation,
  verified-content member notice, palette alignment, and spacing refinement
  are implemented locally.
- The PaperFit prototype is presented as the Featured Experiment with four
  team-owned process images, and three verified knowledge-system records are
  presented as Lab Notes. A reduced display copy of the largest screenshot is
  used to keep below-the-fold loading lighter while preserving the original.
- Project participation is presented as collective ASTRONAUTS / 宇航员 work.
  The three verified members, Guangzhou Huashang College context, team email,
  mobile number, and QQ contact are now published; social media remains omitted.
- A dedicated 1200×630 social card, app icon, manifest, canonical metadata,
  robots policy, and sitemap are included for release readiness.
- The PaperFit process gallery uses one dependency-free `OrbitImages`
  presentation with the four verified screenshots. It pauses when hidden or
  off-screen and becomes a manual horizontal gallery on mobile.
- The Featured Experiment is introduction-first: it does not repeat a large
  product screenshot above the smaller process orbit.
- Knowledge Network is presented as the introduction-first second product;
  its Lab Notes use one native sticky `ScrollStack` with question, method,
  finding, date, status, and small supporting screenshots. The layout becomes
  a normal card list on mobile and for reduced-motion users.
- Production build, lint, and automated checks pass for the current
  implementation.
- Deployment has not been performed.
- A final human visual check is still recommended on desktop and mobile before
  public release.
