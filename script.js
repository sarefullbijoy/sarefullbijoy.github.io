const sidebar = document.getElementById("sidebar");

document.getElementById("menuBtn").onclick = function () {
    sidebar.classList.add("active");
};

document.getElementById("closeBtn").onclick = function () {
    sidebar.classList.remove("active");
};

document.getElementById("themeBtn").onclick = function () {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        this.innerHTML = "☀️";
    }else{
        this.innerHTML = "🌙";
    }
};
