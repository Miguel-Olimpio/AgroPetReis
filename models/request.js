const { DataTypes } = require('sequelize');
const { db } = require('../db/conn.js');
const { User } = require('./user.js');
const { AdminUsers } = require('./admin.js');

const Scheduling = db.define('Scheduling', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hour: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pet: {
    type: DataTypes.STRING,
    allowNull: false
  }
});


// Scheduling.belongsTo(AdminUsers)
// AdminUsers.hasMany(Scheduling)

Scheduling.belongsTo(User)
User.hasMany(Scheduling)

module.exports = { Scheduling };