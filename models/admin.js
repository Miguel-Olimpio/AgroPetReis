import { DataTypes } from 'sequelize';
import { db } from '../db/conn.js';

const AdminUsers = db.define('AdmUsers', {
  name: {
    type: DataTypes.STRING,
    require: true
  },
  password: {
    type: DataTypes.STRING,
    require: true
  },
});

export { AdminUsers };
