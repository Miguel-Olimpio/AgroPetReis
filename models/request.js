import { DataTypes } from "sequelize";
import { db } from "../db/conn.js";
import { User } from "./user.js";

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

Scheduling.belongsTo(User)
User.hasMany(Scheduling)

export { Scheduling };