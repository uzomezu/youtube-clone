const config = require('../config/config');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.db.SCHEMA,
    config.db.USER,
    config.db.PASS, {
        host: config.db.HOST,
        port: config.db.PORT,
        dialect: config.db.DIALECT,
        dialectOptions: {
            ssl: config.db.SSL == true
        },
        operatorAliases: config.db.operatorAliases,
        pool : {
            min: config.db.pool.min,
            max: config.db.pool.max,
            acquire: config.db.pool.acquire,
            idle: config.db.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;