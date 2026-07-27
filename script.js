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

function openSidebar(){

    if(!sidebar) return;

    sidebar.classList.add("active");

}


function closeSidebar(){

    if(!sidebar) return;

    sidebar.classList.remove("active");

}


if(menuBtn){

    menuBtn.addEventListener("click",openSidebar);

}


if(closeBtn){

    closeBtn.addEventListener("click",closeSidebar);

}



// Close when clicking outside

document.addEventListener("click",(event)=>{

    if(
        sidebar &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(event.target) &&
        menuBtn &&
        !menuBtn.contains(event.target)
    ){

        closeSidebar();

    }

});




//==================================================
//              ESC KEY
//==================================================

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        closeSidebar();

    }

});




//==================================================
//          CLOSE AFTER CLICK
//==================================================

const navLinks=document.querySelectorAll(".sidebar a");

navLinks.forEach(link=>{

    link.addEventListener("click",()=>{

        closeSidebar();

    });

});

//==================================================
//                  DARK MODE
//==================================================

const savedTheme = localStorage.getItem("theme");

const systemTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
);



//==================================================
//              APPLY THEME
//==================================================

function applyTheme(theme){

    if(theme === "dark"){

        body.classList.add("dark");

        if(themeBtn){

            themeBtn.textContent = "☀️";

        }

    }

    else{

        body.classList.remove("dark");

        if(themeBtn){

            themeBtn.textContent = "🌙";

        }

    }

}



//==================================================
//          INITIAL THEME
//==================================================

if(savedTheme){

    applyTheme(savedTheme);

}

else{

    applyTheme(

        systemTheme.matches
        ? "dark"
        : "light"

    );

}



//==================================================
//          TOGGLE BUTTON
//==================================================

if(themeBtn){

    themeBtn.addEventListener("click",()=>{

        const nextTheme =

            body.classList.contains("dark")
            ? "light"
            : "dark";

        applyTheme(nextTheme);

        localStorage.setItem(

            "theme",

            nextTheme

        );

    });

}



//==================================================
//      FOLLOW SYSTEM THEME
//==================================================

systemTheme.addEventListener("change",(event)=>{

    if(localStorage.getItem("theme")) return;

    applyTheme(

        event.matches
        ? "dark"
        : "light"

    );

});

//==================================================
//          SCROLL ANIMATION
//==================================================


const animatedElements = document.querySelectorAll(
    ".fade-up, .fade-left, .fade-right, .scale-in"
);



const observer = new IntersectionObserver(

    (entries)=>{

        entries.forEach(entry=>{


            if(entry.isIntersecting){

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translate(0,0)";

                observer.unobserve(entry.target);

            }


        });


    },

    {

        threshold:0.15

    }

);



animatedElements.forEach(element=>{

    element.style.opacity="0";

    observer.observe(element);

});





//==================================================
//          SMOOTH SCROLL
//==================================================


const anchors = document.querySelectorAll(
    'a[href^="#"]'
);



anchors.forEach(anchor=>{


    anchor.addEventListener(
        "click",
        function(event){


            const target =
            document.querySelector(
                this.getAttribute("href")
            );


            if(target){


                event.preventDefault();


                target.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });


            }


        }

    );


});





//==================================================
//          ACTIVE NAVIGATION
//==================================================


const sections =
document.querySelectorAll(
    "section[id]"
);



const navItems =
document.querySelectorAll(
    ".sidebar a"
);





//==================================================
//          SCROLL TO TOP
//==================================================

#scrollTopBtn{

    position:absolute;

    left:50%;

    top:0;

    transform:translate(-50%,-50%);

    width:70px;

    height:70px;

    border:none;

    border-radius:22px;

    background:var(--primary);

    color:#fff;

    font-size:28px;

    cursor:pointer;

    display:flex;

    align-items:center;

    justify-content:center;

    box-shadow:0 12px 30px rgba(0,0,0,.25);

    transition:.3s;

}

#scrollTopBtn:hover{

    transform:translate(-50%,-58%);

}

body.dark #scrollTopBtn{

    background:#2563eb;

}
//==================================================
//          CURRENT YEAR FOOTER
//==================================================


const year =
document.querySelector(
    ".current-year"
);



if(year){

    year.textContent =
    new Date().getFullYear();

}
