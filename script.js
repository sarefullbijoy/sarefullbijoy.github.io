/* =========================================================
   00. EARLY HANDLERS
   Registered before the original theme/language handlers, so
   they always run first in every browser (order-independent).
========================================================= */

(function () {

    const root = document.documentElement;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reduceMotion) return;

    const EASE = "cubic-bezier(.65, 0, .25, 1)";

    const circle = (x, y, r) =>
        `circle(${r}px at ${x}px ${y}px)`;

    const reach = (x, y) =>
        Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        ) + 8;

    const pointOf = (event, element) => {

        if (event.clientX || event.clientY) {
            return { x: event.clientX, y: event.clientY };
        }

        const box = element.getBoundingClientRect();

        return {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2
        };
    };

    /* THEME — circular wipe from the toggle
       (plain overlay: identical on desktop and mobile, no View Transitions) */

    const BG_LIGHT = "#fbfcfe";
    const BG_DARK = "#07111f";

    document
        .querySelectorAll("[data-theme-toggle]")
        .forEach((button) => {

            let bypass = false;
            let busy = false;

            button.addEventListener("click", (event) => {

                if (bypass) return;

                event.stopImmediatePropagation();
                event.preventDefault();

                if (busy) return;
                busy = true;

                const { x, y } = pointOf(event, button);
                const radius = reach(x, y);

                const goingDark =
                    root.getAttribute("data-theme") !== "dark";

                const wipe = document.createElement("div");
                wipe.className = "theme-wipe";
                wipe.setAttribute("aria-hidden", "true");
                wipe.style.background = goingDark ? BG_DARK : BG_LIGHT;
                document.body.appendChild(wipe);

                let switched = false;

                const finish = () => {

                    if (switched) return;
                    switched = true;

                    bypass = true;
                    button.click();
                    bypass = false;

                    const fade = wipe.animate(
                        [{ opacity: 1 }, { opacity: 0 }],
                        { duration: 420, easing: "ease", fill: "forwards" }
                    );

                    fade.onfinish = () => {
                        wipe.remove();
                        busy = false;
                    };

                    setTimeout(() => {
                        wipe.remove();
                        busy = false;
                    }, 900);
                };

                const grow = wipe.animate(
                    [
                        { clipPath: circle(x, y, 0) },
                        { clipPath: circle(x, y, radius) }
                    ],
                    { duration: 520, easing: EASE, fill: "forwards" }
                );

                grow.onfinish = finish;
                setTimeout(finish, 1000);

            }, true);
        });


    /* LANGUAGE SWITCH — staggered fade/blur swap */

    if (!reduceMotion) {

        document
            .querySelectorAll("[data-language-toggle]")
            .forEach((button) => {

                let busy = false;
                let bypass = false;

                button.addEventListener("click", (event) => {

                    if (bypass) return;

                    event.stopImmediatePropagation();
                    event.preventDefault();

                    if (busy) return;
                    busy = true;

                    const visible = Array
                        .from(document.querySelectorAll("[data-en][data-bn]"))
                        .filter((el) => {
                            const box = el.getBoundingClientRect();
                            return (
                                box.width > 0 &&
                                box.bottom > 0 &&
                                box.top < window.innerHeight
                            );
                        });

                    visible.forEach((el) => el.classList.add("lang-out"));
                    button.classList.add("is-switching");

                    setTimeout(() => {

                        visible.forEach((el) => {
                            el.classList.remove("lang-out");
                            el.classList.add("lang-in");
                        });

                        bypass = true;
                        button.click();
                        bypass = false;

                        void document.body.offsetWidth;

                        visible.forEach((el, i) => {
                            el.style.transitionDelay =
                                `${Math.min(i, 24) * 28}ms`;
                            el.classList.remove("lang-in");
                            el.classList.add("lang-show");
                        });

                        setTimeout(() => {
                            visible.forEach((el) => {
                                el.classList.remove("lang-show");
                                el.style.transitionDelay = "";
                            });
                            button.classList.remove("is-switching");
                            busy = false;
                        }, 600 + Math.min(visible.length, 24) * 28);

                    }, 230);

                }, true);
            });
    }



})();


/* =========================================================
   BIJOY PORTFOLIO — SCRIPT.JS
   v26.M2.4 + Lightbox Guard Fix
========================================================= */


