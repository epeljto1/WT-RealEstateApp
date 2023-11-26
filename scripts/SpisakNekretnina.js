let SpisakNekretnina = function() {
let listaNekretnina = [];
let listaKorisnika = [];

let init = function (nekretnine, korisnici)
{
    listaNekretnina = nekretnine;
    listaKorisnika = korisnici;
}

let filtrirajNekretnine = function (kriterij)
{
    let listaFiltriranihNekretnina = [...listaNekretnina];
    for(let i=listaFiltriranihNekretnina.length-1; i>=0; i--)
    {
        if(kriterij.tip_nekretnine !== undefined) {
        if(listaFiltriranihNekretnina[i].tip_nekretnine != kriterij.tip_nekretnine) {
        listaFiltriranihNekretnina.splice(i,1);
        continue; }
        }

        if(kriterij.min_kvadratura !== undefined) {
            if(listaFiltriranihNekretnina[i].kvadratura < kriterij.min_kvadratura) {
            listaFiltriranihNekretnina.splice(i,1);
            continue; }
        }

        if(kriterij.max_kvadratura !== undefined) {
            if(listaFiltriranihNekretnina[i].kvadratura > kriterij.max_kvadratura) {
            listaFiltriranihNekretnina.splice(i,1);
            continue; }
        }

        if(kriterij.min_cijena !== undefined) {
            if(listaFiltriranihNekretnina[i].cijena < kriterij.min_cijena) {
            listaFiltriranihNekretnina.splice(i,1);
            continue; }
        }

        if(kriterij.max_cijena !== undefined) {
            if(listaFiltriranihNekretnina[i].cijena > kriterij.max_cijena) {
            listaFiltriranihNekretnina.splice(i,1);
            continue; }
        }
    }
    return listaFiltriranihNekretnina;
}

let ucitajDetaljeNekretnine = function (id)
{
    let nekretnina = null;
    for(let i=0; i<listaNekretnina.length; i++)
    if(id == listaNekretnina[i].id)
    {
        nekretnina = listaNekretnina[i];
        break;
    }
    return nekretnina;
}

return {
    init: init,
    filtrirajNekretnine: filtrirajNekretnine,
    ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
}
};
