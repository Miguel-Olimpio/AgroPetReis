const { DataTypes } = require('sequelize');
const { db } = require('../db/conn.js');


const User = db.define('Users', {
    name: {
        type: DataTypes.STRING,
        require:true
    },
    telephone: {
        type: DataTypes.STRING,
        require:true
    },
})

module.exports = { User }