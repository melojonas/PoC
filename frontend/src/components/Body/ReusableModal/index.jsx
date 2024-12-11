import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

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
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {children}
            </Modal.Body>
            <Modal.Footer>
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
