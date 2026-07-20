const galleryImages = document.querySelectorAll(".gallery img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

galleryImages.forEach(img=>{

    img.onclick=function(){

        lightbox.style.display="flex";
        lightboxImg.src=this.src;

    };

});

closeLightbox.onclick=function(){

    lightbox.style.display="none";

};

lightbox.onclick=function(e){

    if(e.target===lightbox){

        lightbox.style.display="none";

    }

};
// Load saved theme
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark");
}
