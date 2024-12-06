const mongoose = require('mongoose')

const mongoURL = 'url_do_servidor_mongo'
const mongoPort = 'porta_do_servidor_mongo'

const username = encodeURIComponent('seu_usuario')
const password = encodeURIComponent('sua_senha')
const databaseName = encodeURIComponent('seu_database')
const authDB = databaseName

const connectionURL = `mongodb://${username}:${password}@${mongoURL}:${mongoPort}/${databaseName}?authMechanism=SCRAM-SHA-1&authSource=${authDB}`

mongoose.connect(connectionURL).then(() => {
    console.log('Conexão com o banco realizada com sucesso!')
}).catch((e) => {
    console.log('Falha na conexão com o banco')
    console.log(e)
})


