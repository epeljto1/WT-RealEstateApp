function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    let min_cijena = document.getElementById("minCijena").value;
    if(min_cijena==="") min_cijena = undefined;

    let max_cijena = document.getElementById("maxCijena").value;
    if(max_cijena==="") max_cijena = undefined;

    let min_kvadratura = document.getElementById("minKvadratura").value;
    if(min_kvadratura==="") min_kvadratura = undefined;

    let max_kvadratura = document.getElementById("maxKvadratura").value;
    if(max_kvadratura==="") max_kvadratura = undefined;

    let kriterij = {
        tip_nekretnine: tip_nekretnine,
        min_cijena: min_cijena,
        max_cijena: max_cijena,
        min_kvadratura: min_kvadratura,
        max_kvadratura: max_kvadratura
    };
    
    let nekretnine = instancaModula.filtrirajNekretnine(kriterij);
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

function filtriraj()
{
    PoziviAjax.getNekretnine(function(error,data){
        if(data) {
        //instanciranje modula
    let nekretnine = SpisakNekretnina();
    nekretnine.init(data, listaKorisnika);
    
    //pozivanje funkcije
    spojiNekretnine(divStan,nekretnine,"Stan");
    spojiNekretnine(divKuca, nekretnine, "Kuća");
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
        }
    
    })
    
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp"); 

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

let listaNekretnina = [];
PoziviAjax.getNekretnine(function(error,data){
    if(data) {
    listaNekretnina = data;
    //instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

//pozivanje funkcije
spojiNekretnine(divStan,nekretnine,"Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
    }

});
