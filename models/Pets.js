import { DataTypes } from "sequelize";
import { db } from "../db/conn.js";
import { User } from "./user.js";

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

export {Pet}