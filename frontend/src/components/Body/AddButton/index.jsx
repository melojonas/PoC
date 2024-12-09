import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FormInstituicao from '../FormInstituicao';
import axios from '../../../api/axios';

const AddButton = ({ onDataChange }) => {
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef(null);

    const handleClose = () => { setShow(false); setErrorMessage(''); };
    const handleShow = () => setShow(true);

    const handleSubmit = async (data) => {
        try {
            await axios.post('/instituicoes', data);
            handleClose();
            onDataChange();
        } catch (error) {
            if (error?.response?.data?.errorResponse?.code === 11000) {
                setErrorMessage('Instituição já cadastrada.');
            } else {
                setErrorMessage('Erro ao salvar a instituição.');
            }
        }
    };

    return (
        <div className="add-button-container">
            <Button variant="success" onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Nova Instituição
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Instituição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormInstituicao ref={formRef} onSubmit={handleSubmit} />
                </Modal.Body>
                <Modal.Footer>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={ () => formRef.current && formRef.current.submit() }>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
AddButton.propTypes = {
    onDataChange: PropTypes.func.isRequired,
};

export default AddButton;