const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    process.env.SQL_DB_NAME,
    process.env.SQL_DB_USER,
    process.env.SQL_DB_PASSWORD,
    {
        host: process.env.SQL_DB_HOST,
        dialect: process.env.SQL_DB_DIALECT,
        //logging: false
    }
);
