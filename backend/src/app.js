const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Conexão do banco de dados
require('./db/mongoose')

// Importando arquivo de rotas
const healthyRouter = require('./routers/healthy')
const instituicoesRouter = require('./routers/instituicoes')

const app = express()

// Criando o parser de json (as requisições chegam e vão como objetos JSON)
const jsonParser = bodyParser.json({
    limit: "50mb"
})

// Habilitando CORS e Transformando objeto recebido em JSON
app.use(cors())
app.use(jsonParser)

// Altere a porta se necessário
const port = 1713 

/**
 * @api {get} /healthy Verifica se a API está funcionando
 * @apiSuccess {String} healthy! Indica que o servidor está funcionando
 */
app.use(healthyRouter)

/**
 * @api {get} /instituicoes Lista todas as Instituições
 * @apiSuccess {Object[]} instituicoes Lista de instituições
 * 
 * @api {post} /instituicoes Cria uma nova Instituição
 * @apiParam {String} nome Nome da instituição
 * @apiParam {String} uf Unidade Federativa da instituição
 * @apiParam {Number} qtdAlunos Quantidade de alunos da instituição
 * @apiSuccess {Object} instituicao Instituição criada
 * 
 * @api {put} /instituicoes/:id Atualiza uma Instituição existente
 * @apiParam {String} id ID da instituição
 * @apiParam {String} nome Nome da instituição
 * @apiParam {String} uf Unidade Federativa da instituição
 * @apiParam {Number} qtdAlunos Quantidade de alunos da instituição
 * @apiSuccess {Object} instituicao Instituição atualizada
 * 
 * @api {delete} /instituicoes/:id Deleta uma Instituição
 * @apiParam {String} id ID da instituição
 * @apiSuccess {Object} instituicao Instituição deletada
 * 
 * @api {get} /instituicoes/aggregated Obtém dados agregados para o gráfico
 * @apiSuccess {Object[]} aggregatedData Dados agregados por UF
 */
app.use('/instituicoes', instituicoesRouter)

/**
 * Inicia o servidor na porta especificada
 * @param {Number} port - A porta na qual o servidor será iniciado
 */
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
})
