const Sequelize = require('sequelize');

// const db = new Sequelize({
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     dialectOptions: {
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// });

// try {
//     await db.authenticate();
//     console.log('Connected to railway database!');
// } catch (err) {
//     console.error('Unable to connect to the database:', err);
// }

// export { db };


const db = new Sequelize('agropetvetreis', 'root', '', {
    host: 'LocalHost',
    dialect: 'mysql'
})

try{
    db.authenticate()
    console.log('Deu bom')
}catch(err){console.log(err)}

module.exports = { db }
