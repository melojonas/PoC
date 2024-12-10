/**
 * Rotas para verificar se a API está funcionando
 */
const express = require('express')
const router = new express.Router()

/**
 * @api {get} / Verifica se a API está funcionando
 * @apiSuccess {String} healthy! Indica que o servidor está funcionando
 */
router.get('/', async (req, res) => {
    res.status(200).send("healthy!")
})

module.exports = router
