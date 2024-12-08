import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const FormInstituicao = forwardRef(({ onSubmit, initialData }, ref) => {
    const [nome, setNome] = useState(initialData?.nome || '');
    const [uf, setUf] = useState(initialData?.uf || '');
    const [qtdAlunos, setQtdAlunos] = useState(initialData?.qtdAlunos || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { nome, uf, qtdAlunos: parseInt(qtdAlunos) };
        if (onSubmit) { onSubmit(data); }
    };

    useImperativeHandle(ref, () => ({
        submit: () => {
            document.querySelector('button[type="submit"]').click();
        },
    }));

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                    type="text"
                    className="form-control"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="uf">UF</label>
                <input
                    type="text"
                    className="form-control"
                    id="uf"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="qtdAlunos">Quantidade de Alunos</label>
                <input
                    type="number"
                    className="form-control"
                    id="qtdAlunos"
                    value={qtdAlunos}
                    onChange={(e) => setQtdAlunos(e.target.value)}
                    required
                />
            </div>
            <button type="submit" style={{ display: 'none' }}>Salvar</button>
        </form>
    );
});

FormInstituicao.displayName = 'FormInstituicao';

FormInstituicao.propTypes = {
    onSubmit: PropTypes.func,
    initialData: PropTypes.shape({
        nome: PropTypes.string,
        uf: PropTypes.string,
        qtdAlunos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        _id: PropTypes.string,
    }),
};

export default FormInstituicao;