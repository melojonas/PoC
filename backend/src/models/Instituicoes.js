const mongoose = require('mongoose')

/**
 * Schema para a coleção de Instituições.
 * @typedef {Object} InstituicaoSchema
 * @property {String} nome - Nome da instituição (único e case-insensitive).
 * @property {String} uf - Unidade Federativa da instituição.
 * @property {Number} qtdAlunos - Quantidade de alunos da instituição.
 */
const InstituicaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        unique: true // Garantir a unicidade
    },
    uf: {
        type: String
    },
    qtdAlunos: {
        type: Number
    }
})

// Garantir a unicidade case-insensitive
InstituicaoSchema.index(
    { nome: 1 },
    {
        unique: true,
        collation: { locale: 'pt', strength: 2 } // Case-insensitive
    }
);

/**
 * Modelo para a coleção de Instituições.
 * @typedef {Object} Instituicao
 * @property {String} nome - Nome da instituição (único).
 * @property {String} uf - Unidade Federativa da instituição.
 * @property {Number} qtdAlunos - Quantidade de alunos da instituição.
 */
const Instituicao = mongoose.model('Instituicao', InstituicaoSchema, 'instituicoes')

module.exports = Instituicao
