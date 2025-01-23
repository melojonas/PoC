const mongoose = require('mongoose')

const mongoURL = 'dev.api.ies.labore.tech'
const mongoPort = '17013'

const username = encodeURIComponent('jonas')
const password = encodeURIComponent('j0nasMelo')
const databaseName = encodeURIComponent('jonas')
const authDB = databaseName

const connectionURL = `mongodb+srv://jonasmelo:WOhLY6P30VzBmAGZ@cluster0.pfrru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
