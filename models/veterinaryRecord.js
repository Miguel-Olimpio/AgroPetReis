import { DataTypes } from "sequelize";
import { db } from "../db/conn.js";
import { Pet } from "./Pets.js";

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

export { VeterinaryRecord }