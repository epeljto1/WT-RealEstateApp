const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija()
{
    var korisniciListaPromisea=[];
    var nekretnineListaPromisea=[];
    var upitiListaPromisea=[];
    return new Promise(function(resolve,reject){

        upitiListaPromisea.push(db.Upit.create({tekst_upita:'Nullam eu pede mollis pretium.'}));
        upitiListaPromisea.push(db.Upit.create({tekst_upita:'Phasellus viverra nulla.'}));
        upitiListaPromisea.push(db.Upit.create({tekst_upita:'Integer tincidunt.'}));

        Promise.all(upitiListaPromisea)
        .then(function(upiti){
            var upit1=upiti.filter(function(u){return u.tekst_upita==='Nullam eu pede mollis pretium.'})[0];
            var upit2=upiti.filter(function(u){return u.tekst_upita==='Phasellus viverra nulla.'})[0];
            var upit3=upiti.filter(function(u){return u.tekst_upita==='Integer tincidunt.'})[0];

            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 58,
                cijena: 232000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: "01.10.2023.", 
                opis: 'Sociis natoque penatibus.',
                klikovi: 0,
                pretrage: 0
            }).then(function(n){
                return n.setUpiti([upit1,upit2]).then(function(){
                    return new Promise(function(resolve,reject){resolve(n);});
                });
            }));

            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Poslovni prostor',
                naziv: 'Mali poslovni prostor',
                kvadratura: 20,
                cijena: 70000,
                tip_grijanja: 'struja',
                lokacija: 'Centar',
                godina_izgradnje: 2005,
                datum_objave: "20.08.2023.",
                opis: 'Magnis dis parturient montes.',
                klikovi: 0,
                pretrage: 0
            }).then(function(n){
                return n.setUpiti([upit3]).then(function(){
                    return new Promise(function(resolve,reject){resolve(n);});
                });
            }));
            Promise.all(nekretnineListaPromisea).then(function(){
                korisniciListaPromisea.push(db.Korisnik.create({ime:'Neko',prezime:'Nekic',username:'username1',password:'hashPassworda1'}).
                then(function(k){
                    return k.setUpiti([upit1]).then(function(){
                        return new Promise(function(resolve,reject){resolve(k);});
                    });
                }));
                korisniciListaPromisea.push(db.Korisnik.create({ime:'Neko2',prezime:'Nekic2',username:'username2',password:'hashPassworda2'}).
                then(function(k){
                    return k.setUpiti([upit2,upit3]).then(function(){
                        return new Promise(function(resolve,reject){resolve(k);});
                    });
                }));;
                Promise.all(korisniciListaPromisea).then(function(korisnici){resolve(korisnici);}).catch(function(err){console.log("Korisnici greska "+err);});

            }).catch(function(err){console.log("Nekretnine greska "+err);});
        })
        .catch(function(err){console.log("Upiti greska "+err);});
    })
}