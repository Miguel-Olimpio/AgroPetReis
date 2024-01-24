import { DataTypes } from 'sequelize';
import { db } from '../db/conn.js';

const User = db.define('Users', {
    name: {
        type: DataTypes.STRING,
        require: true
    },
    telephone: {
        type: DataTypes.STRING,
        require: true
    },
});

export { User };
