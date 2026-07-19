"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GalaxyBackground } from "./GalaxyBackground";
import GradientText from "./GradientText";
import MagicBento from "./MagicBento";
import MemberModel3D from "./MemberModel3D";
import OrbitImages from "./OrbitImages";
import PillNav from "./PillNav";
import ResearchStepper, { type ResearchStep } from "./ResearchStepper";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import SpecularButton from "./SpecularButton";
import SpotlightCard from "./SpotlightCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const navigation = [
  { href: "#story", label: "故事" },
  { href: "#exploration", label: "探索" },
  { href: "#members", label: "成员" },
  { href: "#projects", label: "项目" },
  { href: "#contact", label: "联系" },
] as const;

const pageSections = [
  { href: "#home", label: "Home" },
  ...navigation,
] as const;

const pillNavigation = navigation;

const storySteps = [
  {
    index: "01",
    title: "A Question",
    titleZh: "一个问题",
    copy: "Technology keeps moving. We began by asking what those changes could mean for people.",
    copyZh: "科技不断向前，我们从一个简单的问题开始：它会如何改变人与世界的关系？",
    artifact: {
      src: "/images/experiments/paperfit/home.png",
      width: 1200,
      height: 924,
      alt: "PaperFit 原型首页，记录团队把真实问题转化为工具方向的过程。",
      label: "问题成为原型 · PaperFit",
    },
  },
  {
    index: "02",
    title: "Finding Each Other",
    titleZh: "找到彼此",
    copy: "Different interests, the same curiosity. Conversations slowly became a team.",
    copyZh: "不同的兴趣，因为同一种好奇交汇；一次次讨论，慢慢成为一支团队。",
    artifact: {
      src: "/images/lab-notes/knowledge-system/moc-display.jpg",
      width: 2000,
      height: 1217,
      alt: "团队知识系统总入口，记录共同资料与方法逐渐汇集的过程。",
      label: "共同知识入口 · MOC",
    },
  },
  {
    index: "03",
    title: "Learning by Making",
    titleZh: "在实践中理解",
    copy: "We learn by building, testing, reflecting, and trying again.",
    copyZh: "我们把想法做成实验，在尝试、失败与复盘中理解技术。",
    artifact: {
      src: "/images/experiments/paperfit/results.png",
      width: 1200,
      height: 1036,
      alt: "PaperFit 检测结果界面，记录团队测试安全修正边界的过程。",
      label: "测试与复盘 · PaperFit",
    },
  },
  {
    index: "04",
    title: "Staying Open",
    titleZh: "向未知保持开放",
    copy: "We are not here to predict the future. We are here to explore it.",
    copyZh: "我们不急着定义未来，只想持续靠近那些尚未被回答的问题。",
    artifact: {
      src: "/images/lab-notes/knowledge-system/graph.jpg",
      width: 1327,
      height: 768,
      alt: "团队知识网络图谱，记录仍在扩展的探索方向与连接。",
      label: "持续生长的连接 · GRAPH",
    },
  },
] as const;

const explorationFields = [
  {
    index: "01",
    title: "AI Future",
    titleZh: "AI 与未来",
    copy: "How can AI extend human imagination without replacing human judgment?",
    copyZh: "AI 如何拓展人的想象力，同时保留人的判断与温度？",
    accent: "184, 180, 255",
  },
  {
    index: "02",
    title: "Digital World",
    titleZh: "数字世界",
    copy: "What new ways of learning, creating, and connecting can digital spaces make possible?",
    copyZh: "数字世界还能带来怎样的学习、创造与连接方式？",
    accent: "85, 96, 221",
  },
  {
    index: "03",
    title: "Human & Technology",
    titleZh: "人与技术",
    copy: "How can technology feel more human, accessible, and meaningful?",
    copyZh: "技术如何变得更自然、更包容，也更有意义？",
    accent: "227, 141, 179",
  },
  {
    index: "04",
    title: "Unknown Possibilities",
    titleZh: "未知可能",
    copy: "Some of the most important questions do not have names yet.",
    copyZh: "有些重要的问题还没有名字，我们愿意为它们保留空间。",
    accent: "245, 244, 248",
  },
] as const;

