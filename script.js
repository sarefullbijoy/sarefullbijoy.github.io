//==================================================
//              BIJOY PORTFOLIO - script.js
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
//              SIDEBAR MENU
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

// বাইরে ক্লিক করলে মেনু বন্ধ হবে
document.addEventListener("click", (event) => {
    if (
        sidebar &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(event.target) &&
        menuBtn &&
        !menuBtn.contains(event.target)
    ) {
        closeSidebar();
    }
});

// ESC কি চাপলে মেনু বন্ধ হবে
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebar();
    }
});

// মেনুর লিংকে ক্লিক করলে মেনু বন্ধ হবে
const navLinks = document.querySelectorAll(".sidebar a");
navLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
});

//==================================================
//                  DARK MODE
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

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme(systemTheme.matches ? "dark" : "light");
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const nextTheme = body.classList.contains("dark") ? "light" : "dark";
        applyTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    });
}

systemTheme.addEventListener("change", (event) => {
    if (localStorage.getItem("theme")) return;
    applyTheme(event.matches ? "dark" : "light");
});

//==================================================
//          SCROLL ANIMATION (FADE UP)
//==================================================
const animatedElements = document.querySelectorAll(
    ".fade-up, .fade-left, .fade-right, .scale-in"
);

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

animatedElements.forEach((element) => {
    element.style.opacity = "0";
    observer.observe(element);
});

//==================================================
//          CURRENT YEAR FOOTER
//==================================================
const year = document.querySelector(".current-year");
if (year) {
    year.textContent = new Date().getFullYear();
                         }<img src="primary.jpg"
                 alt="Primary School">
