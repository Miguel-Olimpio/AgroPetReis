// sessions.js

import { DataTypes } from 'sequelize';
import { db } from '../db/conn.js';

const Session = db.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: {
    type: DataTypes.DATE,
  },
  data: {
    type: DataTypes.TEXT,
  },
});

const sessionStore = {
  async get(sid) {
    const session = await Session.findByPk(sid);
    return session ? JSON.parse(session.dataValues.data) : null;
  },
  async set(sid, session) {
    await Session.upsert({ sid, expires: session.cookie.expires, data: JSON.stringify(session) });
    return session;
  },
  async destroy(sid) {
    await Session.destroy({ where: { sid } });
  }
};

export { Session, sessionStore };

