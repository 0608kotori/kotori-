import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete ASTRONAUTS experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>宇航员 ASTRONAUTS — 学生未来科技探索团队<\/title>/);
  assert.match(html, /ASTRONAUTS/);
  assert.match(html, /宇航员/);
  assert.match(html, /Explore what could be\./);
  assert.match(html, /探索尚未发生的可能。/);
  assert.match(html, /id="current-question"/);
  assert.match(html, /How can AI expand human imagination without replacing it\?/);
  assert.match(html, /id="featured-experiment"/);
  assert.match(html, /PaperFit/);
  assert.match(html, /\/images\/experiments\/paperfit\/home\.png/);
  assert.match(html, /PaperFit 原型过程图片轨道/);
  assert.match(html, /PROCESS ORBIT/);
  assert.match(html, /id="story"/);
  assert.match(html, /id="exploration"/);
  assert.match(html, /id="lab-notes"/);
  assert.match(html, /One entrance, six working zones\./);
  assert.match(html, /Not just storage\. A system that connects\./);
  assert.match(html, /\/images\/lab-notes\/knowledge-system\/graph\.jpg/);
  assert.match(html, /scroll-stack-card/);
  assert.match(html, /id="members"/);
  assert.match(html, /id="projects"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /坐标 (?:<!-- -->)?01/);
  assert.match(html, /OPEN INQUIRY/);
  assert.match(html, /Explore with us/);
  assert.match(html, /RESEARCH PIPELINE/);
  assert.match(html, /SIGNAL/);
  assert.match(html, /MEMBER (?:<!-- -->)?01/);
  assert.match(html, /罗天彪/);
  assert.match(html, /何欣/);
  assert.match(html, /陈江銮/);
  assert.match(html, /<details class="profile"/);
  assert.match(html, /宇航员团队 · 共同完成/);
  assert.match(html, /四个方向，/);
  assert.match(html, /不只储存，<\/span><span>还懂得牵线。/);
  assert.match(html, /让排版，<br\/>配得上你的研究。/);
  assert.match(html, /Let formatting do justice to your research\./);
  assert.match(html, /让想法，<br\/>找到栖息之地。/);
  assert.match(html, /Let ideas find a place to land\./);
  assert.match(html, /真实档案 · ARCHIVE TRACE/);
  assert.match(html, /一个想法，怎样一步步变成实验。/);
  assert.match(html, /207188250@qq\.com/);
  assert.match(html, /18476511154/);
  assert.match(html, /广州华商学院/);
  assert.doesNotMatch(html, /Opening after the team profile is verified\./);
  assert.doesNotMatch(html, /待补充真实团队邮箱|待补充官方社交账号/);
  assert.doesNotMatch(html, /三维身份样机|已确认档案/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);

  const sectionOrder = [
    'id="home"',
    'id="current-question"',
    'id="featured-experiment"',
    'id="exploration"',
    'id="story"',
    'id="lab-notes"',
    'id="members"',
    'id="projects"',
    'id="contact"',
  ];
  sectionOrder.slice(1).forEach((section, index) => {
    assert.ok(
      html.indexOf(sectionOrder[index]) < html.indexOf(section),
      `${sectionOrder[index]} should appear before ${section}`,
    );
  });
});

