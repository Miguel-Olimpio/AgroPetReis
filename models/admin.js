const { DataTypes } = require('sequelize');
const { db } = require('../db/conn.js');


const AdminUsers = db.define('AdmUsers', {
    name: {
        type: DataTypes.STRING,
        require:true
    },
    password: {
        type: DataTypes.STRING,
        require:true
    },
})

module.exports = { AdminUsers }