/* =========================================================
   01. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       02. ELEMENTS
    ====================================================== */

    const menuButton =
        document.querySelector(
            "[data-menu-toggle]"
        );

    const navigation =
        document.querySelector(
            ".site-nav"
        );

    const themeButtons =
        document.querySelectorAll(
            "[data-theme-toggle]"
        );

    const languageButtons =
        document.querySelectorAll(
            "[data-language-toggle]"
        );

    const bilingualElements =
        document.querySelectorAll(
            "[data-en][data-bn]"
        );


    /* =====================================================
       03. MOBILE MENU
    ====================================================== */

    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    navigation.classList.toggle(
                        "is-open"
                    );


                menuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                menuButton.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close navigation"
                        : "Open navigation"
                );

            }
        );


        /* Close menu after navigation */

        const navigationLinks =
            navigation.querySelectorAll(
                "a"
            );


        navigationLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        navigation.classList.remove(
                            "is-open"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuButton.setAttribute(
                            "aria-label",
                            "Open navigation"
                        );

                    }
                );

            }
        );


        /* Close menu when clicking outside */

        document.addEventListener(
            "click",
            (event) => {

                const clickedInsideMenu =
                    navigation.contains(
                        event.target
                    );

                const clickedMenuButton =
                    menuButton.contains(
                        event.target
                    );


                if (
                    !clickedInsideMenu &&
                    !clickedMenuButton
                ) {

                    navigation.classList.remove(
                        "is-open"
                    );


                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    menuButton.setAttribute(
                        "aria-label",
                        "Open navigation"
                    );

                }

            }
        );

    }



    /* =====================================================
       04. THEME SYSTEM
    ====================================================== */

    let currentTheme =
        localStorage.getItem(
            "bijoy-theme"
        );


    /*
       If no saved theme exists,
       follow the user's system preference.
    */

    if (
        currentTheme !== "light" &&
        currentTheme !== "dark"
    ) {

        currentTheme =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";

    }


    function applyTheme() {

        document.documentElement.setAttribute(
            "data-theme",
            currentTheme
        );


        themeButtons.forEach(
            (button) => {

                const icon =
                    button.querySelector(
                        ".theme-icon"
                    );


                if (icon) {

                    icon.textContent =
                        currentTheme === "dark"
                            ? "☀"
                            : "◐";

                }


                button.setAttribute(
                    "aria-label",
                    currentTheme === "dark"
                        ? "Switch to light theme"
                        : "Switch to dark theme"
                );


                button.setAttribute(
                    "title",
                    currentTheme === "dark"
                        ? "Light theme"
                        : "Dark theme"
                );

            }
        );

    }


    applyTheme();


    themeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    currentTheme =
                        currentTheme === "dark"
                            ? "light"
                            : "dark";


                    localStorage.setItem(
                        "bijoy-theme",
                        currentTheme
                    );


                    applyTheme();

                }
            );

        }
    );



    /* =====================================================
       05. LANGUAGE SYSTEM
    ====================================================== */

    let currentLanguage =
        localStorage.getItem(
            "bijoy-language"
        );


    /*
       English is the default language.
    */

    if (
        currentLanguage !== "en" &&
        currentLanguage !== "bn"
    ) {

        currentLanguage = "en";

    }


    function applyLanguage() {

        bilingualElements.forEach(
            (element) => {

                const englishText =
                    element.getAttribute(
                        "data-en"
                    );

                const banglaText =
                    element.getAttribute(
                        "data-bn"
                    );


                if (
                    currentLanguage === "bn" &&
                    banglaText !== null
                ) {

                    element.textContent =
                        banglaText;

                } else if (
                    englishText !== null
                ) {

                    element.textContent =
                        englishText;

                }

            }
        );


        languageButtons.forEach(
            (button) => {

                button.textContent =
                    currentLanguage === "en"
                        ? "বাংলা"
                        : "English";


                button.setAttribute(
                    "aria-label",
                    currentLanguage === "en"
                        ? "Switch to Bangla"
                        : "Switch to English"
                );


                button.setAttribute(
                    "title",
                    currentLanguage === "en"
                        ? "Switch to Bangla"
                        : "Switch to English"
                );

            }
        );


        document.documentElement.lang =
            currentLanguage === "bn"
                ? "bn"
                : "en";

    }


    applyLanguage();


    languageButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    currentLanguage =
                        currentLanguage === "en"
                            ? "bn"
                            : "en";


                    localStorage.setItem(
                        "bijoy-language",
                        currentLanguage
                    );


                    applyLanguage();

                }
            );

        }
    );



    /* =====================================================
       06. CLOSE MOBILE MENU ON RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 760 &&
                navigation &&
                menuButton
            ) {

                navigation.classList.remove(
                    "is-open"
                );


                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

            }

        }
    );



    /* =====================================================
       07. REVEAL OBSERVER
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            "[data-reveal]"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        /*
           Fallback for older browsers.
        */

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }



    /* =====================================================
       08. CURRENT YEAR
    ====================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(
        (element) => {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =========================================================
       ART GALLERY — LIGHTBOX
       Guarded to prevent errors on pages without lightbox
    ========================================================= */

    const artLightbox =
        document.querySelector("#artLightbox");


    if (artLightbox) {

        const lightboxImage =
            document.querySelector("#lightboxImage");

        const lightboxTitle =
            document.querySelector("#lightboxTitle");

        const lightboxDate =
            document.querySelector("#lightboxDate");

        const lightboxClose =
            document.querySelector("#lightboxClose");

        const artItems =
            document.querySelectorAll(
                "[data-lightbox]"
            );


        artItems.forEach((item) => {

            item.addEventListener("click", () => {

                const image =
                    item.dataset.image;

                const title =
                    currentLanguage === "bn"
                        ? item.dataset.titleBn
                        : item.dataset.titleEn;

                const date =
                    currentLanguage === "bn"
                        ? item.dataset.dateBn
                        : item.dataset.dateEn;


                if (lightboxImage) {
                    lightboxImage.src = image;
                    lightboxImage.alt = title;
                }

                if (lightboxTitle) {
                    lightboxTitle.textContent = title;
                }

                if (lightboxDate) {
                    lightboxDate.textContent = date;
                }


                if (!artLightbox.open) {
                    artLightbox.showModal();
                }

            });

        });



        /* =========================================================
           CLOSE BUTTON
        ========================================================= */

        if (lightboxClose) {

            lightboxClose.addEventListener(
                "click",
                () => {

                    artLightbox.close();

                }
            );

        }



        /* =========================================================
           CLICK BACKDROP TO CLOSE
        ========================================================= */

        artLightbox.addEventListener(
            "click",
            (event) => {

                if (event.target === artLightbox) {

                    artLightbox.close();

                }

            }
        );



        /* =========================================================
           CLEAR IMAGE AFTER CLOSE
        ========================================================= */

        artLightbox.addEventListener(
            "close",
            () => {

                if (lightboxImage) {
                    lightboxImage.src = "";
                }

            }
        );

    }

});


