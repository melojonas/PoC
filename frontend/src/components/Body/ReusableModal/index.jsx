import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

/**
 * Componente ReusableModal
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.show - Define se o modal está visível
 * @param {function} props.handleClose - Função para fechar o modal
 * @param {string} props.title - Título do modal
 * @param {string} [props.errorMessage] - Mensagem de erro a ser exibida
 * @param {Object} props.formRef - Referência do formulário
 * @param {function} props.handleSubmit - Função para submeter o formulário
 * @param {React.ReactNode} props.children - Conteúdo a ser exibido no corpo do modal
 * @returns {JSX.Element} Elemento JSX do modal reutilizável
 */
const ReusableModal = ({ show, handleClose, title, errorMessage, formRef, handleSubmit, children }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async () => {
        setIsSubmitting(true);
        await handleSubmit(formRef.current);
        setIsSubmitting(false);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
                <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

// Definição das propriedades do componente
ReusableModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    formRef: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default ReusableModal;
