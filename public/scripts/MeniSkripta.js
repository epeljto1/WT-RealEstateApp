PoziviAjax.getKorisnik(function(error,data){
    if(data)
    {
        const prijava = document.getElementById("prijava");
        const profil = document.getElementById("profil");
        if(prijava && profil) {
        prijava.innerHTML = '<a>Odjava</a>';
        profil.style.display = 'inline';
        }
    }
});
const odjava = document.getElementById("prijava");
odjava.addEventListener('click', function() {
    if(odjava.textContent=="Odjava")
   PoziviAjax.postLogout(function(error,data){
   if(data)
   {
    const odjava = document.getElementById("prijava");
    const profil = document.getElementById("profil");
    if(odjava && profil)
    {
      odjava.innerHTML = '<a href="prijava.html" target="_blank">Prijava</a>';
      profil.style.display = 'none';
    }
   }
});
});