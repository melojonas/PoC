import { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './index.css';

const FormInstituicao = forwardRef(({ onSubmit, initialData }, ref) => {
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

    const validationSchema = Yup.object({
        nome: Yup.string().required('Nome é obrigatório'),
        uf: Yup.string().required('UF é obrigatório'),
        qtdAlunos: Yup.number().required('Quantidade de Alunos é obrigatória').integer('Quantidade de Alunos deve ser um número inteiro'),
    });

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
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <Field type="text" name="nome" className="form-control" />
                        <ErrorMessage name="nome" component="div" className="error-message" />
                    </div>
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
