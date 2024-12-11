/**
 * Rotas para o CRUD de Instituições
 */
const express = require('express')
const router = new express.Router()
const Instituicoes = require('../models/Instituicoes')

/**
 * @api {get} /instituicoes Lista todas as Instituições
 * @apiSuccess {Object[]} instituicoes Lista de instituições
 */
router.get('/', async (req, res) => {

    // TODO: Implementar paginação, ordenação e filtros
    const list = await Instituicoes.find({})
    res.status(200).send(list)
})

/**
 * @api {post} /instituicoes Cria uma nova Instituição
 * @apiParam {String} nome Nome da instituição
 * @apiParam {String} uf Unidade Federativa da instituição
 * @apiParam {Number} qtdAlunos Quantidade de alunos da instituição
 * @apiSuccess {Object} instituicao Instituição criada
 */
router.post('/', async (req, res) => {
    const instituicao = new Instituicoes(req.body)
    try {
        await instituicao.save()
        res.status(201).send(instituicao)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * @api {put} /instituicoes/:id Atualiza uma Instituição existente
 * @apiParam {String} id ID da instituição
 * @apiParam {String} nome Nome da instituição
 * @apiParam {String} uf Unidade Federativa da instituição
 * @apiParam {Number} qtdAlunos Quantidade de alunos da instituição
 * @apiSuccess {Object} instituicao Instituição atualizada
 */
router.put('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['nome', 'uf', 'qtdAlunos']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' })
    }

    try {
        const instituicao = await Instituicoes.findById(req.params.id)

        if (!instituicao) {
            return res.status(404).send()
        }

        updates.forEach((update) => instituicao[update] = req.body[update])
        await instituicao.save()
        res.send(instituicao)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * @api {delete} /instituicoes/:id Deleta uma Instituição
 * @apiParam {String} id ID da instituição
 * @apiSuccess {Object} instituicao Instituição deletada
 */
router.delete('/:id', async (req, res) => {
    try {
        const instituicao = await Instituicoes.findByIdAndDelete(req.params.id)

        if (!instituicao) {
            return res.status(404).send()
        }

        res.send(instituicao)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * @api {get} /instituicoes/aggregated Obtém dados agregados para o gráfico
 * @apiSuccess {Object[]} aggregatedData Dados agregados por UF
 */
router.get('/aggregated', async (req, res) => {
    try {
        const aggregatedData = await Instituicoes.aggregate([
            {
                $group: {
                    _id: '$uf',
                    totalAlunos: { $sum: '$qtdAlunos' }
                }
            },
            {
                $project: {
                    _id: 0,
                    uf: '$_id',
                    totalAlunos: 1
                }
            }
        ])
        res.status(200).send(aggregatedData)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
