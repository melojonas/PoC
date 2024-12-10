const mongoose = require('mongoose')

const mongoURL = 'dev.api.ies.labore.tech'
const mongoPort = '17013'

const username = encodeURIComponent('jonas')
const password = encodeURIComponent('j0nasMelo')
const databaseName = encodeURIComponent('jonas')
const authDB = databaseName

const connectionURL = `mongodb://${username}:${password}@${mongoURL}:${mongoPort}/${databaseName}?authMechanism=SCRAM-SHA-1&authSource=${authDB}`

/**
 * Conecta ao banco de dados MongoDB usando o Mongoose.
 * @param {string} connectionURL - A URL de conexão para o banco de dados MongoDB.
 * @returns {Promise} - Uma promessa que é resolvida quando a conexão é bem-sucedida e rejeitada quando há uma falha na conexão.
 */
mongoose.connect(connectionURL).then(() => {
    console.log('Conexão com o banco realizada com sucesso!')
}).catch((e) => {
    console.log('Falha na conexão com o banco')
    console.log(e)
})
