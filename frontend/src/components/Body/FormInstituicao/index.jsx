// Importações de bibliotecas e estilos
import { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './index.css';

/**
 * Este componente renderiza um formulário para dados de instituição usando o Formik para gerenciamento de formulários e o Yup para validação.
 * Ele permite que os usuários insiram o nome da instituição, o estado (UF) e o número de estudantes.
 * O formulário pode ser enviado programaticamente usando o método submit exposto por meio de uma referência (ref).
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.onSubmit - Função chamada ao submeter o formulário.
 * @param {Object} [props.initialData] - Dados iniciais para preencher o formulário.
 * @param {string} [props.initialData.nome] - Nome inicial da instituição.
 * @param {string} [props.initialData.uf] - UF inicial da instituição.
 * @param {number} [props.initialData.qtdAlunos] - Quantidade inicial de alunos.
 * @param {React.Ref} ref - Referência para o componente, usada para expor a função submit.
 *
 * @returns {JSX.Element} O componente de formulário.
 * 
 * @example
 * const ref = useRef();
 * const handleSubmit = (values) => { console.log(values); };
 * const initialData = { nome: 'Instituição X', uf: 'SP', qtdAlunos: 100 };
 * return <FormInstituicao ref={ref} onSubmit={handleSubmit} initialData={initialData} />;
 */
const FormInstituicao = forwardRef(({ onSubmit, initialData }, ref) => {
    // Uso do hook useImperativeHandle para expor a função submit
    useImperativeHandle(ref, () => ({
        /**
         * Submete o formulário programaticamente
         */
        submit: () => {
            document.querySelector('button[type="submit"]').click();
        },
    }));

    // Lista de estados brasileiros
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

    // Esquema de validação do formulário usando Yup
    const validationSchema = Yup.object({
        nome: Yup.string().required('Nome é obrigatório'),
        uf: Yup.string().required('UF é obrigatório'),
        qtdAlunos: Yup.number().required('Quantidade de Alunos é obrigatória').integer('Quantidade de Alunos deve ser um número inteiro'),
    });

    // Renderização do formulário usando Formik
    return (
        <Formik
            initialValues={{
                nome: initialData?.nome || '',
                uf: initialData?.uf || '',
                qtdAlunos: initialData?.qtdAlunos || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="form-instituicao">
                    {/* A validação do campo Nome também é feito pelo MongoDB como campo único case-insensitive */}
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <Field type="text" name="nome" className="form-control" />
                        <ErrorMessage name="nome" component="div" className="error-message" />
                    </div>
                    {/* Faz uso de um select para a escolha da UF, insere apenas a sigla no BD */}
                    <div className="form-group">
                        <label htmlFor="uf">UF</label>
                        <div className="relative">
                            <Field as="select" name="uf" className="form-control">
                                {estados.map((estado) => (
                                    <option key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </option>
                                ))}
                            </Field>
                            {/* Adiciona uma seta para indicar que é um dropdown */}
                            <span className="select-arrow"></span>
                        </div>
                        <ErrorMessage name="uf" component="div" className="error-message" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="qtdAlunos">Quantidade de Alunos</label>
                        <Field type="number" name="qtdAlunos" className="form-control" />
                        <ErrorMessage name="qtdAlunos" component="div" className="error-message" />
                    </div>
                    <button type="submit" className="hidden-submit" disabled={isSubmitting}>Salvar</button>
                </Form>
            )}
        </Formik>
    );
});

// Definição do displayName do componente
FormInstituicao.displayName = 'FormInstituicao';

// Definição das propTypes do componente
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