/* =========================================================
   99. REFINEMENT LAYER (visual polish only)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const canHover =
        window.matchMedia(
            "(hover: hover)"
        ).matches;

    const header =
        document.querySelector(".site-header");


    /* SCROLL PROGRESS + HEADER DEPTH */

    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    let ticking = false;

    const onScroll = () => {

        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {

            const max =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const ratio =
                max > 0
                    ? Math.min(window.scrollY / max, 1)
                    : 0;

            bar.style.transform = `scaleX(${ratio})`;

            if (header) {
                header.classList.toggle(
                    "is-scrolled",
                    window.scrollY > 8
                );
            }

            ticking = false;
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();


    /* SCROLL REVEAL (below-the-fold only) */

    if (!reduceMotion && "IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -6% 0px"
            }
        );

        document
            .querySelectorAll("[data-reveal]")
            .forEach((el) => {

                if (el.closest(".hero")) return;

                if (
                    el.getBoundingClientRect().top <
                    window.innerHeight * 0.9
                ) return;

                el.classList.add("reveal-init");
                observer.observe(el);
            });
    }


    /* HOVER-ONLY EFFECTS */

    if (canHover) {

        document
            .querySelectorAll(".skill-card, .philosophy-card, .project-card")
            .forEach((card) => {
                card.addEventListener("pointermove", (e) => {
                    const box = card.getBoundingClientRect();
                    card.style.setProperty("--mx", `${e.clientX - box.left}px`);
                    card.style.setProperty("--my", `${e.clientY - box.top}px`);
                });
            });

        const visual = document.querySelector(".hero-visual");

        if (visual && !reduceMotion) {

            visual.addEventListener("pointermove", (e) => {
                const box = visual.getBoundingClientRect();
                const x = (e.clientX - box.left) / box.width - 0.5;
                const y = (e.clientY - box.top) / box.height - 0.5;
                visual.style.setProperty("--px", `${x * 14}px`);
                visual.style.setProperty("--py", `${y * 14}px`);
            });

            visual.addEventListener("pointerleave", () => {
                visual.style.setProperty("--px", "0px");
                visual.style.setProperty("--py", "0px");
            });
        }
    }


    /* NAV SCROLL-SPY (home page only) */

    const spyLinks = Array.from(
        document.querySelectorAll('.site-nav .nav-link[href^="#"]')
    );

    const homeLink =
        document.querySelector(
            '.site-nav .nav-link[aria-current="page"]'
        );

    const targets = spyLinks
        .map((a) => document.querySelector(a.getAttribute("href")))
        .filter(Boolean);

    if (homeLink && targets.length) {

        const spy = () => {

            const y = window.scrollY + 140;
            let current = null;

            targets.forEach((t) => {
                if (
                    y >= t.offsetTop &&
                    y < t.offsetTop + t.offsetHeight
                ) current = t.id;
            });

            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 4
            ) current = targets[targets.length - 1].id;

            spyLinks.forEach((a) => {
                a.classList.toggle(
                    "active",
                    a.getAttribute("href") === `#${current}`
                );
            });

            homeLink.classList.toggle(
                "active",
                y < targets[0].offsetTop
            );
        };

        window.addEventListener("scroll", spy, { passive: true });
        spy();
    }

});


/* =========================================================
   100. UPGRADE LAYER (visual polish only)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* BACK TO TOP */

    const topButton = document.createElement("button");

    topButton.type = "button";
    topButton.className = "back-to-top";
    topButton.setAttribute("aria-label", "Back to top");
    topButton.textContent = "↑";

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    });

    document.body.appendChild(topButton);


    /* TIMELINE LINE + ART DEPTH */

    const timeline =
        document.querySelector(".education-timeline");

    if (timeline) {
        if ("IntersectionObserver" in window && !reduceMotion) {
            const timelineObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            timeline.classList.add("tl-live");
                            timelineObserver.disconnect();
                        }
                    });
                },
                { threshold: 0.3 }
            );
            timelineObserver.observe(timeline);
        } else {
            timeline.classList.add("tl-live");
        }
    }

    const artFrame =
        document.querySelector(
            ".home-art-feature .art-image-frame"
        );

    let ticking = false;

    const onScroll = () => {

        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {

            topButton.classList.toggle(
                "is-shown",
                window.scrollY > 600
            );

            if (artFrame && !reduceMotion) {
                const box = artFrame.getBoundingClientRect();
                const offset =
                    box.top + box.height / 2 - window.innerHeight / 2;
                const shift =
                    Math.max(-16, Math.min(16, offset * -0.04));
                artFrame.style.setProperty("--ay", `${shift.toFixed(1)}px`);
            }

            ticking = false;
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

});


