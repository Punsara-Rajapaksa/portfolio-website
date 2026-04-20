const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const yearEl = document.getElementById("currentYear");
const revealElements = document.querySelectorAll(".reveal");
const scrollProgress = document.getElementById("scrollProgress");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const mediaLightbox = document.getElementById("mediaLightbox");
const lightboxBody = document.getElementById("lightboxBody");
const lightboxClose = document.getElementById("lightboxClose");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const copyToast = document.getElementById("copyToast");
const uiToast = document.getElementById("uiToast");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const spotlight = document.getElementById("spotlight");
const magneticNodes = document.querySelectorAll(".magnetic");
const glossyCards = document.querySelectorAll(".glossy-card");
const projectCards = document.querySelectorAll("#projectGrid .project-card");
const dynamicGreeting = document.getElementById("dynamicGreeting");

const STORAGE_THEME_KEY = "portfolio-theme";

let lastScrollY = window.scrollY;
let lastScrollTime = performance.now();
let scrollVelocity = 0;

const showToast = (message) => {
  if (!uiToast) {
    return;
  }

  uiToast.textContent = message;
  uiToast.classList.add("visible");
  window.setTimeout(() => uiToast.classList.remove("visible"), 1200);
};

const updateThemeButton = () => {
  if (!themeToggle) {
    return;
  }

  const darkModeEnabled = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggle.setAttribute("aria-label", darkModeEnabled ? "Switch to light mode" : "Switch to dark mode");
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  updateThemeButton();
};

const initializeTheme = () => {
  const storedTheme = localStorage.getItem(STORAGE_THEME_KEY);
  if (storedTheme) {
    applyTheme(storedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
};

initializeTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const darkModeEnabled = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = darkModeEnabled ? "light" : "dark";

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        applyTheme(nextTheme);
      });
    } else {
      applyTheme(nextTheme);
    }

    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (dynamicGreeting) {
  dynamicGreeting.textContent = "Hi. I am a full-stack developer focused on AI-powered applications. I design efficient, reliable systems that blend clean interfaces with intelligent functionality for real users.";
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.16 }
);

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${index * 70}ms`);
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", active);
      });
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => sectionObserver.observe(section));

const updateScrollStats = () => {
  const now = performance.now();
  const deltaTime = Math.max(16, now - lastScrollTime);
  const currentY = window.scrollY;
  scrollVelocity = Math.abs(currentY - lastScrollY) / deltaTime;
  lastScrollY = currentY;
  lastScrollTime = now;

  if (scrollProgress) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const width = total > 0 ? (currentY / total) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, width)}%`;
  }

  if (backToTop) {
    backToTop.classList.toggle("visible", currentY > 450);
  }

  document.documentElement.style.setProperty("--scroll-velocity", `${Math.min(scrollVelocity, 2.4)}`);
};

updateScrollStats();
window.addEventListener("scroll", updateScrollStats, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (copyEmailBtn && copyToast) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.getAttribute("data-email");
    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      copyToast.classList.add("visible");
      window.setTimeout(() => copyToast.classList.remove("visible"), 900);
    } catch {
      showToast("Copy failed");
    }
  });
}

if (mediaLightbox && lightboxBody && lightboxClose) {
  const inlineMediaVideos = Array.from(document.querySelectorAll(".media-grid video"));
  const previousMuteStates = new Map();

  const pauseAndMuteInlineVideos = () => {
    inlineMediaVideos.forEach((video) => {
      if (!previousMuteStates.has(video)) {
        previousMuteStates.set(video, video.muted);
      }

      video.muted = true;
      video.pause();
    });
  };

  const restoreInlineVideoMuteState = () => {
    inlineMediaVideos.forEach((video) => {
      if (previousMuteStates.has(video)) {
        video.muted = previousMuteStates.get(video);
      }
    });
    previousMuteStates.clear();
  };

  const closeLightbox = () => {
    const expandedVideo = lightboxBody.querySelector("video");
    if (expandedVideo) {
      expandedVideo.pause();
      expandedVideo.currentTime = 0;
    }

    lightboxBody.innerHTML = "";
    mediaLightbox.close();
    restoreInlineVideoMuteState();
  };

  const openLightbox = (node) => {
    const source = node.tagName === "IMG" ? node.src : node.querySelector("source")?.src;
    if (!source) {
      return;
    }

    pauseAndMuteInlineVideos();

    if (node.tagName === "IMG") {
      lightboxBody.innerHTML = `<img src="${source}" alt="Expanded project media" />`;
    } else {
      lightboxBody.innerHTML = `<video controls autoplay playsinline><source src="${source}" type="video/mp4" /></video>`;
    }

    mediaLightbox.showModal();
  };

  document.querySelectorAll(".media-grid img, .media-grid video").forEach((mediaNode) => {
    mediaNode.setAttribute("tabindex", "0");
    mediaNode.addEventListener("click", (event) => {
      if (mediaNode.tagName === "VIDEO") {
        event.preventDefault();
        event.stopPropagation();
      }
      openLightbox(mediaNode);
    });
    mediaNode.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(mediaNode);
      }
    });
  });

  inlineMediaVideos.forEach((video) => {
    video.addEventListener("play", () => {
      if (mediaLightbox.open) {
        video.pause();
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  mediaLightbox.addEventListener("click", (event) => {
    if (event.target === mediaLightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mediaLightbox.open) {
      closeLightbox();
    }
  });
}

const canPointerEffects = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canPointerEffects && cursorDot && cursorRing && spotlight) {
  let dotX = window.innerWidth / 2;
  let dotY = window.innerHeight / 2;
  let ringX = dotX;
  let ringY = dotY;

  const animateCursor = () => {
    ringX += (dotX - ringX) * 0.2;
    ringY += (dotY - ringY) * 0.2;

    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    spotlight.style.left = `${ringX}px`;
    spotlight.style.top = `${ringY}px`;

    window.requestAnimationFrame(animateCursor);
  };

  animateCursor();

  window.addEventListener("pointermove", (event) => {
    dotX = event.clientX;
    dotY = event.clientY;
  });

  document.querySelectorAll("a, button, .magnetic, .glossy-card").forEach((node) => {
    node.addEventListener("mouseenter", () => cursorRing.classList.add("is-hover"));
    node.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hover"));
  });
}

if (canPointerEffects) {
  magneticNodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      node.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    node.addEventListener("pointerleave", () => {
      node.style.transform = "translate(0, 0)";
    });
  });

  glossyCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
      card.style.boxShadow = `0 0 ${12 + scrollVelocity * 10}px color-mix(in srgb, var(--accent) 30%, transparent), var(--shadow-soft)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.boxShadow = "";
    });
  });
}

const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (canTilt) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      card.style.transition = "transform 0.02s linear, box-shadow 0.25s ease";
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 8;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transition = "transform 0.22s ease, box-shadow 0.25s ease";
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

document.querySelectorAll(".btn, button").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    button.style.transform = "scale(0.98)";

    const ripple = document.createElement("span");
    ripple.className = "button-ripple";
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 500);
  });

  button.addEventListener("pointerup", () => {
    button.style.transform = "";
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

projectCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 70}ms`;
});

document.addEventListener("keydown", (event) => {
  if (event.target && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
    return;
  }

  if (event.key.toLowerCase() === "t" && themeToggle) {
    themeToggle.click();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // Ignore service worker registration errors.
    });
  });
}
