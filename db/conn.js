import { Sequelize } from 'sequelize';

const db = new Sequelize('agropetvetreis', 'agroPetAdmin', 'Nettao260695', {
    host:'agropetreis.c7i0ks280v4u.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'
});

try {
    db.authenticate();
    console.log('Deu bom');
} catch (err) {
    console.log(err);
}

export { db };
