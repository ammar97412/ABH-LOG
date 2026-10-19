/* ==========================================================================
   ABH-LOGISTIC — Scripts du site
   ========================================================================== */

/* ---- Configuration : à adapter avant la mise en ligne ---- */
const CONFIG = {
  // Adresse qui reçoit les demandes si aucun service de formulaire n'est configuré
  email: "contact@abh-logistic.com",
  // Numéro WhatsApp au format international, sans "+" ni espaces
  // Laisser vide tant que le numéro n'est pas connu : les boutons WhatsApp sont alors masqués.
  whatsapp: "",
  // Point d'envoi des formulaires (ex. Formspree : "https://formspree.io/f/xxxxxx").
  // Laisser vide pour ouvrir la messagerie du visiteur avec le message prérempli.
  formEndpoint: ""
};

document.documentElement.classList.add("js");

/* ---- En-tête : ombre au défilement + menu mobile ---- */
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const toTop = document.querySelector(".to-top");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 10);
  toTop?.classList.toggle("is-visible", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
});
nav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  })
);
toTop?.addEventListener("click", () => window.scrollTo({ top: 0 }));

/* ---- Liens WhatsApp ---- */
document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  if (!CONFIG.whatsapp) { a.hidden = true; return; }
  const text = a.getAttribute("data-whatsapp") || "Bonjour ABH-LOGISTIC, je souhaite des informations.";
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---- Année du pied de page ---- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---- Compteurs animés ---- */
const counters = document.querySelectorAll("[data-count]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function runCounter(el) {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduce) return;
  const start = performance.now();
  const dur = 1600;
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("fr-FR") + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---- Apparition au défilement : seuls les blocs hors écran au chargement sont masqués ---- */
if ("IntersectionObserver" in window && !reduce && !location.hash) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.remove("is-pending");
        if (e.target.matches("[data-count]")) runCounter(e.target);
        e.target.querySelectorAll?.("[data-count]").forEach(runCounter);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("is-pending");
    io.observe(el);
  });
  counters.forEach((c) => { if (!c.closest(".reveal")) io.observe(c); });
}

/* ---- Formulaires (contact, devis) ---- */
function validate(form) {
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = f.type === "email" ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) : !f.value.trim();
    f.setAttribute("aria-invalid", bad ? "true" : "false");
    if (bad && ok) { f.focus(); ok = false; }
  });
  return ok;
}

function formToText(form) {
  const lines = [];
  new FormData(form).forEach((v, k) => {
    if (String(v).trim() && k !== "_gotcha") {
      const label = form.querySelector(`[name="${k}"]`)?.dataset.label || k;
      lines.push(`${label} : ${v}`);
    }
  });
  return lines.join("\n");
}

document.querySelectorAll("form[data-form]").forEach((form) => {
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.querySelector('[name="_gotcha"]')?.value) return; // piège anti-spam
    if (!validate(form)) {
      status.className = "form-status is-error";
      status.textContent = "Merci de compléter les champs obligatoires signalés en rouge.";
      return;
    }
    const subject = form.dataset.subject || "Demande depuis le site";
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;

    if (CONFIG.formEndpoint) {
      try {
        const res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: (() => { const d = new FormData(form); d.append("_subject", subject); return d; })()
        });
        if (!res.ok) throw new Error();
        status.className = "form-status is-success";
        status.textContent = form.dataset.success || "Votre demande a bien été envoyée. Notre équipe vous répond sous 24 h ouvrées.";
        form.reset();
      } catch {
        status.className = "form-status is-error";
        status.textContent = `L'envoi n'a pas abouti. Réessayez ou écrivez-nous à ${CONFIG.email}.`;
      }
    } else {
      const body = formToText(form);
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = "form-status is-success";
      status.textContent = `Votre messagerie s'ouvre avec la demande préremplie. Si rien ne se passe, écrivez-nous à ${CONFIG.email}.`;
    }
    btn.disabled = false;
  });
  form.querySelectorAll("[required]").forEach((f) =>
    f.addEventListener("input", () => f.setAttribute("aria-invalid", "false"))
  );
});
