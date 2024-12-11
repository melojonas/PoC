const express = require('express')
const router = new express.Router()
const Instituicoes = require('../models/Instituicoes')

// Lista todas as Instituições com ordenação, filtragem e paginação
router.get('/', async (req, res) => {
    const { orderBy, order, filterByNome, filterByUf, page, limit } = req.query;

    const sort = {};
    if (orderBy) {
        sort[orderBy] = order === 'desc' ? -1 : 1;
    }

    const match = {};
    if (filterByNome) {
        match.nome = { $regex: filterByNome, $options: 'i' };
    }
    if (filterByUf) {
        match.uf = filterByUf;
    }

    const options = {
        sort,
        skip: (parseInt(page) - 1) * parseInt(limit),
        limit: parseInt(limit)
    };

    try {
        const list = await Instituicoes.find(match, null, options);
        res.status(200).send(list);
    } catch (e) {
        res.status(500).send(e);
    }
})

// Cria uma nova Instituição
router.post('/', async (req, res) => {
    const instituicao = new Instituicoes(req.body)
    try {
        await instituicao.save()
        res.status(201).send(instituicao)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Atualiza uma Instituição existente
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

// Deleta uma Instituição
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

// Obtém dados agregados para o gráfico
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