/* =========================================================
   101. PAGE + THEME TRANSITIONS
   Circular reveal that starts from the exact click point.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const EASE = "cubic-bezier(.65, 0, .25, 1)";
    const PT_KEY = "bijoy-pt";

    /*PT-HERE*/const here = { href: location.href, origin: location.origin, path: location.pathname, search: location.search };

    const tidy = (p) => p.replace(/index\.html$/, "");

    const circle = (x, y, r) =>
        `circle(${r}px at ${x}px ${y}px)`;

    const reach = (x, y) =>
        Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        ) + 8;

    const pointOf = (event, element) => {

        if (event.clientX || event.clientY) {
            return { x: event.clientX, y: event.clientY };
        }

        const box = element.getBoundingClientRect();

        return {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2
        };
    };

    const makeOverlay = () => {
        const overlay = document.createElement("div");
        overlay.className = "pt-overlay";
        overlay.setAttribute("aria-hidden", "true");
        document.body.appendChild(overlay);
        return overlay;
    };

    const save = (point) => {
        try {
            sessionStorage.setItem(PT_KEY, JSON.stringify(point));
        } catch (error) { }
    };

    const load = () => {
        try {
            const value = sessionStorage.getItem(PT_KEY);
            sessionStorage.removeItem(PT_KEY);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    };


    /* ARRIVAL — reveal the new page from the click point */

    /*PT-ENTER*/const arrival = load();

    if (arrival && !reduceMotion) {

        const { x, y } = arrival;
        const radius = reach(x, y);
        const overlay = makeOverlay();

        overlay.style.clipPath = circle(x, y, radius);
        root.classList.remove("pt-cover");

        const reveal = overlay.animate(
            [
                { clipPath: circle(x, y, radius) },
                { clipPath: circle(x, y, 0) }
            ],
            {
                duration: 700,
                delay: 60,
                easing: EASE,
                fill: "both"
            }
        );

        reveal.onfinish = () => overlay.remove();

    } else {
        root.classList.remove("pt-cover");
    }

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            root.classList.remove("pt-cover");
            document
                .querySelectorAll(".pt-overlay")
                .forEach((el) => el.remove());
        }
    });


    /* DEPARTURE — expand from the clicked link */

    document.addEventListener("click", (event) => {

        if (
            reduceMotion ||
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) return;

        const link =
            event.target.closest &&
            event.target.closest("a[href]");

        if (
            !link ||
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) return;

        let url;

        try {
            url = new URL(link.getAttribute("href"), here.href);
        } catch (error) {
            return;
        }

        if (
            !/^https?:$/.test(url.protocol) ||
            url.origin !== here.origin ||
            (
                tidy(url.pathname) === tidy(here.path) &&
                url.search === here.search
            )
        ) return;

        event.preventDefault();

        const { x, y } = pointOf(event, link);
        const radius = reach(x, y);
        const overlay = makeOverlay();

        let left = false;

        const leave = () => {
            if (left) return;
            left = true;
            /*PT-NAV*/save({ x, y }); window.location.href = url.href;
        };

        const cover = overlay.animate(
            [
                { clipPath: circle(x, y, 0) },
                { clipPath: circle(x, y, radius) }
            ],
            {
                duration: 600,
                easing: EASE,
                fill: "forwards"
            }
        );

        cover.onfinish = leave;
        setTimeout(leave, 1000);
    });

});


