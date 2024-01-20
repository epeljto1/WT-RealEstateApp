const express = require('express');
const session = require("express-session");
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const db = require('./database/db.js');
const { Op } = require('sequelize');

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

async function hashPasswordsAndUpdateTable() {
    try {
        const korisnici = await db.Korisnik.findAll();

        const hashPromises = korisnici.map((korisnik) => {
            return new Promise(async (resolve, reject) => {
                if (!korisnik.password.startsWith('$2b$')) {
                    try {
                        const hash = await bcrypt.hash(korisnik.password, 10);
                        korisnik.password = hash;
                        await korisnik.save();
                        resolve();
                    } catch (hashError) {
                        reject(hashError);
                    }
                } else {
                    resolve();
                }
            });
        });

        await Promise.all(hashPromises);

    } catch (error) {
        console.error("Error:", error);
    }
}

hashPasswordsAndUpdateTable();

app.post('/login', async function (req, res) {
    try {
        const korisnik = await db.Korisnik.findOne({
            where: {
                username: req.body.username
            }
        });

        if (korisnik) {
            const result = await bcrypt.compare(req.body.password, korisnik.password);

            if (result) {
                req.session.username = korisnik.username;
                res.status(200).json({ "poruka": "Uspješna prijava" });
            } else {
                res.status(401).json({ "greska": "Neuspješna prijava" });
            }
        } else {
            res.status(401).json({ "greska": "Neuspješna prijava" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ "greska": "Greška prilikom prijave" });
    }
});

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

app.get('/korisnik', async function (req, res) {
    try {
        if (req.session.username == null) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }

        const korisnik = await db.Korisnik.findOne({
            where: {
                username: req.session.username
            }
        });

        if (korisnik) {
            return res.status(200).json(korisnik);
        } else {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ "greska": "Greška prilikom dohvata korisnika" });
    }
});

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

app.put('/korisnik', async function (req, res) {
    try {
        if (req.session.username == null) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }

        const korisnik = await db.Korisnik.findOne({
            where: {
                username: req.session.username
            }
        });

        if (req.body.ime) korisnik.ime = req.body.ime;
        if (req.body.prezime) korisnik.prezime = req.body.prezime;
        if (req.body.username) {
            korisnik.username = req.body.username;
            req.session.username = req.body.username;
        }
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            korisnik.password = hashedPassword;
        }

        await korisnik.save();

        return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ "greska": "Greška prilikom ažuriranja podataka" });
    }
});

app.get('/nekretnine',async function(req,res){
    try {
        const nekretnine = await db.Nekretnina.findAll(
            {
                include: [
                    {
                        model: db.Upit,
                        as: 'upiti',
                        attributes: ['tekst_upita'],
                    },
                ],
            }
        );
        res.status(200).json(nekretnine);
    } catch (err) {
        console.error('Error fetching nekretnine:', err);
        res.status(500).json({"greska": "Greška prilikom dohvata nekretnina"});
    }
})

app.post('/marketing/nekretnine',async function(req,res){
    try {
        const nekretnineIds = req.body.nizNekretnina;
        await db.Nekretnina.update(
            { pretrage: db.sequelize.literal('pretrage + 1') },
            {
                where: {
                    id: {
                        [Op.in]: nekretnineIds,
                    },
                },
            }
        );

        res.status(200).send();
    } catch (err) {
        console.error('Error updating pretrage:', err);
        res.status(500).json({"greska": "Greška"});
    }
})

app.post('/marketing/nekretnine/:id', async function(req,res){
    try {
        const theid = req.params.id;
        await db.Nekretnina.update(
            { klikovi: db.sequelize.literal('klikovi + 1') },
            {
                where: {
                    id: theid,
                },
            }
        );
        res.status(200).send();
    } catch (err) {
        console.error('Error updating klikovi:', err);
        res.status(500).json({"greska": "Greška"});
    }
})

let oldReq = [];
app.post('/marketing/osvjezi',async function(req,res){
    try {
    if(req.body.nizNekretnina)
    {
        const updatedData = await db.Nekretnina.findAll({
            where: {
                id: {
                    [Op.in]: req.body.nizNekretnina,
                },
            },
        });
        oldReq = [...req.body.nizNekretnina];
        const resData = { nizNekretnina: updatedData };
        res.status(200).json(resData);
    }
    else
    {
        const updatedData = await db.Nekretnina.findAll({
            where: {
                id: {
                    [Op.in]: oldReq,
                },
            },
        });
        const resData = { nizNekretnina: updatedData };
        res.status(200).json(resData);

    }
}
catch (err)
{
    console.error('Error', err);
    res.status(500).json({"greska": "Greška"});
}
})

app.get('/nekretnine/:id',async function(req,res){
    try {
        theId = req.params.id;
        const nekretnina = await db.Nekretnina.findOne(
            {
                where: { id: theId },
                include: [
                    {
                        model: db.Upit,
                        as: 'upiti',
                        attributes: ['tekst_upita'],
                        include: [
                            {
                                model: db.Korisnik,
                                as: 'korisnik',
                                attributes: ['username'],
                            },
                        ],
                    },
                ],
            }
        );
        if(nekretnina)
        res.status(200).json(nekretnina);
        else
        res.status(400).json({"greska":`Nekretnina sa id-em ${theId} ne postoji`});
    } catch (err) {
        console.error('Error fetching nekretnine:', err);
        res.status(500).json({"greska": "Greška prilikom dohvata nekretnina"});
    }
});

app.listen(port,function(){
    console.log("Server listening on PORT",port);
});
