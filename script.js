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
