const Sequelize = require('sequelize')
const db = {}

const sequelize = new Sequelize('logindb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: '0',
    dialectOptions: {
        connectTimeout: 20000, // default is 10s which causes occasional ETIMEDOUT errors (see https://stackoverflow.com/a/52465919/491553)
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // retry  : {
    // 	match: [
    // 		/ETIMEDOUT/,
    // 		/EHOSTUNREACH/,
    // 		/ECONNRESET/,
    // 		/ECONNREFUSED/,
    // 		/ETIMEDOUT/,
    // 		/ESOCKETTIMEDOUT/,
    // 		/EHOSTUNREACH/,
    // 		/EPIPE/,
    // 		/EAI_AGAIN/,
    // 		/SequelizeConnectionError/,
    // 		/SequelizeConnectionRefusedError/,
    // 		/SequelizeHostNotFoundError/,
    // 		/SequelizeHostNotReachableError/,
    // 		/SequelizeInvalidConnectionError/,
    // 		/SequelizeConnectionTimedOutError/
    // 	],
    // 	max  : 5
    // }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db