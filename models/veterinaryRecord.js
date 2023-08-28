const { DataTypes } = require('sequelize');
const { db } = require('../db/conn.js');
const { Pet } = require('./Pets.js');


const VeterinaryRecord = db.define('VeterinaryRecord', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Weight: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  report: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  revenue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nextAppointment:{
    type: DataTypes.DATE,
    allowNull: false
  }
});

VeterinaryRecord.belongsTo(Pet)
Pet.hasMany(VeterinaryRecord)

module.exports = { VeterinaryRecord }