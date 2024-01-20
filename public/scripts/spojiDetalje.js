function detalji(nekretnina)
{
    const osnovno = document.getElementById("osnovno");
    const naziv = document.createElement("p");
    naziv.innerHTML = "<b>Naziv</b>: </span>"+nekretnina.naziv+"<br>";
    osnovno.appendChild(naziv);
    const kvadratura = document.createElement("p");
    kvadratura.innerHTML = "<b>Kvadratura</b>: </span>"+nekretnina.kvadratura+" m2<br>";
    osnovno.appendChild(kvadratura);
    const cijena = document.createElement("p");
    cijena.innerHTML = "<b>Cijena</b>: </span>"+nekretnina.cijena+" KM<br>";
    osnovno.appendChild(cijena);
    
    const detalji = document.getElementById("detalji");
    const table = document.createElement("table");

    const red1 = document.createElement("tr");
    const tip = document.createElement("td");
    tip.innerHTML = "<span><b>Tip grijanja</b>: </span>"+nekretnina.tip_grijanja;
    red1.appendChild(tip);
    const godina = document.createElement("td");
    godina.innerHTML = "<span><b>Godina izgradnje</b>: </span>"+nekretnina.godina_izgradnje;
    red1.appendChild(godina);
    table.appendChild(red1);

    const red2 = document.createElement("tr");
    const lokacija = document.createElement("td");
    lokacija.innerHTML = "<span><b>Lokacija</b>: </span>"+nekretnina.lokacija;
    red2.appendChild(lokacija);
    const datum = document.createElement("td");
    datum.innerHTML = "<span><b>Datum objave</b>: </span>"+nekretnina.datum_objave;
    red2.appendChild(datum);
    table.appendChild(red2);

    const red3 = document.createElement("tr");
    red3.id = "opis";
    const opis = document.createElement("td");
    opis.colSpan = 2;
    opis.innerHTML = "<span><b>Opis</b>: </span>"+nekretnina.opis;
    red3.appendChild(opis);
    table.appendChild(red3);


    detalji.appendChild(table);

    const upiti = document.getElementById("upiti");
    const lista = document.createElement("ul");
    for (let el of nekretnina.upiti)
    {
        const e = document.createElement("li");
        e.innerHTML = "<span><b>"+el.korisnik.username+"</b></span><br><br>"+el.tekst_upita;
        lista.appendChild(e);
    }
    upiti.appendChild(lista);

}

var nekId = localStorage.getItem('nekId');
PoziviAjax.getNekretninaById(nekId,function(err,data){
    if(data)
    {
        detalji(data);
    }
})