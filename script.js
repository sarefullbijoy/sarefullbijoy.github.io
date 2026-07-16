const button = document.getElementById("themeBtn");

button.onclick = function(){

alert("Dark Mode Coming Soon");

}
const sidebar=document.getElementById("sidebar");

document.getElementById("menuBtn").onclick=function(){

sidebar.classList.add("active");

}

document.getElementById("closeBtn").onclick=function(){

sidebar.classList.remove("active");

}
