const express = require('express');
const session = require("express-session");
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true
 }));

app.get('/meni.html',function(req,res){
    res.sendFile(path.join(__dirname,'public','html','meni.html'));
});

app.get('/detalji.html',function(req,res){
    res.sendFile(path.join(__dirname,'public','html','detalji.html'));
});

app.get('/nekretnine.html',function(req,res){
    res.sendFile(path.join(__dirname,'public','html','nekretnine.html'));
});

app.get('/prijava.html',function(req,res){
    res.sendFile(path.join(__dirname,'public','html','prijava.html'));
});

app.get('/profil.html',function(req,res){
    res.sendFile(path.join(__dirname,'public','html','profil.html'));
});

fs.readFile(path.join(__dirname,'public','data','korisnici.json'),function(err,data){
    if(err) throw err;
    const korisnici = JSON.parse(data);

    const hashPromises = korisnici.map((korisnik) => {
        return new Promise((resolve, reject) => {
            if(!korisnik.password.startsWith('$2b$')) {
            bcrypt.hash(korisnik.password, 10, function (err, hash) {
                if (err) throw err;
                korisnik.password = hash;
                resolve();
            });
        }
        else {resolve();}
        });
    });

    Promise.all(hashPromises)
    .then(() => {
        fs.writeFile(path.join(__dirname, 'public', 'data', 'korisnici.json'), JSON.stringify(korisnici,null,2), function (err) {
            if (err) throw err;
        });
    })
})

app.post('/login',function(req,res){
    fs.readFile(path.join(__dirname,'public','data','korisnici.json'),function(err,data){
        if(err) throw err;
        const korisnici = JSON.parse(data);

        const korisnik = korisnici.find(k => k.username == req.body.username);
        if(korisnik)
        {
            bcrypt.compare(req.body.password,korisnik.password,function(err,result){
                if(err) throw err;
        if(result){
        req.session.username = korisnik.username;
        res.status(200).json({"poruka":"Uspješna prijava"});
            }
            else
            res.status(401).json({"greska":"Neuspješna prijava"})
        })}
        else 
        res.status(401).json({"greska":"Neuspješna prijava"});
    })
})

app.post('/logout',function(req,res)
{
    if(req.session.username)
    {
        req.session.username=null;
        res.status(200).json({"poruka":"Uspješno ste se odjavili"});
    }
    else
    res.status(401).json({"greska":"Neautorizovan pristup"});
})

app.get('/korisnik',function(req,res){
    fs.readFile(path.join(__dirname,'public','data','korisnici.json'),function(err,data){
        if(err) throw err;
        if(req.session.username==null)
        res.status(401).json({"greska":"Neautorizovan pristup"});
        else {
        const korisnici = JSON.parse(data);
        const korisnik = korisnici.find(k => k.username == req.session.username);
        res.status(200).json(korisnik);
        }
    })
})

app.post('/upit',function(req,res){
    fs.readFile(path.join(__dirname,'public','data','korisnici.json'),function(err,datak){
        if(err) throw err;
        if(req.session.username==null)
        res.status(401).json({"greska":"Neautorizovan pristup"});
        else
        {
            const korisnici = JSON.parse(datak);
            korisnik = korisnici.find(k => k.username == req.session.username);
            fs.readFile(path.join(__dirname,'public','data','nekretnine.json'),function(err,datan){
                if(err) throw err;
                const nekretnine = JSON.parse(datan);
                const nekretnina = nekretnine.find(n => n.id == req.body.nekretnina_id);
                if(nekretnina)
                {
                    const noviUpit = {
                        korisnik_id : korisnik.id,
                        tekst_upita : req.body.tekst_upita
                    };
                    (nekretnina.upiti).push(noviUpit);
                    fs.writeFile(path.join(__dirname, 'public', 'data', 'nekretnine.json'), JSON.stringify(nekretnine,null,2), function (err) {
                        if (err) throw err;
                        res.status(200).json({"poruka":"Upit je uspješno dodan"});
                    });
                }
                else
                res.status(400).json({"greska":`Nekretnina sa id-em ${req.body.nekretnina_id} ne postoji`});
            })
        }
    })
})

app.put('/korisnik',function(req,res){
    if(req.session.username==null)
    res.status(401).json({"greska":"Neautorizovan pristup"});
    else
    {
        fs.readFile(path.join(__dirname,'public','data','korisnici.json'),function(err,data){
            const korisnici = JSON.parse(data);
            const korisnik = korisnici.find(k => k.username == req.session.username);
            if(req.body.ime) korisnik.ime = req.body.ime;
            if(req.body.prezime) korisnik.prezime = req.body.prezime;
            if(req.body.username) {korisnik.username = req.body.username; req.session.username = req.body.username};
            if(req.body.password) korisnik.password = req.body.password;
            fs.writeFile(path.join(__dirname, 'public', 'data', 'korisnici.json'), JSON.stringify(korisnici,null,2), function (err) {
                if (err) throw err;
                res.status(200).json({"poruka":"Podaci su uspješno ažurirani"});
            });
        })
    }
})

app.get('/nekretnine',function(req,res){
    fs.readFile(path.join(__dirname,'public','data','nekretnine.json'),function(err,data){
        if(err) throw err;
        res.status(200).json(JSON.parse(data));
    })
})

app.post('/marketing/nekretnine',function(req,res){
    fs.readFile(path.join(__dirname,'public','data','pretrageiklikovi.json'),function(err,data){
        if(err) throw err;
        const pretrageDat = JSON.parse(data);
        req.body.nizNekretnina.forEach((id)=>{
            const index = pretrageDat.findIndex((item)=>item.id==id);
            pretrageDat[index].pretrage++;
        })
        const updatedPretrage = JSON.stringify(pretrageDat,null,2);
        fs.writeFile(path.join(__dirname,'public','data','pretrageiklikovi.json'),updatedPretrage,function(err){
            if(err) throw err;
            res.status(200).send();
        })
    })
})

app.post('/marketing/nekretnine/:id',function(req,res){
    fs.readFile(path.join(__dirname,'public','data','pretrageiklikovi.json'),function(err,data){
        if(err) throw err;
        const theid = req.params.id;
        const klikoviDat = JSON.parse(data);
        const index = klikoviDat.findIndex((item)=>item.id==theid)
        klikoviDat[index].klikovi++;
        const updatedKlikovi = JSON.stringify(klikoviDat,null,2);
        fs.writeFile(path.join(__dirname,'public','data','pretrageiklikovi.json'),updatedKlikovi,function(err){
            if(err) throw err;
            res.status(200).send();
        })
    })
})

let oldReq = [];
app.post('/marketing/osvjezi',function(req,res){
    if(req.body.nizNekretnina)
    fs.readFile(path.join(__dirname,'public','data','pretrageiklikovi.json'),function(err,data){
        if(err) throw err;
        oldReq = [...req.body.nizNekretnina];
        const pik = JSON.parse(data);
        const filtered = pik.filter(item => req.body.nizNekretnina.includes(item.id));
        const resData = {nizNekretnina: filtered};
        res.status(200).json(resData);
    })
    else
    fs.readFile(path.join(__dirname,'public','data','pretrageiklikovi.json'),function(err,data){
        if(err) throw err;
        const pik = JSON.parse(data);
        const filtered = pik.filter(item => oldReq.includes(item.id));
        const resData = {nizNekretnina: filtered};
        res.status(200).json(resData);
    })
})

app.listen(port,function(){
    console.log("Server listening on PORT",port);
});