/* =========================================================
   102. TYPOGRAPHY + MOTION POLISH
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* STAGGERED ENTRANCES (below-the-fold groups) */

    if (!reduceMotion && "IntersectionObserver" in window) {

        const groupObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    const group = entry.target;
                    const items =
                        group.querySelectorAll(":scope > .st-item");

                    group.classList.add("is-in");
                    groupObserver.unobserve(group);

                    setTimeout(() => {
                        group.classList.remove("stagger-init", "is-in");
                        items.forEach((item) => {
                            item.classList.remove("st-item");
                            item.style.removeProperty("--i");
                        });
                    }, 1500 + items.length * 140);
                });
            },
            { threshold: 0.15 }
        );

        [
            ".skills-grid",
            ".education-timeline",
            ".social-links",
            ".art-grid",
            ".projects-grid"
        ].forEach((selector) => {

            document
                .querySelectorAll(selector)
                .forEach((group) => {

                    if (
                        group.getBoundingClientRect().top <=
                        window.innerHeight * 0.85
                    ) return;

                    const items = Array
                        .from(group.children)
                        .filter((el) => !el.hasAttribute("data-reveal"));

                    if (!items.length) return;

                    items.forEach((item, i) => {
                        item.classList.add("st-item");
                        item.style.setProperty("--i", i);
                    });

                    group.classList.add("stagger-init");
                    groupObserver.observe(group);
                });
        });
    }


    /* EASED ANCHOR SCROLL */

    const easeInOut = (t) =>
        t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

    document.addEventListener("click", (event) => {

        if (
            reduceMotion ||
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) return;

        const link =
            event.target.closest &&
            event.target.closest('a[href^="#"]');

        if (!link) return;

        const id = link.getAttribute("href").slice(1);
        const target = id ? document.getElementById(id) : null;

        if (!target) return;

        event.preventDefault();

        const header = document.querySelector(".site-header");
        const offset = (header ? header.offsetHeight : 0) + 8;

        const from = window.scrollY;
        const to = Math.max(
            0,
            target.getBoundingClientRect().top + window.scrollY - offset
        );
        const distance = to - from;

        const duration = Math.min(
            1100,
            Math.max(550, Math.abs(distance) * 0.55)
        );

        const startTime = performance.now();

        root.style.scrollBehavior = "auto";

        const step = (now) => {

            const progress = Math.min((now - startTime) / duration, 1);

            window.scrollTo(0, from + distance * easeInOut(progress));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                root.style.scrollBehavior = "";
                history.replaceState(null, "", `#${id}`);
            }
        };

        requestAnimationFrame(step);
    });

});


