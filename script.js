//==================================================
//              BIJOY PORTFOLIO
//                 script.js
//==================================================
"use strict";

//==================================================
//              SELECT ELEMENTS
//==================================================
const body = document.body;
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const themeBtn = document.getElementById("themeBtn");

//==================================================
//              SIDEBAR
//==================================================
function openSidebar() {
  if (!sidebar) return;
  sidebar.classList.add("active");
}

function closeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove("active");
}

if (menuBtn) {
  menuBtn.addEventListener("click", openSidebar);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeSidebar);
}

// ক্লিক আউটসাইডে সাইডবার বন্ধ
document.addEventListener("click", (e) => {
  if (
    sidebar &&
    sidebar.classList.contains("active") &&
    !sidebar.contains(e.target) &&
    menuBtn &&
    !menuBtn.contains(e.target)
  ) {
    closeSidebar();
  }
});

// ESC চাপলে বন্ধ
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

// সাইডবারের লিংকে ক্লিক করলে বন্ধ
const navLinks = document.querySelectorAll(".sidebar a");
navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

//==================================================
//              DARK MODE
//==================================================
const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    if (themeBtn) themeBtn.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    if (themeBtn) themeBtn.textContent = "🌙";
  }
}

// প্রাথমিক থিম
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme(systemTheme.matches ? "dark" : "light");
}

// টগল বাটন
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

// সিস্টেম থিম পরিবর্তন হলে ফলো করা
systemTheme.addEventListener("change", (e) => {
  if (localStorage.getItem("theme")) return;
  applyTheme(e.matches ? "dark" : "light");
});

//==================================================
//              SCROLL TO TOP BUTTON
//==================================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  // বাটন দেখানো / লুকানোর ফাংশন
  const toggleScrollBtn = () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleScrollBtn);
  toggleScrollBtn(); // পেজ লোডের সময় চেক

  // ক্লিক ইভেন্ট
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

//==================================================
//              SCROLL ANIMATION
//==================================================
const animatedElements = document.querySelectorAll(
  ".fade-up, .fade-left, .fade-right, .scale-in"
);

if (animatedElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translate(0,0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    observer.observe(el);
  });
}

//==================================================
//              SMOOTH SCROLL FOR # LINKS
//==================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

//==================================================
//              ACTIVE NAV LINK (scroll spy)
//==================================================
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".sidebar a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

//==================================================
//              CURRENT YEAR IN FOOTER
//==================================================
const yearEl = document.querySelector(".current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
