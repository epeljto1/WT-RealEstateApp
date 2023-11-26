function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    let nekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    // iscrtavanje elemenata u divReferenca element
     divReferenca.innerHTML = "";
    for(let i=0;i<nekretnine.length;i++) {
        const div = document.createElement("div");
        const img = document.createElement("img");
        div.appendChild(img);
        const naziv = document.createElement("p");
        naziv.className = "naziv";
        naziv.innerHTML = "<b>Naziv</b>: "+nekretnine[i].naziv;  
        div.appendChild(naziv);
        const kvadratura = document.createElement("p");
        kvadratura.className = "kvadratura";
        kvadratura.innerHTML = "<b>Kvadratura</b>: "+nekretnine[i].kvadratura+" m2";
        div.appendChild(kvadratura);
        const cijena = document.createElement("p");
        cijena.className = "cijena";
        cijena.innerHTML = "<b>Cijena</b>: "+nekretnine[i].cijena+" KM";
        div.appendChild(cijena);
        const form = document.createElement("form");
        form.action = "detalji.html";
        form.target = "_blank";
        const button = document.createElement("button");
        button.type = "submit";
        button.innerText = "DETALJI";
        form.appendChild(button);
        div.appendChild(form);
        divReferenca.appendChild(div);
    }
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp"); 

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

//instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

//pozivanje funkcije
spojiNekretnine(divStan,nekretnine,"Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");