import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import './index.css';

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

    const estados = [
        { value: '', label: 'Selecione um estado' },
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' },
    ];

    return (
        <form onSubmit={handleSubmit} className="form-instituicao">
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
                <div className="relative">
                    <select
                        className="form-control"
                        id="uf"
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        required
                    >
                        {estados.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>
                    <span className="select-arrow"></span>
                </div>
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
            <button type="submit" className="hidden-submit">Salvar</button>
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