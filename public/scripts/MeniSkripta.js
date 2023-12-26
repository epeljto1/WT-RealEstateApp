PoziviAjax.getKorisnik(function(){});
const odjava = document.getElementById("prijava");
odjava.addEventListener('click', function() {
    if(odjava.textContent=="Odjava")
   PoziviAjax.postLogout(function(){});
});