test("keeps accessibility, performance, and starter-cleanup safeguards in source", async () => {
  const [
    page,
    layout,
    sitemap,
    manifest,
    experience,
    orbitImages,
    orbitImagesCss,
    scrollStack,
    scrollStackCss,
    galaxy,
    galaxyCss,
    gradient,
    gradientCss,
    starBorder,
    starBorderCss,
    spotlightCard,
    spotlightCardCss,
    pillNav,
    pillNavCss,
    researchStepper,
    researchStepperCss,
    specularButton,
    specularButtonCss,
    bento,
    bentoCss,
    css,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/SiteExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/OrbitImages.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/OrbitImages.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/ScrollStack.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ScrollStack.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/GalaxyBackground.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/GalaxyBackground.module.css", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/GradientText.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GradientText.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/StarBorder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/StarBorder.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/SpotlightCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SpotlightCard.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/PillNav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PillNav.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/ResearchStepper.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResearchStepper.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/SpecularButton.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/SpecularButton.module.css", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/MagicBento.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/MagicBento.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<SiteExperience \/>/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /\/og\.png/);
  assert.match(sitemap, /NEXT_PUBLIC_SITE_URL/);
  assert.match(manifest, /宇航员 ASTRONAUTS/);
  assert.match(experience, /className="skip-link"/);
  assert.match(experience, /aria-expanded=\{menuOpen\}/);
  assert.doesNotMatch(experience, /<details key=\{profile\}/);
  assert.match(experience, /useGSAP/);
  assert.match(experience, /ScrollTrigger/);
  assert.match(experience, /prefers-reduced-motion: no-preference/);
  assert.match(experience, /<GalaxyBackground \/>/);
  assert.match(orbitImages, /import Image from "next\/image"/);
  assert.match(experience, /href="#featured-experiment"/);
  assert.match(experience, /const paperFitMedia/);
  assert.match(experience, /const labNotes/);
  assert.doesNotMatch(experience, /className="lab-note__media"/);
  assert.match(orbitImages, /unoptimized/);
  assert.match(experience, /<OrbitImages/);
  assert.match(experience, /shape="ellipse"/);
  assert.match(experience, /radiusX=\{300\}/);
  assert.match(experience, /itemSize=\{92\}/);
  assert.match(experience, /duration=\{30\}/);
  assert.doesNotMatch(experience, /featured-experiment__gallery/);
  assert.doesNotMatch(experience, /className="featured-experiment__media"/);
  assert.match(orbitImages, /ResizeObserver/);
  assert.match(orbitImages, /IntersectionObserver/);
  assert.match(orbitImages, /visibilitychange/);
  assert.match(orbitImages, /prefers-reduced-motion: reduce/);
  assert.match(orbitImages, /saveData/);
  assert.match(orbitImagesCss, /offset-path:\s*ellipse/);
  assert.match(orbitImagesCss, /object-fit:\s*contain/);
  assert.match(orbitImagesCss, /animation-play-state:\s*paused/);
  assert.match(orbitImagesCss, /@media \(max-width:\s*680px\)/);
  assert.match(orbitImagesCss, /scroll-snap-type:\s*x mandatory/);
  assert.match(experience, /<ScrollStack/);
  assert.match(experience, /<ScrollStackItem/);
  assert.match(scrollStack, /native sticky positioning/);
  assert.doesNotMatch(scrollStack, /from "lenis"|requestAnimationFrame/);
  assert.match(scrollStackCss, /position:\s*sticky/);
  assert.match(scrollStackCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(scrollStackCss, /@media \(max-width:\s*680px\)/);
  assert.match(experience, /<GradientText/);
  assert.match(experience, /#353049/);
  assert.match(experience, /#5560dd/);
  assert.match(experience, /#e38db3/);
  assert.match(experience, /animationSpeed=\{8\}/);
  assert.match(experience, /showBorder=\{false\}/);
  assert.doesNotMatch(experience, /<StarBorder/);
  assert.match(experience, /href: "#exploration"/);
  assert.match(experience, /<SpotlightCard/);
  assert.match(experience, /id="current-question"/);
  assert.match(experience, /<ResearchStepper/);
  assert.match(experience, /currentStep=\{1\}/);
  assert.match(experience, /<MagicBento/);
  assert.match(experience, /spotlightRadius=\{360\}/);
  assert.match(experience, /particleCount=\{12\}/);
  assert.match(experience, /glowColor="85, 96, 221"/);
  assert.match(experience, /enableTilt=\{false\}/);
  assert.match(experience, /enableMagnetism=\{false\}/);
  assert.doesNotMatch(experience, /exploration-grid|exploration-card/);
  assert.doesNotMatch(experience, /cosmos__stars/);
  assert.match(galaxy, /import\("ogl"\)/);
  assert.match(galaxy, /MAX_BACKING_PIXELS\s*=\s*1_200_000/);
  assert.match(galaxy, /TARGET_FRAME_INTERVAL\s*=\s*1000\s*\/\s*30/);
  assert.match(galaxy, /IntersectionObserver/);
  assert.match(galaxy, /visibilitychange/);
  assert.match(galaxy, /prefers-reduced-motion: reduce/);
  assert.match(galaxy, /prefers-contrast: more/);
  assert.match(galaxy, /pointer: coarse/);
  assert.match(galaxy, /saveData/);
  assert.match(galaxyCss, /data-ready="true"/);
  assert.match(galaxyCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(gradient, /seamlessPalette/);
  assert.match(gradient, /palette\[palette\.length - 1\]/);
  assert.match(gradientCss, /gradient-text-shift/);
  assert.match(gradientCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(starBorder, /SPEED_PATTERN/);
  assert.match(starBorder, /as === "a"/);
  assert.match(starBorderCss, /star-border-orbit/);
  assert.match(starBorderCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(starBorderCss, /prefers-contrast:\s*more/);
  assert.match(spotlightCard, /requestAnimationFrame/);
  assert.match(spotlightCard, /event\.pointerType === "touch"/);
  assert.match(spotlightCardCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(spotlightCardCss, /pointer:\s*coarse/);
  assert.match(spotlightCardCss, /prefers-contrast:\s*more/);
  assert.match(experience, /<PillNav/);
  assert.match(experience, /activeHref=\{activeHref\}/);
  assert.match(experience, /ease="power2\.easeOut"/);
  assert.match(experience, /initialLoadAnimation=\{false\}/);
  assert.match(experience, /rootMargin: "-20% 0px -68% 0px"/);
  assert.doesNotMatch(experience, /className="nav-links"/);
  assert.match(pillNav, /aria-current=\{active \? "location"/);
  assert.match(pillNav, /normalizeEase/);
  assert.match(pillNav, /modernEase/);
  assert.match(pillNav, /power2\.out/);
  assert.match(pillNav, /ResizeObserver/);
  assert.match(pillNav, /gsap\.to/);
  assert.match(pillNav, /prefers-reduced-motion: reduce/);
  assert.match(pillNavCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(pillNavCss, /prefers-contrast:\s*more/);
  assert.match(experience, /const pillNavigation = navigation/);
  assert.match(researchStepper, /<ol/);
  assert.match(researchStepper, /aria-current=/);
  assert.match(researchStepper, /data-state=\{state\}/);
  assert.match(researchStepper, /styles\.activeDot/);
  assert.match(researchStepper, /step\.titleZh/);
  assert.doesNotMatch(researchStepper, /motion\/react|framer-motion/);
  assert.match(researchStepperCss, /grid-template-columns:\s*repeat\(3/);
  assert.match(researchStepperCss, /connectorFill/);
  assert.match(researchStepperCss, /max-width:\s*760px/);
  assert.match(researchStepperCss, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(experience, /href="\/(?:about|services|contact)"/);
  assert.match(experience, /<SpecularButton/);
  assert.match(experience, /proximity=\{250\}/);
  assert.match(experience, /autoAnimate=\{false\}/);
  assert.match(specularButton, /IntersectionObserver/);
  assert.match(specularButton, /visibilitychange/);
  assert.match(specularButton, /requestAnimationFrame/);
  assert.match(specularButton, /prefers-reduced-motion: reduce/);
  assert.match(specularButton, /pointer: coarse/);
  assert.doesNotMatch(specularButton, /Math\.random/);
  assert.match(specularButtonCss, /specular-auto-sweep/);
  assert.match(specularButtonCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(specularButtonCss, /prefers-contrast:\s*more/);
  assert.match(bento, /MAX_PARTICLE_COUNT\s*=\s*24/);
  assert.match(bento, /IntersectionObserver/);
  assert.match(bento, /visibilitychange/);
  assert.match(bento, /requestAnimationFrame/);
  assert.match(bento, /prefers-reduced-motion: reduce/);
  assert.match(bento, /pointer: coarse/);
  assert.match(bento, /magic-bento-grid/);
  assert.match(bento, /magic-bento-card/);
  assert.doesNotMatch(bento, /Math\.random/);
  assert.doesNotMatch(
    bento,
    /(?:window|document)\.addEventListener\("pointermove"/,
  );
  assert.match(bentoCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(bentoCss, /prefers-contrast:\s*more/);
  assert.match(bentoCss, /data-active="false"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /prefers-contrast:\s*more/);
  assert.match(css, /min-height:\s*100svh/);
  assert.doesNotMatch(css, /\.nav-links/);
  assert.doesNotMatch(css, /\.exploration-grid|\.exploration-card/);
  assert.doesNotMatch(css, /\.process-grid/);
  assert.doesNotMatch(css, /cosmos__stars/);
  assert.doesNotMatch(css, /content-arrive/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  const dependencies = JSON.parse(packageJson).dependencies;
  assert.equal(dependencies.gsap, "3.15.0");
  assert.equal(dependencies["@gsap/react"], "2.1.2");
  assert.equal(dependencies.ogl, "1.0.11");
  assert.equal(dependencies["drizzle-orm"], undefined);
  assert.equal(dependencies.motion, undefined);
  assert.equal(dependencies.lenis, undefined);

  await assert.rejects(
    access(new URL("../app/_sites-preview", import.meta.url)),
  );
  await assert.rejects(access(new URL("../db/index.ts", import.meta.url)));

  await Promise.all([
    access(new URL("../public/images/experiments/paperfit/home.png", import.meta.url)),
    access(new URL("../public/images/experiments/paperfit/template.png", import.meta.url)),
    access(new URL("../public/images/experiments/paperfit/results.png", import.meta.url)),
    access(
      new URL(
        "../public/images/experiments/paperfit/export-complete.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/lab-notes/knowledge-system/moc-display.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/lab-notes/knowledge-system/graph.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/lab-notes/knowledge-system/auto-organizer.jpg",
        import.meta.url,
      ),
    ),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../app/icon.png", import.meta.url)),
  ]);
});

test("keeps member identity viewers mapped, compact, and accessible", async () => {
  const [experience, layout, model, loader, modelCss, packageJson] = await Promise.all([
    readFile(new URL("../app/SiteExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/MemberModel3D.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/modelViewerLoader.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/MemberModel3D.module.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(experience, /frames\/luo-tianbiao/);
  assert.match(experience, /frames\/he-xin/);
  assert.match(experience, /frames\/chen-jiangluan/);
  assert.match(experience, /avatars\/luo-tianbiao\.png/);
  assert.match(experience, /avatars\/he-xin\.png/);
  assert.match(experience, /avatars\/chen-jiangluan\.png/);
  assert.match(experience, /luo-tianbiao-astronaut\.glb/);
  assert.match(experience, /he-xin-astronaut-bear\.glb/);
  assert.match(experience, /chen-jiangluan-astronaut\.glb/);
  assert.match(experience, /activeMember === member\.name/);
  assert.match(experience, /<MemberModel3D/);
  assert.match(experience, /key=\{member\.modelSrc\}/);
  assert.match(experience, /cameraOrbit: "90deg 75deg 150%"/);
  assert.match(experience, /scheduleHashAlignment/);
  assert.match(experience, /scrollIntoView\(\{ block: "start" \}\)/);
  assert.doesNotMatch(experience, /MemberSpinArchive/);
  assert.doesNotMatch(experience, /MemberAvatar3D/);
  assert.match(model, /loadModelViewer/);
  assert.match(model, /key=\{modelSrc\}/);
  assert.match(model, /model\.setAttribute\("src", modelSrc\)/);
  assert.match(model, /camera-controls=""/);
  assert.match(model, /camera-orbit=\{cameraOrbit\}/);
  assert.match(model, /loading="eager"/);
  assert.doesNotMatch(model, /loadRequested/);
  assert.doesNotMatch(model, /加载 3D 视图/);
  assert.doesNotMatch(model, /auto-rotate/);
  assert.match(model, /--model-accent/);
  assert.match(layout, /rel="modulepreload"/);
  assert.match(layout, /luo-tianbiao-astronaut\.glb/);
  assert.match(layout, /he-xin-astronaut-bear\.glb/);
  assert.match(layout, /chen-jiangluan-astronaut\.glb/);
  assert.match(layout, /type="model\/gltf-binary"/);
  assert.match(loader, /\/vendor\/google-model-viewer\.min\.js/);
  assert.match(loader, /modelViewerPromise/);
  assert.match(loader, /customElements\.whenDefined/);
  assert.match(modelCss, /width:\s*min\(100%, 300px\)/);
  assert.match(modelCss, /aspect-ratio:\s*0\.88/);
  assert.equal(JSON.parse(packageJson).dependencies["@google/model-viewer"], undefined);

  await Promise.all([
    access(
      new URL(
        "../public/images/members/avatars/luo-tianbiao.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/members/avatars/he-xin.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/members/avatars/chen-jiangluan.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/members/frames/luo-tianbiao/01.webp",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/members/frames/he-xin/01.webp",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/members/frames/chen-jiangluan/01.webp",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/models/luo-tianbiao-astronaut.glb",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/models/he-xin-astronaut-bear.glb",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/models/chen-jiangluan-astronaut.glb",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/vendor/google-model-viewer.min.js",
        import.meta.url,
      ),
    ),
  ]);
});
