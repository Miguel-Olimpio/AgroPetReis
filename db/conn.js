import { Sequelize } from "sequelize";

// console.log(`---------------------------${process.env.DATABASE_URL}---------------------------`)

// const db = new Sequelize({
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     dialectOptions: {
//         ssl: {
//             rejectUnauthorized: true
//         }
//     }
// });

// try {
//     db.authenticate();
//     console.log('Connected to PlanetScale via Sequelize!');
// } catch (err) {
//     console.log(err);
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

export { db }