const researchSteps = [
  {
    id: "signal",
    label: "SIGNAL",
    labelZh: "捕捉信号",
    title: "A question worth keeping.",
    titleZh: "一个值得留下的问题。",
    copy: "Notice a change, tension, or possibility before deciding what it means.",
    copyZh: "先发现变化、矛盾或可能性，再决定它是否值得继续追问。",
  },
  {
    id: "investigating",
    label: "INVESTIGATING",
    labelZh: "持续研究",
    title: "Turn curiosity into a method.",
    titleZh: "把好奇变成方法。",
    copy: "Collect references, compare ideas, and define one experiment small enough to try.",
    copyZh: "收集资料、比较观点，并把问题缩小成一次能够真正开始的实验。",
  },
  {
    id: "prototyping",
    label: "PROTOTYPING",
    labelZh: "形成原型",
    title: "Make the question visible.",
    titleZh: "让问题变得可见。",
    copy: "Build, test, document limitations, and decide what should change next.",
    copyZh: "制作、测试、记录局限，并决定下一次需要改变什么。",
  },
] as const satisfies readonly ResearchStep[];

const paperFitMedia = [
  {
    src: "/images/experiments/paperfit/home.png",
    width: 1200,
    height: 924,
    label: "产品定位 · PRODUCT POSITIONING",
    alt: "PaperFit 首页，展示中文论文格式检测与安全修正工具的定位和检测范围。",
  },
  {
    src: "/images/experiments/paperfit/template.png",
    width: 1200,
    height: 800,
    label: "01 · 读取模板 · READ THE TEMPLATE",
    alt: "PaperFit 第一步界面，上传学校论文模板并提取排版规范。",
  },
  {
    src: "/images/experiments/paperfit/results.png",
    width: 1200,
    height: 1036,
    label: "02 · 复核边界 · REVIEW THE BOUNDARY",
    alt: "PaperFit 检测结果界面，将可安全修正项目与需要人工复核项目分开显示。",
  },
  {
    src: "/images/experiments/paperfit/export-complete.png",
    width: 2400,
    height: 1544,
    label: "03 · 保留原件 · KEEP THE ORIGINAL",
    alt: "PaperFit 导出完成界面，显示安全修正已完成并保存独立修正版。",
  },
] as const;

const labNotes = [
  {
    index: "NOTE 01",
    date: "2026.07.19",
    status: "DOCUMENTED",
    title: "One entrance, six working zones.",
    titleZh: "一个入口，六个工作区域。",
    question:
      "How can a knowledge system keep one clear entrance without losing depth?",
    questionZh: "怎样保留一个清晰入口，又不牺牲知识系统的深度？",
    method:
      "Build a central MOC and route detailed decisions to dedicated overview pages.",
    methodZh: "建立中央 MOC，把具体决策分流到各自的总览页面。",
    finding:
      "A stable top-level map makes the system easier to navigate while details continue to evolve.",
    findingZh: "稳定的顶层地图让系统更容易进入，细节仍可以继续生长。",
    image: {
      src: "/images/lab-notes/knowledge-system/moc-display.jpg",
      width: 2000,
      height: 1217,
      alt: "Obsidian 中的知识宇宙总入口、六大区域和辅助整理面板。",
    },
  },
  {
    index: "NOTE 02",
    date: "2026.07.19",
    status: "OBSERVED",
    title: "See the system as a network.",
    titleZh: "把系统看成一张关系网络。",
    question:
      "What becomes visible when notes are viewed as relationships instead of folders?",
    questionZh: "当笔记不再只是文件夹，而被看作关系网络时，我们能看见什么？",
    method:
      "Inspect the Obsidian graph to compare dense clusters, bridges, and isolated notes.",
    methodZh: "查看 Obsidian 图谱，比较密集集群、桥接节点与孤立笔记。",
    finding:
      "The graph reveals where knowledge is connected and where the next round of organization should begin.",
    findingZh: "图谱让连接与断点都变得可见，也提示下一轮整理该从哪里开始。",
    image: {
      src: "/images/lab-notes/knowledge-system/graph.jpg",
      width: 1327,
      height: 768,
      alt: "Obsidian 知识图谱，紫色、粉色与蓝色节点形成多个关联集群。",
    },
  },
  {
    index: "NOTE 03",
    date: "2026.07.19",
    status: "TESTING",
    title: "Keep every import traceable.",
    titleZh: "让每一次导入都可以追溯。",
    question:
      "Can incoming material remain traceable as the knowledge system grows?",
    questionZh: "知识系统不断增长时，新资料还能保持来源可追溯吗？",
    method:
      "Record the source, import time, original format, preservation rule, and suggested next action.",
    methodZh: "记录来源、导入时间、原始格式、保留规则和下一步建议。",
    finding:
      "Provenance turns automatic organization into a process that can still be checked and reversed.",
    findingZh: "来源记录让自动整理仍然可以被检查，也可以回退。",
    image: {
      src: "/images/lab-notes/knowledge-system/auto-organizer.jpg",
      width: 1327,
      height: 768,
      alt: "Obsidian 自动整理记录，展示来源路径、导入时间、原文件类型和建议动作。",
    },
  },
] as const;

