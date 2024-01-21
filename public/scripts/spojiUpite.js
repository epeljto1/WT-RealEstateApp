function upiti()
{
    const upiti = document.getElementById("upiti");
    const forma = document.createElement("form");
    const polje = document.createElement("input");
    polje.type = "text";
    polje.id = "upit";
    polje.name = "upit";
    forma.appendChild(polje);
    upiti.appendChild(forma);

    const dodaj = document.createElement("button");
    dodaj.type = "button";
    dodaj.innerText = "Pošalji upit";
    dodaj.onclick = function() {dodajupit()};
    upiti.appendChild(dodaj);
}

function dodajupit()
{
    var nekId = localStorage.getItem('nekId');
    const novi = document.getElementById("upit");
    PoziviAjax.postUpit(nekId,novi.value,function(err,data){});

}

PoziviAjax.getKorisnik(function(err,data){
    if(data)
    {
        upiti()
    }
})