/* =========================================================
   103. EMAIL BOTTOM SHEET — name + message, composed
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const text = {
        en: {
            title: "Send a message",
            name: "Name",
            namePh: "Your name",
            message: "Message",
            messagePh: "Write your message…",
            send: "Open in email app",
            copy: "Copy address",
            copied: "Copied",
            close: "Close",
            error: "Please write a message first.",
            preparing: "Arranging your email…",
            opening: "Opening your email app",
            to: "To",
            subject: "Subject",
            greeting: "Hello Bijoy,",
            regards: "Regards,"
        },
        bn: {
            title: "বার্তা পাঠান",
            name: "নাম",
            namePh: "আপনার নাম",
            message: "বার্তা",
            messagePh: "আপনার বার্তা লিখুন…",
            send: "ইমেইল অ্যাপে খুলুন",
            copy: "ঠিকানা কপি করুন",
            copied: "কপি হয়েছে",
            close: "বন্ধ করুন",
            error: "অনুগ্রহ করে আগে একটি বার্তা লিখুন।",
            preparing: "আপনার ইমেইল সাজানো হচ্ছে…",
            opening: "ইমেইল অ্যাপ খোলা হচ্ছে",
            to: "প্রতি",
            subject: "বিষয়",
            greeting: "হ্যালো বিজয়,",
            regards: "শুভেচ্ছান্তে,"
        }
    };

    const strings = () =>
        root.lang === "bn" ? text.bn : text.en;

    let sheet = null;
    let backdrop = null;
    let ui = {};
    let lastFocus = null;
    let isOpen = false;
    let busy = false;
    let copyTimer = null;
    let mail = { address: "", subject: "" };

    const build = () => {

        backdrop = document.createElement("div");
        backdrop.className = "sheet-backdrop";

        sheet = document.createElement("div");
        sheet.className = "sheet";
        sheet.setAttribute("role", "dialog");
        sheet.setAttribute("aria-modal", "true");
        sheet.setAttribute("aria-labelledby", "sheet-title");
        sheet.tabIndex = -1;

        sheet.innerHTML = `
            <div class="sheet-head">
                <span class="sheet-grab" aria-hidden="true"></span>
                <h2 class="sheet-title" id="sheet-title"></h2>
                <p class="sheet-address"></p>
                <button class="sheet-close" type="button">×</button>
            </div>

            <form class="sheet-form" novalidate>
                <div class="sheet-field">
                    <label for="sheet-name"></label>
                    <input class="sheet-input" id="sheet-name" type="text"
                        autocomplete="name" enterkeyhint="next">
                </div>
                <div class="sheet-field">
                    <label for="sheet-message"></label>
                    <textarea class="sheet-input" id="sheet-message"
                        rows="4"></textarea>
                </div>
                <p class="sheet-error" role="alert"></p>
                <button class="sheet-btn primary" type="submit"></button>
                <button class="sheet-copy" type="button"></button>
            </form>

            <div class="sheet-preview" aria-live="polite">
                <p class="sheet-state"></p>
                <div class="sheet-mail">
                    <p><b data-k="to"></b><span class="v-to"></span></p>
                    <p><b data-k="subject"></b><span class="v-subject"></span></p>
                    <pre class="v-body"></pre>
                </div>
                <div class="sheet-progress"><i></i></div>
            </div>
        `;

        document.body.append(backdrop, sheet);

        ui = {
            head: sheet.querySelector(".sheet-head"),
            title: sheet.querySelector(".sheet-title"),
            address: sheet.querySelector(".sheet-address"),
            close: sheet.querySelector(".sheet-close"),
            form: sheet.querySelector(".sheet-form"),
            nameLabel: sheet.querySelector('label[for="sheet-name"]'),
            name: sheet.querySelector("#sheet-name"),
            messageLabel: sheet.querySelector('label[for="sheet-message"]'),
            message: sheet.querySelector("#sheet-message"),
            error: sheet.querySelector(".sheet-error"),
            send: sheet.querySelector(".sheet-btn.primary"),
            copy: sheet.querySelector(".sheet-copy"),
            state: sheet.querySelector(".sheet-state"),
            toKey: sheet.querySelector('[data-k="to"]'),
            subjectKey: sheet.querySelector('[data-k="subject"]'),
            vTo: sheet.querySelector(".v-to"),
            vSubject: sheet.querySelector(".v-subject"),
            vBody: sheet.querySelector(".v-body")
        };

        backdrop.addEventListener("click", close);
        ui.close.addEventListener("click", close);
        ui.copy.addEventListener("click", copyAddress);
        ui.form.addEventListener("submit", compose);

        ui.name.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                ui.message.focus();
            }
        });

        ui.message.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                compose(event);
            }
        });

        ui.message.addEventListener("input", () => {
            ui.message.classList.remove("is-error");
            ui.error.textContent = "";
        });

        sheet.addEventListener("keydown", (event) => {

            if (event.key !== "Tab") return;

            const items = Array.from(
                sheet.querySelectorAll("a[href], button, input, textarea")
            ).filter((el) => el.offsetParent !== null);

            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        /* swipe down to dismiss */

        let startY = null;
        let delta = 0;
        let startTime = 0;

        ui.head.addEventListener("pointerdown", (event) => {

            if (event.target.closest(".sheet-close")) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;

            startY = event.clientY;
            delta = 0;
            startTime = performance.now();
            ui.head.setPointerCapture(event.pointerId);
            sheet.style.transition = "none";
        });

        ui.head.addEventListener("pointermove", (event) => {

            if (startY === null) return;

            delta = Math.max(0, event.clientY - startY);
            sheet.style.transform = `translate(-50%, ${delta}px)`;
        });

        const release = () => {

            if (startY === null) return;

            const speed = delta / (performance.now() - startTime);

            startY = null;
            sheet.style.transition = "";
            sheet.style.transform = "";

            if (delta > 90 || speed > 0.6) close();

            delta = 0;
        };

        ui.head.addEventListener("pointerup", release);
        ui.head.addEventListener("pointercancel", release);
    };

    const fillText = () => {

        const t = strings();

        ui.title.textContent = t.title;
        ui.address.textContent = mail.address;
        ui.nameLabel.textContent = t.name;
        ui.name.placeholder = t.namePh;
        ui.messageLabel.textContent = t.message;
        ui.message.placeholder = t.messagePh;
        ui.send.textContent = t.send;
        ui.copy.textContent = t.copy;
        ui.toKey.textContent = t.to;
        ui.subjectKey.textContent = t.subject;
        ui.close.setAttribute("aria-label", t.close);
        ui.close.setAttribute("title", t.close);
    };

    function copyAddress() {

        const t = strings();

        const done = () => {
            ui.copy.textContent = t.copied;
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => {
                ui.copy.textContent = strings().copy;
            }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(mail.address)
                .then(done)
                .catch(() => { });
            return;
        }

        const field = document.createElement("textarea");
        field.value = mail.address;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();

        try {
            document.execCommand("copy");
            done();
        } catch (error) { }

        field.remove();
    }

    function compose(event) {

        event.preventDefault();

        if (busy) return;

        const t = strings();
        const message = ui.message.value.trim();
        const name = ui.name.value.trim();

        if (!message) {
            ui.message.classList.remove("is-error");
            void ui.message.offsetWidth;
            ui.message.classList.add("is-error");
            ui.error.textContent = t.error;
            ui.message.focus();
            return;
        }

        busy = true;

        const subject = name
            ? `${mail.subject} (${name})`
            : mail.subject;

        const lines = [t.greeting, "", message];

        if (name) {
            lines.push("", t.regards, name);
        }

        const body = lines.join("\r\n");

        const href =
            `mailto:${mail.address}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        ui.vTo.textContent = mail.address;
        ui.vSubject.textContent = subject;
        ui.vBody.textContent = lines.join("\n");
        ui.state.textContent = t.preparing;

        sheet.classList.add("is-composing");

        const wait = reduceMotion ? 250 : 1300;

        setTimeout(() => {

            ui.state.textContent = t.opening;
            sheet.classList.add("is-sent");

            window.location.href = href;

            setTimeout(() => {
                close();
                setTimeout(reset, 700);
            }, reduceMotion ? 300 : 1000);

        }, wait);
    }

    function reset() {
        sheet.classList.remove("is-composing", "is-sent");
        ui.message.value = "";
        ui.message.classList.remove("is-error");
        ui.error.textContent = "";
        busy = false;
    }

    function openSheet(href) {

        if (!sheet) build();

        const [address, query = ""] =
            href.replace(/^mailto:/i, "").split("?");

        const params = new URLSearchParams(query);

        mail = {
            address: decodeURIComponent(address),
            subject:
                params.get("subject") || "Message from Bijoy Portfolio"
        };

        fillText();

        lastFocus = document.activeElement;
        isOpen = true;

        root.classList.add("sheet-lock");

        void sheet.offsetWidth;

        backdrop.classList.add("is-open");
        sheet.classList.add("is-open");

        setTimeout(() => {
            if (!busy) ui.name.focus({ preventScroll: true });
        }, 420);
    }

    function close() {

        if (!isOpen) return;

        isOpen = false;

        backdrop.classList.remove("is-open");
        sheet.classList.remove("is-open");
        root.classList.remove("sheet-lock");

        if (lastFocus && lastFocus.focus) {
            lastFocus.focus({ preventScroll: true });
        }
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    });

    document.addEventListener("click", (event) => {

        const link =
            event.target.closest &&
            event.target.closest('a[href^="mailto:"]');

        if (!link || link.closest(".sheet")) return;

        event.preventDefault();
        openSheet(link.getAttribute("href"));

    }, true);

});


/* =========================================================
   104. SKELETONS + DRAMATIC REVEALS + WORD REVEAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* IMAGE SKELETONS */

    document.querySelectorAll("img").forEach((img) => {

        if (img.closest(".lightbox, .lightbox-image-wrap")) return;
        if (img.complete && img.naturalWidth > 0) return;

        const box =
            img.closest(
                ".profile-frame-inner, .art-image-frame, " +
                ".education-image, .institution-logo, .art-image"
            ) || img.parentElement;

        if (!box) return;

        box.classList.add("sk-loading");

        const finish = () => {
            box.classList.remove("sk-loading");
            box.classList.add("sk-done");
        };

        img.addEventListener("load", finish, { once: true });
        img.addEventListener("error", finish, { once: true });
    });


    /* PAGE SKELETON — mirrors the real layout of each page */

    const bar = (w, h, extra = "") =>
        `<span class="sk" style="width:${w};height:${h};${extra}"></span>`;

    const skeletonMarkup = () => {

        const header = `
            <div class="sk-header">
                <div class="container sk-header-inner">
                    ${bar("112px", "24px")}
                    <span class="sk-spacer"></span>
                    <span class="sk-navlinks">
                        ${bar("52px", "14px")}${bar("92px", "14px")}
                        ${bar("84px", "14px")}${bar("68px", "14px")}
                        ${bar("56px", "14px")}
                    </span>
                    ${bar("66px", "34px", "border-radius:999px")}
                    ${bar("38px", "38px", "border-radius:12px")}
                </div>
            </div>`;

        const heroText = (lines) => `
            ${bar("180px", "13px")}
            ${bar("min(92%, 560px)", "clamp(40px, 7vw, 68px)")}
            ${lines > 1 ? bar("min(64%, 400px)", "clamp(40px, 7vw, 68px)") : ""}
            ${bar("min(74%, 420px)", "22px", "margin-top:8px")}
            ${bar("100%", "13px")}
            ${bar("86%", "13px")}`;

        const pageHero = `
            <div class="container sk-pagehero">
                ${bar("170px", "13px")}
                ${bar("min(88%, 640px)", "clamp(40px, 7vw, 72px)")}
                ${bar("min(58%, 380px)", "clamp(40px, 7vw, 72px)")}
                ${bar("min(70%, 460px)", "14px", "margin-top:10px")}
            </div>`;

        let body;

        if (document.querySelector(".education-list")) {

            const entry = () => `
                <div class="sk-entry">
                    ${bar("84px", "34px")}
                    <div class="sk-card">
                        ${bar("100%", "100%", "min-height:150px;border-radius:16px")}
                        <div class="sk-card-text">
                            ${bar("90px", "12px")}
                            ${bar("80%", "24px")}
                            ${bar("100%", "12px")}
                            ${bar("66%", "12px")}
                        </div>
                    </div>
                </div>`;

            body = pageHero +
                `<div class="container sk-list">${entry()}${entry()}${entry()}</div>`;

        } else if (document.querySelector(".art-grid")) {

            const tile = () =>
                `<span class="sk sk-tile"></span>`;

            body = pageHero +
                `<div class="container sk-gallery">${tile().repeat(6)}</div>`;

        } else if (document.querySelector(".projects-page")) {

            const card = () => `
                <div class="sk-project">
                    ${bar("96px", "28px", "border-radius:999px")}
                    ${bar("70%", "34px", "margin-top:10px")}
                    ${bar("88%", "13px")}
                    ${bar("120px", "16px", "margin-top:auto")}
                </div>`;

            body = pageHero +
                `<div class="container sk-projects">${card()}${card()}</div>`;

        } else {

            body = `
                <div class="container sk-grid">
                    <div class="sk-col">${heroText(2)}
                        ${bar("230px", "34px", "border-radius:999px;margin-top:12px")}
                    </div>
                    <span class="sk sk-photo"></span>
                </div>
                <div class="container sk-about">
                    ${bar("150px", "13px")}
                    ${bar("min(70%, 520px)", "40px")}
                    ${bar("100%", "13px")}
                    ${bar("92%", "13px")}
                </div>
                <div class="container sk-cards">
                    <span class="sk sk-cardbox"></span>
                    <span class="sk sk-cardbox"></span>
                    <span class="sk sk-cardbox"></span>
                </div>`;
        }

        return header + body;
    };

    /* PAGE SKELETON — only if loading is genuinely slow */

    if (document.readyState !== "complete") {

        let page = null;

        const removePage = () => {

            if (!page) return;

            const node = page;
            page = null;

            node.classList.add("is-out");
            setTimeout(() => node.remove(), 650);
        };

        setTimeout(() => {

            if (document.readyState === "complete") return;

            page = document.createElement("div");
            page.className = "sk-page";
            page.setAttribute("aria-hidden", "true");

            page.innerHTML = skeletonMarkup();

            document.body.appendChild(page);

        }, 160);

        window.addEventListener("load", removePage, { once: true });
        setTimeout(removePage, 2600);
    }


    /* WORD-BY-WORD TITLES */

    const titles = Array.from(
        document.querySelectorAll(
            ".section-title, .education-hero h1, " +
            ".art-hero h1, .gallery-header h2"
        )
    );

    const split = (title) => {

        const words =
            title.textContent.trim().split(/\s+/);

        title.textContent = "";

        words.forEach((word, i) => {

            const outer = document.createElement("span");
            const inner = document.createElement("span");

            outer.className = "w";
            inner.className = "wi";
            inner.style.setProperty("--wi", i);
            inner.textContent = word;

            outer.appendChild(inner);
            title.appendChild(outer);
            title.appendChild(document.createTextNode(" "));
        });
    };

    if (titles.length && !reduceMotion) {

        const shown = new WeakSet();

        const titleObserver =
            "IntersectionObserver" in window
                ? new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add("is-in");
                                shown.add(entry.target);
                                titleObserver.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.4 }
                )
                : null;

        titles.forEach((title) => {

            title.classList.add("split-title");
            split(title);

            /* language swap rewrites the text — split it again */

            new MutationObserver(() => {

                if (title.querySelector(".w")) return;

                split(title);

                if (shown.has(title)) {
                    title.classList.add("is-in");
                }

            }).observe(title, { childList: true });

            if (titleObserver) {
                titleObserver.observe(title);
            } else {
                title.classList.add("is-in");
            }
        });
    }

});


/* =========================================================
   105. EDUCATION + ART PAGES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const canHover =
        window.matchMedia(
            "(hover: hover)"
        ).matches;


    /* EDUCATION — scroll-drawn timeline line */

    const list = document.querySelector(".education-list");

    if (list) {

        let pending = false;

        const draw = () => {

            const box = list.getBoundingClientRect();

            const progress = Math.min(
                1,
                Math.max(
                    0,
                    (window.innerHeight * 0.6 - box.top) / box.height
                )
            );

            list.style.setProperty("--p", progress.toFixed(3));
            pending = false;
        };

        const queue = () => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(draw);
        };

        window.addEventListener("scroll", queue, { passive: true });
        window.addEventListener("resize", queue);
        draw();
    }


    /* ART — gentle 3D tilt */

    if (canHover && !reduceMotion) {

        document.querySelectorAll(".art-item").forEach((item) => {

            const frame = item.querySelector(".art-image");

            if (!frame) return;

            item.addEventListener("pointermove", (event) => {

                const box = frame.getBoundingClientRect();
                const x = (event.clientX - box.left) / box.width - 0.5;
                const y = (event.clientY - box.top) / box.height - 0.5;

                frame.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
                frame.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
            });

            item.addEventListener("pointerleave", () => {
                frame.style.setProperty("--rx", "0deg");
                frame.style.setProperty("--ry", "0deg");
            });
        });
    }

});


/* =========================================================
   106. NAVIGATION ANIMATION — sliding hover indicator
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".site-nav");

    if (!nav) return;

    const links = Array.from(nav.querySelectorAll(".nav-link"));

    links.forEach((link, i) => link.style.setProperty("--ni", i));

    const indicator = document.createElement("span");
    indicator.className = "nav-indicator";
    indicator.setAttribute("aria-hidden", "true");
    nav.prepend(indicator);

    const desktop = window.matchMedia("(min-width: 761px)");

    const moveTo = (link) => {

        if (!link || !desktop.matches) {
            if (indicator.classList.contains("is-on")) {
                indicator.classList.remove("is-on");
            }
            return;
        }

        indicator.style.setProperty("--nx", `${link.offsetLeft}px`);
        indicator.style.setProperty("--nw", `${link.offsetWidth}px`);

        if (!indicator.classList.contains("is-on")) {
            indicator.classList.add("is-on");
        }
    };

    const current = () =>
        nav.querySelector(".nav-link.active") ||
        nav.querySelector('.nav-link[aria-current="page"]');

    links.forEach((link) => {
        link.addEventListener("pointerenter", () => moveTo(link));
        link.addEventListener("focus", () => moveTo(link));
    });

    nav.addEventListener("pointerleave", () => moveTo(current()));
    nav.addEventListener("focusout", () => moveTo(current()));

    new MutationObserver((records) => {

        /* ignore the indicator's own class changes (would loop forever) */

        if (records.every((r) => r.target === indicator)) return;

        if (!nav.matches(":hover")) moveTo(current());

    }).observe(nav, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
    });

    window.addEventListener("resize", () => moveTo(current()));

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => moveTo(current()));
    }

    moveTo(current());
});