const members = [
  {
    index: "MEMBER 01",
    name: "罗天彪",
    role: "队长 · 探索者",
    roleEn: "Team Lead · Explorer",
    frameBasePath: "/images/members/frames/luo-tianbiao",
    modelSrc: "/models/luo-tianbiao-astronaut.glb",
    accent: "245, 202, 88",
    cameraOrbit: "90deg 75deg 150%",
  },
  {
    index: "MEMBER 02",
    name: "何欣",
    role: "守护者",
    roleEn: "Guardian",
    frameBasePath: "/images/members/frames/he-xin",
    modelSrc: "/models/he-xin-astronaut-bear.glb",
    accent: "205, 158, 92",
    cameraOrbit: "90deg 75deg 150%",
  },
  {
    index: "MEMBER 03",
    name: "陈江銮",
    role: "判断者",
    roleEn: "Evaluator",
    frameBasePath: "/images/members/frames/chen-jiangluan",
    modelSrc: "/models/chen-jiangluan-astronaut.glb",
    accent: "227, 141, 179",
    cameraOrbit: "90deg 75deg 150%",
  },
] as const;

const heroGradientColors = ["#353049", "#5560dd", "#e38db3"] as const;

export function SiteExperience() {
  const mainRef = useRef<HTMLElement | null>(null);
  const [activeHref, setActiveHref] = useState("#home");
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      const root = mainRef.current;

      if (!root) return;

      const motion = gsap.matchMedia(root);

      motion.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const compact = window.matchMedia("(max-width: 700px)").matches;
          const select = gsap.utils.selector(root);
          const travel = compact ? 16 : 24;
          const triggerStart = compact ? "top 88%" : "top 82%";
          const heroTargets = select(
            ".hero__eyebrow, .hero__title > span, .hero__official-name, .hero__statement, .hero__statement-zh, .hero__intro, .hero__intro-zh, .hero__actions, .hero__footer, .scroll-cue",
          );

          const heroTimeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              gsap.set(heroTargets, {
                clearProps: "transform,opacity,visibility",
              });
            },
          });

          heroTimeline
            .from(select(".hero__eyebrow"), {
              autoAlpha: 0,
              y: compact ? 8 : 12,
              duration: 0.32,
            })
            .from(
              select(".hero__title > span"),
              {
                autoAlpha: 0,
                y: compact ? 20 : 30,
                duration: 0.58,
                stagger: 0.07,
              },
              "-=0.2",
            )
            .from(
              select(".hero__official-name, .hero__statement, .hero__statement-zh"),
              { autoAlpha: 0, y: travel * 0.7, duration: 0.38, stagger: 0.04 },
              "-=0.3",
            )
            .from(
              select(".hero__intro, .hero__intro-zh"),
              { autoAlpha: 0, y: travel * 0.55, duration: 0.36, stagger: 0.04 },
              "-=0.25",
            )
            .from(
              select(".hero__actions"),
              { autoAlpha: 0, y: travel * 0.5, duration: 0.34 },
              "-=0.24",
            )
            .from(
              select(".hero__footer, .scroll-cue"),
              { autoAlpha: 0, y: 10, duration: 0.32, stagger: 0.05 },
              "-=0.22",
            );

          const reveal = (
            triggerSelector: string,
            targetSelector: string,
            stagger = 0.06,
          ) => {
            const trigger = select(triggerSelector)[0];
            const targets = select(targetSelector);

            if (!trigger || targets.length === 0) return;

            gsap.from(targets, {
              autoAlpha: 0,
              y: travel,
              duration: compact ? 0.46 : 0.58,
              ease: "power2.out",
              stagger,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger,
                start: triggerStart,
                once: true,
              },
            });
          };

          reveal(
            "#current-question",
            "#current-question .current-question__card > *",
            0.04,
          );

          reveal(
            "#featured-experiment",
            "#featured-experiment .section-heading > *, #featured-experiment .featured-experiment__layout > *",
            0.06,
          );
          reveal(
            "#featured-experiment .featured-experiment__orbit",
            "#featured-experiment .featured-experiment__orbit > *",
            0.04,
          );

          reveal("#story", "#story .section-heading > *");
          select("#story .story-item").forEach((item) => {
            gsap.from(item, {
              autoAlpha: 0,
              y: travel,
              duration: compact ? 0.46 : 0.58,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: item,
                start: triggerStart,
                once: true,
              },
            });
          });

          reveal("#lab-notes", "#lab-notes .section-heading > *");
          select("#lab-notes .scroll-stack-card").forEach((item) => {
            gsap.from(item, {
              autoAlpha: 0,
              y: travel,
              duration: compact ? 0.46 : 0.58,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: item,
                start: triggerStart,
                once: true,
              },
            });
          });

          reveal(
            "#exploration",
            "#exploration .section-heading > *",
          );
          reveal(
            "#exploration .magic-bento-grid",
            "#exploration .magic-bento-card",
            0.08,
          );

          reveal(
            "#members",
            "#members .section-heading > *, #members .members__intro",
          );
          reveal(
            "#members .profile-list",
            "#members .profile",
            0.05,
          );

          reveal("#projects", "#projects .section-heading > *");
          reveal(
            "#projects .projects-stage",
            "#projects .projects-stage",
            0,
          );
          reveal(
            "#projects .research-pipeline",
            "#projects .research-pipeline__intro > *, #projects .research-stepper > li, #projects .projects-empty",
            0.07,
          );

          reveal(
            "#contact",
            "#contact > .eyebrow, #contact > h2, #contact > .contact__title-zh, #contact > .contact__lead, #contact > .contact__lead-zh, #contact > .contact-grid, #contact > .contact__note",
            0.05,
          );
        },
      );

      return () => motion.revert();
    },
    { scope: mainRef },
  );

  useEffect(() => {
    const validHrefs = new Set<string>(
      pageSections.map((item) => item.href),
    );
    const syncFromHash = () => {
      if (validHrefs.has(window.location.hash)) {
        setActiveHref(window.location.hash);
      }
    };
    let alignmentFrame = 0;
    let settlementFrame = 0;
    const alignToHash = () => {
      const target = validHrefs.has(window.location.hash)
        ? document.querySelector<HTMLElement>(window.location.hash)
        : null;
      if (!target) return;

      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previousScrollBehavior;
    };
    const scheduleHashAlignment = () => {
      window.cancelAnimationFrame(alignmentFrame);
      window.cancelAnimationFrame(settlementFrame);
      alignmentFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        settlementFrame = window.requestAnimationFrame(alignToHash);
      });
    };
    const handleHashChange = () => {
      syncFromHash();
      scheduleHashAlignment();
    };
    const sections = pageSections
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null);
    const visibleSections = new Map<string, IntersectionObserverEntry>();
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                visibleSections.set(entry.target.id, entry);
              });

              const marker = window.innerHeight * 0.34;
              const candidates = Array.from(visibleSections.values()).filter(
                (entry) => entry.isIntersecting,
              );
              if (candidates.length === 0) return;

              const passedMarker = candidates
                .filter((entry) => entry.boundingClientRect.top <= marker)
                .sort(
                  (first, second) =>
                    second.boundingClientRect.top - first.boundingClientRect.top,
                );
              const nextEntry =
                passedMarker[0] ??
                candidates.sort(
                  (first, second) =>
                    first.boundingClientRect.top - second.boundingClientRect.top,
                )[0];

              if (nextEntry) setActiveHref(`#${nextEntry.target.id}`);
            },
            {
              rootMargin: "-20% 0px -68% 0px",
              threshold: 0,
            },
          );

    syncFromHash();
    scheduleHashAlignment();
    sections.forEach((section) => observer?.observe(section));
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(alignmentFrame);
      window.cancelAnimationFrame(settlementFrame);
      observer?.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (reducedMotion.matches || coarsePointer.matches) {
      return;
    }

    let frame = 0;
    const updatePointer = (event: PointerEvent) => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--pointer-x", x.toFixed(3));
        root.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const handleNavigation = (href: string) => {
    setActiveHref(href);
    setMenuOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳至主要内容
      </a>

      <div className="cosmos" aria-hidden="true">
        <div className="cosmos__glow cosmos__glow--violet" />
        <div className="cosmos__glow cosmos__glow--blue" />
        <div className="cosmos__grain" />
      </div>

      <header className="site-header">
        <nav className="nav-shell" aria-label="主导航">
          <a
            className="brand"
            href="#home"
            onClick={() => handleNavigation("#home")}
          >
            <span className="brand__mark" aria-hidden="true">
              宇
            </span>
            <span className="brand__name">宇航员</span>
          </a>

          <PillNav
            items={pillNavigation}
            activeHref={activeHref}
            className="nav-pill"
            ease="power2.easeOut"
            baseColor="rgba(5, 5, 9, 0.5)"
            pillColor="#f5f5f7"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#08080d"
            theme="dark"
            initialLoadAnimation={false}
            onNavigate={handleNavigation}
          />

          <a
            className="nav-cta"
            href="#contact"
            onClick={() => handleNavigation("#contact")}
          >
            联系我们
          </a>

          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </nav>

        <div
          id="mobile-navigation"
          className="mobile-menu"
          data-open={menuOpen}
          aria-hidden={!menuOpen}
          hidden={!menuOpen}
        >
          {navigation.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNavigation(item.href)}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </div>
      </header>

      <main id="main-content" ref={mainRef}>
        <section id="home" className="hero" aria-labelledby="hero-title">
          <GalaxyBackground />

          <div className="hero__orbit" aria-hidden="true">
            <div className="orbit orbit--outer">
              <span className="orbit__node orbit__node--one" />
              <span className="orbit__node orbit__node--two" />
            </div>
            <div className="orbit orbit--middle">
              <span className="orbit__node orbit__node--three" />
            </div>
            <div className="orbit orbit--inner" />
            <div className="orbit__core" />
          </div>

          <div className="hero__content">
            <p className="eyebrow hero__eyebrow">
              <span lang="zh-CN">学生未来科技实验团队</span>
              <span className="hero__eyebrow-divider" aria-hidden="true">
                ·
              </span>
              <span lang="en">STUDENT-LED FUTURE TECHNOLOGY LAB</span>
            </p>

            <h1
              id="hero-title"
              className="hero__title hero__title--chinese"
            >
              <GradientText
                colors={heroGradientColors}
                animationSpeed={8}
                showBorder={false}
                className="hero__title-line"
              >
                宇航员
              </GradientText>
            </h1>

            <p className="hero__official-name" lang="en">
              ASTRONAUTS
            </p>

            <p className="hero__statement">
              <GradientText
                colors={heroGradientColors}
                animationSpeed={8}
                showBorder={false}
                className="hero__statement-gradient"
              >
                探索尚未发生的可能。
              </GradientText>
            </p>
            <p className="hero__statement-zh" lang="en">
              Explore what could be.
            </p>

            <p className="hero__intro">
              我们因好奇聚集，用 AI、数字技术与实验，寻找科技与人类未来的交汇点。
            </p>
            <p className="hero__intro-zh" lang="en">
              Young minds exploring where AI, digital technology, and humanity
              meet.
            </p>

            <div className="hero__actions">
              <SpecularButton
                as="a"
                href="#featured-experiment"
                size="lg"
                radius={16}
                tint="#ffffff"
                tintOpacity={0}
                blur={0}
                textColor="#08080d"
                lineColor="#ffffff"
                baseColor="#f5f5f7"
                intensity={0.8}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={180}
                autoAnimate={false}
              >
                查看我们的项目
                <span aria-hidden="true">↘</span>
              </SpecularButton>
              <a className="text-link" href="#story">
                我们的故事 <span lang="en">Our story</span>
              </a>
            </div>
          </div>

          <div className="hero__footer" aria-label="团队探索概览">
            <div>
              <strong>04</strong>
              <span>探索方向 · Fields</span>
            </div>
            <div>
              <strong>01</strong>
              <span>共同好奇 · Curiosity</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>未来可能 · Futures</span>
            </div>
          </div>

          <a
            className="scroll-cue"
            href="#current-question"
            aria-label="向下浏览当前探索问题"
          >
            <span aria-hidden="true" />
            继续向下
          </a>
        </section>

        <section
          id="current-question"
          className="current-question"
          aria-labelledby="current-question-title"
        >
          <SpotlightCard
            className="current-question__card"
            spotlightColor="rgba(85, 96, 221, 0.13)"
          >
            <div className="current-question__identity">
              <p className="eyebrow">CURRENT QUESTION · 当前问题</p>
              <span>OPEN INQUIRY 01</span>
            </div>

            <div className="current-question__copy">
              <h2 id="current-question-title">
                AI 如何拓展人的想象力，同时保留人的判断、创造与温度？
              </h2>
              <p lang="en">
                How can AI expand human imagination without replacing it?
              </p>
            </div>

            <dl className="current-question__meta">
              <div>
                <dt>状态 · STATUS</dt>
                <dd>
                  <span aria-hidden="true" /> 探索中
                </dd>
              </div>
              <div>
                <dt>更新 · UPDATED</dt>
                <dd>2026.07</dd>
              </div>
            </dl>

            <a className="current-question__link" href="#featured-experiment">
              查看这条问题 <span aria-hidden="true">↘</span>
            </a>
          </SpotlightCard>
        </section>

        <section
          id="featured-experiment"
          className="section featured-experiment"
          aria-labelledby="featured-experiment-title"
        >
          <div className="section-heading section-heading--stacked">
            <p className="eyebrow">01 — FEATURED EXPERIMENT</p>
            <div>
              <h2 id="featured-experiment-title">
                让排版，<br />
                配得上你的研究。
              </h2>
              <p className="section-heading__zh" lang="en">
                Let formatting do justice to your research.
              </p>
            </div>
            <p className="section-note">
              技术可以简化确定的部分，但不能掩盖仍需人工判断的边界。
              <span lang="en">
                Technology should make the safe part easier without hiding the
                part that still needs human judgment.
              </span>
            </p>
          </div>

          <article className="featured-experiment__layout">
            <div className="featured-experiment__content">
              <p className="status-label">
                <span aria-hidden="true" /> 原型验证中 · WORKING PROTOTYPE
              </p>
              <h3 lang="en">PaperFit</h3>
              <p className="featured-experiment__title-zh">论文格式安全修正工具</p>
              <p className="featured-experiment__question">
                本地工具怎样让论文格式修正更清楚，同时保留原文和人工判断？
              </p>
              <p className="featured-experiment__question-zh" lang="en">
                How can a local tool make academic formatting clearer without
                overwriting the original document?
              </p>

              <dl className="featured-experiment__meta">
                <div>
                  <dt>状态 · STATUS</dt>
                  <dd>原型测试中</dd>
                </div>
                <div>
                  <dt>时间 · TIMELINE</dt>
                  <dd>2026.07</dd>
                </div>
                <div>
                  <dt>参与者 · PARTICIPANTS</dt>
                  <dd>宇航员团队 · 共同完成</dd>
                </div>
              </dl>

              <div className="featured-experiment__insights">
                <div>
                  <h4>发现 · WHAT WE LEARNED</h4>
                  <p>
                    可安全修正和需要人工复核的项目，必须清楚分开。
                    <span lang="en">
                      Safe corrections and manual-review items must remain
                      visibly separate.
                    </span>
                  </p>
                </div>
                <div>
                  <h4>下一步 · NEXT</h4>
                  <p>
                    继续测试不同模板，让每一处修正边界都更容易检查。
                    <span lang="en">
                      Continue testing template variations and make every
                      correction boundary easier to inspect.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="featured-experiment__orbit">
            <p className="eyebrow">原型轨迹 · PROCESS ORBIT</p>
            <OrbitImages
              images={paperFitMedia}
              shape="ellipse"
              radiusX={340}
              radiusY={80}
              rotation={-8}
              duration={30}
              itemSize={120}
              responsive={true}
              radius={160}
              direction="normal"
              fill
              showPath
              paused={false}
              ariaLabel="PaperFit 原型过程图片轨道"
            />
          </div>
        </section>

        <section
          id="exploration"
          className="section exploration"
          aria-labelledby="exploration-title"
        >
          <div className="section-heading section-heading--stacked">
            <p className="eyebrow">02 — EXPLORATION</p>
            <div>
              <h2 id="exploration-title">
                四个方向，<br />
                没有标准答案。
              </h2>
              <p className="section-heading__zh" lang="en">
                Four directions. No final answers.
              </p>
            </div>
            <p className="section-note">
              这些方向是我们继续追问的坐标，不是已经完成的答案。
              <span lang="en">
                Coordinates for inquiry, not finished products.
              </span>
            </p>
          </div>

          <MagicBento
            items={explorationFields}
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={360}
            particleCount={12}
            glowColor="85, 96, 221"
            disableAnimations={false}
          />
        </section>

        <section id="story" className="section story" aria-labelledby="story-title">
          <div className="section-heading">
            <p className="eyebrow">03 — OUR STORY</p>
            <div>
              <h2 id="story-title">好奇，让我们走到一起。</h2>
              <p className="section-heading__zh" lang="en">
                Curiosity brought us here.
              </p>
            </div>
          </div>

          <ol className="story-list">
            {storySteps.map((step) => (
              <li key={step.index} className="story-item">
                <span className="story-item__index" aria-hidden="true">
                  {step.index}
                </span>
                <div className="story-item__line" aria-hidden="true">
                  <span />
                </div>
                <div className="story-item__content">
                  <h3>{step.titleZh}</h3>
                  <p className="story-item__title-zh" lang="en">
                    {step.title}
                  </p>
                  <p>{step.copyZh}</p>
                  <figure className="story-item__artifact">
                    <Image
                      src={step.artifact.src}
                      width={step.artifact.width}
                      height={step.artifact.height}
                      sizes="(max-width: 680px) 112px, 124px"
                      alt={step.artifact.alt}
                      unoptimized
                    />
                    <figcaption>
                      <span>真实档案 · ARCHIVE TRACE</span>
                      {step.artifact.label}
                    </figcaption>
                  </figure>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="lab-notes"
          className="section lab-notes"
          aria-labelledby="lab-notes-title"
        >
          <div className="section-heading section-heading--stacked">
            <p className="eyebrow">04 — LAB NOTES · PRODUCT 02</p>
            <div>
              <h2 id="lab-notes-title" className="lab-notes__title">
                <span>不只储存，</span>
                <span>还懂得牵线。</span>
              </h2>
              <p className="section-heading__zh" lang="en">
                Not just storage. A system that connects.
              </p>
            </div>
            <p className="section-note">
              我们把方法、观察和决定记下来，组成一套仍在生长的知识档案。
              <span lang="en">
                Methods, observations, and decisions from a living knowledge
                system.
              </span>
            </p>
          </div>

          <ScrollStack
            className="knowledge-stack"
            itemDistance={96}
            itemScale={0.03}
            itemStackDistance={26}
            stackPosition={112}
            baseScale={0.94}
            rotationAmount={0}
          >
            {labNotes.map((note) => (
              <ScrollStackItem
                key={note.index}
                itemClassName="knowledge-stack__card"
              >
                <div className="knowledge-stack__layout">
                  <div className="lab-note__copy">
                    <header>
                      <span>{note.index}</span>
                      <time dateTime="2026-07-19">{note.date}</time>
                      <span>{note.status}</span>
                    </header>
                    <h3>{note.titleZh}</h3>
                    <p className="lab-note__title-zh" lang="en">
                      {note.title}
                    </p>
                    <dl>
                      <div>
                        <dt>问题 · QUESTION</dt>
                        <dd>{note.questionZh}</dd>
                      </div>
                      <div>
                        <dt>方法 · METHOD</dt>
                        <dd>{note.methodZh}</dd>
                      </div>
                      <div>
                        <dt>发现 · FINDING</dt>
                        <dd>{note.findingZh}</dd>
                      </div>
                    </dl>
                  </div>
                  <figure className="knowledge-stack__media">
                    <Image
                      src={note.image.src}
                      width={note.image.width}
                      height={note.image.height}
                      sizes="(max-width: 680px) 100vw, 380px"
                      alt={note.image.alt}
                      unoptimized
                    />
                  </figure>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </section>

        <section
          id="members"
          className="section members"
          aria-labelledby="members-title"
        >
          <div className="section-heading">
            <p className="eyebrow">05 — MEMBERS</p>
            <div>
              <h2 id="members-title" className="members__title">
                认识每一位<span>探索者。</span>
              </h2>
              <p className="section-heading__zh" lang="en">
                Meet the explorers.
              </p>
            </div>
          </div>

          <p className="members__intro">
            <span>
              三种角色，共同把问题变成实验。这里先展示已经确认的成员信息。
            </span>
            <small lang="en">
              Three roles, one shared practice of turning questions into
              experiments.
            </small>
          </p>

          <div className="profile-list">
            {members.map((member) => (
              <details
                className="profile"
                key={member.name}
                open={activeMember === member.name}
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    setActiveMember(member.name);
                  } else {
                    setActiveMember((current) =>
                      current === member.name ? null : current,
                    );
                  }
                }}
              >
                <summary>
                  <span className="profile__index">{member.index}</span>
                  <span className="profile__portrait" aria-hidden="true">
                    <Image
                      src={`${member.frameBasePath}/01.webp`}
                      width={64}
                      height={64}
                      sizes="(max-width: 680px) 48px, 56px"
                      alt=""
                      unoptimized
                    />
                  </span>
                  <span className="profile__name">
                    {member.name}
                    <small>{member.roleEn}</small>
                  </span>
                  <span className="profile__field">
                    {member.role}
                    <small>广州华商学院</small>
                  </span>
                  <span className="profile__toggle" aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </summary>
                <div className="profile__details profile__details--verified">
                  {activeMember === member.name ? (
                    <MemberModel3D
                      key={member.modelSrc}
                      name={member.name}
                      modelSrc={member.modelSrc}
                      posterSrc={`${member.frameBasePath}/01.webp`}
                      accent={member.accent}
                      cameraOrbit={member.cameraOrbit}
                    />
                  ) : null}
                  <div className="profile__record">
                    <dl>
                      <div>
                        <dt>团队角色 · ROLE</dt>
                        <dd>{member.role}</dd>
                      </div>
                      <div>
                        <dt>学校 · SCHOOL</dt>
                        <dd>广州华商学院</dd>
                      </div>
                      <div>
                        <dt>当前参与 · CURRENT WORK</dt>
                        <dd>PaperFit · Knowledge Network · 团队共同成果</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section
          id="projects"
          className="section projects"
          aria-labelledby="projects-title"
        >
          <div className="section-heading section-heading--stacked">
            <p className="eyebrow">06 — PROJECTS</p>
            <div>
              <h2 id="projects-title">
                让想法，<br />
                找到栖息之地。
              </h2>
              <p className="section-heading__zh" lang="en">
                Let ideas find a place to land.
              </p>
            </div>
          </div>

          <div className="projects-stage">
            <div className="projects-stage__visual" aria-hidden="true">
              <span className="projects-stage__ring projects-stage__ring--one" />
              <span className="projects-stage__ring projects-stage__ring--two" />
              <span className="projects-stage__point" />
            </div>
            <div className="projects-stage__content">
              <p className="status-label">
                <span aria-hidden="true" /> 起步阶段 · CURRENT STAGE
              </p>
              <h3>未来实验空间</h3>
              <p className="projects-stage__title-zh" lang="en">
                Future Projects Space
              </p>
              <p>
                每个项目都由团队共同探索。我们从一个问题出发，记录尝试、发现，以及仍未解决的部分。
              </p>
              <p lang="en">
                Every project begins with a question and records what changed.
              </p>
              <div className="projects-stage__action">
                <SpecularButton
                  as="a"
                  href="#contact"
                  size="lg"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#f5f5f5"
                  lineColor="#ffffff"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                >
                  <span>一起探索</span>
                  <span className="projects-stage__action-zh" lang="en">
                    Explore with us <span aria-hidden="true">↘</span>
                  </span>
                </SpecularButton>
              </div>
            </div>
          </div>

          <div id="research-pipeline" className="research-pipeline">
            <div className="research-pipeline__intro">
              <p className="eyebrow">探索路径 · RESEARCH PIPELINE</p>
              <h3>一个想法，怎样一步步变成实验。</h3>
              <p lang="en">How an idea becomes a testable, documented experiment.</p>
            </div>

            <ResearchStepper
              steps={researchSteps}
              currentStep={1}
              className="research-stepper"
            />
          </div>

          <p className="projects-empty">
            <span>
              我们不急着发布尚未成熟的成果。等一个实验准备好了，它会出现在这里。
            </span>
            <small lang="en">
              Nothing rushed. When an experiment is ready to share, it will
              appear here.
            </small>
          </p>
        </section>

        <section
          id="contact"
          className="section contact"
          aria-labelledby="contact-title"
        >
          <div className="contact__glow" aria-hidden="true" />
          <p className="eyebrow">07 — CONTACT</p>
          <h2 id="contact-title">从一个问题开始。</h2>
          <p className="contact__title-zh" lang="en">
            Begin with a question.
          </p>
          <p className="contact__lead">
            如果你也在关注科技、教育、创造力和未来，欢迎告诉我们：你正在思考什么？
          </p>
          <p className="contact__lead-zh" lang="en">
            Questions about technology, education, creativity, or the future
            are welcome.
          </p>

          <div className="contact-grid" aria-label="宇航员团队联系渠道">
            <div>
              <span>EMAIL · 团队邮箱</span>
              <strong>
                <a href="mailto:207188250@qq.com">207188250@qq.com</a>
              </strong>
            </div>
            <div>
              <span>MOBILE · 联系电话</span>
              <strong>
                <a href="tel:+8618476511154">18476511154</a>
              </strong>
            </div>
            <div>
              <span>QQ · 即时联系</span>
              <strong>207188250</strong>
            </div>
            <div>
              <span>SCHOOL · 团队学校</span>
              <strong>广州华商学院</strong>
            </div>
          </div>

          <p className="contact__note">
            宇航员当前项目与实验记录均为团队共同成果。
            <span lang="en">
              ASTRONAUTS projects and Lab Notes are collective team work.
            </span>
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="brand brand--footer" href="#home">
          <span className="brand__mark" aria-hidden="true">
            宇
          </span>
          <span className="brand__name">宇航员</span>
        </a>
        <p>
          年轻的思想，开放的问题，尚未被定义的未来。
          <span lang="en">Young minds. Open questions. Possible futures.</span>
        </p>
        <a className="back-to-top" href="#home">
          返回顶部 <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}
