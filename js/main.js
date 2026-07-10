/* ============================================================
   NAILS BY ASHLEY — page behaviour
   - Lenis smooth scrolling
   - loader curtain + hero headline reveal
   - scroll-reveals (IntersectionObserver)
   - sticky nav state + mobile menu
   - spotlight hover on service cards
   - lazy-loads the Three.js lacquer scene when it nears view
   ============================================================ */

import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.14/+esm";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- smooth scrolling ---------- */
let lenis = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

function scrollToTarget(el) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.3 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ---------- loader curtain ---------- */
const loader = document.getElementById("loader");
document.body.style.overflow = "hidden";

function lift() {
  document.body.classList.add("is-ready");   // fires the hero headline
  document.body.style.overflow = "";
  if (loader) loader.classList.add("is-done");
}
window.setTimeout(lift, reduceMotion ? 200 : 1800);

/* ---------- sticky nav ---------- */
const nav = document.getElementById("nav");
function onScroll(y) {
  const past = (y ?? window.scrollY) > window.innerHeight * 0.8;
  nav.classList.toggle("is-scrolled", past);
}
if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
window.addEventListener("scroll", () => onScroll(), { passive: true });
onScroll();

/* ---------- anchor links (smooth) ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
  });
});

/* ---------- mobile menu ---------- */
const burger = document.getElementById("burger");
const links = document.querySelector(".nav__links");
function closeMenu() {
  if (!links) return;
  links.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
}
burger?.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});

/* ---------- scroll reveals ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || "0");
      el.style.transitionDelay = `${delay}s`;
      el.classList.add("is-in");
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- spotlight hover on cards ---------- */
document.querySelectorAll("[data-spotlight]").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- keep muted videos playing (some browsers pause on load) ---------- */
document.querySelectorAll("video").forEach((v) => {
  const tryPlay = () => v.play().catch(() => {});
  if (v.readyState >= 2) tryPlay();
  v.addEventListener("canplay", tryPlay, { once: true });
});

/* ---------- lazy-load the Three.js lacquer scene ---------- */
const canvas = document.getElementById("scene");
if (canvas) {
  const sceneObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      sceneObserver.disconnect();
      import("./scene.js")
        .then((m) => m.initScene(canvas))
        .catch((err) => console.warn("3D scene failed to load:", err));
    },
    { rootMargin: "600px 0px" }   // start loading a bit before it appears
  );
  sceneObserver.observe(canvas);
}
