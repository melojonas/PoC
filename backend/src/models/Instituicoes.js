const mongoose = require('mongoose')

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

const Instituicao = mongoose.model('Instituicao', InstituicaoSchema, 'instituicoes')

module.exports = Instituicao