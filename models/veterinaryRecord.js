import { DataTypes } from 'sequelize';
import { db } from '../db/conn.js';
import { Pet } from './Pets.js';
import { User } from './user.js';

const VeterinaryRecord = db.define('VeterinaryRecord', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
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
  nextAppointment: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});

VeterinaryRecord.belongsTo(Pet);
Pet.hasMany(VeterinaryRecord);

export { VeterinaryRecord };
