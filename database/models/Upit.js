const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    const Upit = sequelize.define("Upit",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tekst_upita: {
            type: Sequelize.STRING
        }
    });

    return Upit;
};