const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt24', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model
db.Korisnik = require(__dirname + '/models/Korisnik')(sequelize, Sequelize);
db.Upit = require(__dirname + '/models/Upit')(sequelize, Sequelize);
db.Nekretnina = require(__dirname + '/models/Nekretnina')(sequelize, Sequelize);

db.Nekretnina.hasMany(db.Upit,{as:'upiti'});

module.exports = db;
