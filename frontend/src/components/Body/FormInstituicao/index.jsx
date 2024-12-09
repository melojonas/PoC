import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import './index.css';

/**
 * Componente FormInstituicao
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSubmit - Função chamada ao submeter o formulário
 * @param {Object} [props.initialData] - Dados iniciais do formulário
 * @param {string} [props.initialData.nome] - Nome da instituição
 * @param {string} [props.initialData.uf] - Unidade Federativa da instituição
 * @param {number|string} [props.initialData.qtdAlunos] - Quantidade de alunos da instituição
 * @param {string} [props.initialData._id] - ID da instituição
 * @returns {JSX.Element} - Elemento JSX do formulário de instituição
 */
const FormInstituicao = forwardRef(({ onSubmit, initialData }, ref) => { // forwardRef é usado para permitir o uso de ref no componente
    const [nome, setNome] = useState(initialData?.nome || '');
    const [uf, setUf] = useState(initialData?.uf || '');
    const [qtdAlunos, setQtdAlunos] = useState(initialData?.qtdAlunos || '');

    /**
     * Manipula o envio do formulário
     * 
     * @param {Object} e - Evento de envio do formulário
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { nome, uf, qtdAlunos: parseInt(qtdAlunos) };
        if (onSubmit) { onSubmit(data); }
    };

    useImperativeHandle(ref, () => ({
        /**
         * Submete o formulário programaticamente
         */
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
            {/* A validação do campo Nome é feito pelo MongoDB como campo único case-insensitive */}
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
            {/* Faz uso de um select para a escolha da UF, insere apenas a sigla no BD */}
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
                    {/* Adiciona uma seta para indicar que é um dropdown */}
                    <span className="select-arrow"></span>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="qtdAlunos">Quantidade de Alunos</label>
                <input
                    type="number" // Força o campo a aceitar apenas números
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

// Validação das propriedades
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
