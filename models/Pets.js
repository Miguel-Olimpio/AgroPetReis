const { DataTypes } = require('sequelize');
const { db } = require('../db/conn.js');
const { User } = require('./user.js');

const Pet = db.define('Pets', {
  PetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  race: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Pet.belongsTo(User)
User.hasMany(Pet)

module.exports = {Pet}