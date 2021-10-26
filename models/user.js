const { DataTypes } = require("sequelize");
const connection = require("../connection");

module.exports = connection.define("User", 
    {
        email : {
            type: DataTypes.STRING,
            allowNull: false
        },

        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        info: {
            type: DataTypes.STRING,
        }
    },
    {
        indexes: [{unique: true, fields: ["email"]}]
    }
);