import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import FormInstituicao from '../FormInstituicao';

const ModalState = ({ showModal, handleClose, currentInstituicao, handleEdit }) => {
    const formRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            await handleEdit(data);
            handleClose();
        } catch {
            setErrorMessage('Erro ao editar a instituição.');
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Instituição</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormInstituicao ref={formRef} initialData={currentInstituicao} onSubmit={onSubmit} />
            </Modal.Body>
            <Modal.Footer>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
                <Button variant="primary" onClick={() => formRef.current && formRef.current.submit()}>
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ModalState.propTypes = {
    showModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    currentInstituicao: PropTypes.shape({
        nome: PropTypes.string,
        uf: PropTypes.string,
        qtdAlunos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        _id: PropTypes.string,
    }),
    handleEdit: PropTypes.func.isRequired,
};

export default ModalState;
