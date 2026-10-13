/* Site behaviour. Every page renders without this file; it only adds:
   nav menu · reveals · video clips on scroll · book shelf controls · countdown · forms · dialogs. */

import { site } from "../data/site";

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.remove("no-js");

/* ---------- mobile menu ---------- */
const menuBtn = $<HTMLButtonElement>("#menuBtn"), nav = $("#nav");
if (menuBtn && nav) {
  const setMenu = (open: boolean) => {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  addEventListener("resize", () => { if (innerWidth > 860) setMenu(false); });
}

/* ---------- reveals ---------- */
if (!still && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".rv").forEach((el) => io.observe(el));
} else {
  $$(".rv").forEach((el) => el.classList.add("is-in"));
}

/* ---------- video clips: play only while visible, chain sequences ---------- */
const clips = $$<HTMLVideoElement>("video[data-seq]");
if (clips.length && !still) {
  clips.forEach((v) => {
    const seq = (v.dataset.seq || "").split(",").map((s) => s.trim()).filter(Boolean);
    let i = 0;
    v.muted = true; v.playsInline = true;
    v.loop = seq.length === 1;
    v.src = seq[0];
    if (seq.length > 1) v.addEventListener("ended", () => { i = (i + 1) % seq.length; v.src = seq[i]; v.play().catch(() => {}); });
  });
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.25 });
  clips.forEach((v) => vio.observe(v));
}

/* ---------- book shelf ---------- */
$$("[data-shelf]").forEach((shelf) => {
  const track = $(".shelf__track", shelf);
  const prev = $<HTMLButtonElement>("[data-prev]", shelf), next = $<HTMLButtonElement>("[data-next]", shelf), count = $("[data-count]", shelf);
  if (!track || !track.children.length) return;
  const cards = [...track.children] as HTMLElement[];
  const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  const pad = (n: number) => String(n).padStart(2, "0");
  const update = () => {
    const i = Math.min(cards.length - 1, Math.round(track.scrollLeft / step()));
    if (count) count.textContent = `${pad(i + 1)} / ${pad(cards.length)}`;
    if (prev) prev.disabled = track.scrollLeft < 4;
    if (next) next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
  };
  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();

  let drag: { x: number; left: number; moved: boolean } | null = null;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; track.classList.add("is-dragging"); }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => {
    if (!drag) return;
    const moved = drag.moved; drag = null;
    if (!moved) return;
    track.classList.remove("is-dragging");
    track.scrollTo({ left: Math.round(track.scrollLeft / step()) * step(), behavior: "smooth" });
  });
});

/* ---------- countdown ---------- */
$$("[data-countdown]").forEach((el) => {
  const target = new Date(el.dataset.countdown || "");
  if (isNaN(+target)) return;
  const cell = (k: string) => $(`[data-${k}]`, el);
  const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");
  const tick = () => {
    const diff = Math.max(0, +target - Date.now()) / 1000;
    const d = cell("d"), h = cell("h"), m = cell("m"), s = cell("s");
    if (d) d.textContent = pad(Math.floor(diff / 86400));
    if (h) h.textContent = pad(Math.floor(diff % 86400 / 3600));
    if (m) m.textContent = pad(Math.floor(diff % 3600 / 60));
    if (s) s.textContent = pad(Math.floor(diff % 60));
  };
  tick(); setInterval(tick, 1000);
});

/* ---------- forms: Web3Forms → mailto fallback ---------- */
$$<HTMLFormElement>("form[data-form]").forEach((form) => {
  const note = $("[data-note]", form);
  const done = form.parentElement?.querySelector<HTMLElement>("[data-done]");
  const subject = form.dataset.subject || `Message from ${site.url.replace(/^https?:\/\//, "")}`;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot
    const send = $<HTMLButtonElement>("[type=submit]", form);
    if (send) send.disabled = true;
    if (note) note.textContent = "Sending…";
    const fields: Record<string, string> = {};
    data.forEach((v, k) => { if (k !== "company") fields[k] = String(v); });
    try {
      if (!site.web3formsKey) throw new Error("no key");
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: site.web3formsKey, subject, from_name: "chiefazu.com", ...fields }),
      });
      if (!(await r.json()).success) throw new Error("web3forms");
      form.reset();
      if (done) { form.hidden = true; done.hidden = false; } else if (note) note.textContent = "Sent. Asante!";
    } catch {
      const body = Object.entries(fields).map(([k, v]) => `${k}: ${v || "-"}`).join("\n");
      location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (note) note.textContent = "Opening your email app…";
    } finally { if (send) send.disabled = false; }
  });
});

/* ---------- dialogs ---------- */
$$<HTMLButtonElement>("[data-open]").forEach((b) => b.addEventListener("click", () => {
  const dlg = $<HTMLDialogElement>(b.dataset.open || "");
  if (!dlg) return;
  const form = $<HTMLFormElement>("form", dlg), done = $("[data-done]", dlg);
  if (form) form.hidden = false;
  if (done) done.hidden = true;
  dlg.showModal();
}));
$$<HTMLDialogElement>("dialog").forEach((dlg) => {
  $$("[data-close]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
});
