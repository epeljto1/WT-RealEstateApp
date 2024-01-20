let novaListaStanova = [];
let novaListaKuca = [];
let novaListaPpa = [];
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
    if(kriterij.tip_nekretnine==="Stan") 
    novaListaStanova = [...nekretnine];
    else if (kriterij.tip_nekretnine==="Kuća")
    novaListaKuca = [...nekretnine];
    else if (kriterij.tip_nekretnine==="Poslovni prostor")
    novaListaPpa = [...nekretnine];
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
        const lokacija = document.createElement("p");
        lokacija.className = "lokacija";
        lokacija.innerHTML = "<b>Lokacija</b>: "+nekretnine[i].lokacija;
        div.appendChild(lokacija);
        const godina = document.createElement("p");
        godina.className = "godina";
        godina.innerHTML = "<b>Godina izgradnje</b>: "+nekretnine[i].godina_izgradnje;
        div.appendChild(godina);
        const detbut = document.createElement("button");
        detbut.type = "button";
        detbut.id = "det";
        detbut.innerText = "OTVORI DETALJE";
        div.appendChild(detbut);
        const form = document.createElement("form");
        const button = document.createElement("button");
        detbut.onclick = function() {otvoridetalje(nekretnine[i].id)};
        button.type = "button";
        button.innerText = "DETALJI";
        button.onclick = function() {detalji(nekretnine[i].id)};
        form.appendChild(button);
        div.appendChild(form);
        const pretraga = document.createElement("div");
        pretraga.id = `pretrage-${nekretnine[i].id}`;
        pretraga.innerText = "PRETRAGE:";
        div.appendChild(pretraga);
        const klik = document.createElement("div");
        klik.id = `klikovi-${nekretnine[i].id}`;
        klik.innerText = "KLIKOVI:";
        div.appendChild(klik);
        div.id = `nekretnina-${nekretnine[i].id}`;
        divReferenca.appendChild(div);
    }
}

function razliciti(niz1,niz2)
{
    const pom1 = niz1.sort();
    const pom2 = niz2.sort();
    if(pom1.length!=pom2.length) return true;
    for(let i=0;i<pom1.length;i++)
    if(pom1[i]!==pom2[i]) return true;
    return false;
}

let listaNekretnina = [];

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
    const novaLista = [...novaListaStanova,...novaListaKuca,...novaListaPpa];
    const arr1 = listaNekretnina.map(obj => obj.id);
    const arr2 = novaLista.map(obj => obj.id);
    if(razliciti(arr1,arr2))
    MarketingAjax.novoFiltriranje(novaLista);
    else
    {
        Pom.filtriranje(novaLista);
    }
    listaNekretnina = novaLista;
        }
    })
    
}

function detalji(nekId)
{
    MarketingAjax.klikNekretnina(nekId);
    const nek = document.getElementById(`nekretnina-${nekId}`);
    nek.style.width = "500px";
    const lok = nek.querySelector('p.lokacija');
    lok.style.display = 'block';
    const god = nek.querySelector('p.godina');
    god.style.display = 'block';
    const det = nek.querySelector('#det');
    det.style.display = 'block';
}

function otvoridetalje(nekId)
{
    localStorage.setItem('nekId', nekId);
    window.location.href = 'detalji.html';
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


const divNek = document.getElementById("divNekretnine");
MarketingAjax.novoFiltriranje(listaNekretnina);
MarketingAjax.osvjeziPretrage(divNek);
MarketingAjax.osvjeziKlikove(divNek);
    }

});
