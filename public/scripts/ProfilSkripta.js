document.getElementById("loginForm").addEventListener("submit", function (event) {
 event.preventDefault();
   const username = document.getElementById("username").value;
   const password = document.getElementById("password").value;
   PoziviAjax.postLogin(username,password,function(error,data){
    if(data)
    window.location.href="http://localhost:3000/nekretnine.html";
   });
 });