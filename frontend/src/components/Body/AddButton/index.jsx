import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ReusableModal from '../ReusableModal';
import FormInstituicao from '../FormInstituicao';
import axios from '../../../api/axios';

/**
 * Componente AddButton
 * 
 * Este componente renderiza um botão que, ao ser clicado, abre um modal para adicionar uma nova instituição.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onDataChange - Função chamada quando os dados são alterados
 * 
 * @returns {JSX.Element} Elemento JSX que representa o botão de adicionar instituição
 */
const AddButton = ({ onDataChange }) => {
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef(null);

    // Fecha o modal e reseta a mensagem de erro
    const handleClose = () => { setShow(false); setErrorMessage(''); };

    // Abre o modal
    const handleShow = () => setShow(true);

    /**
     * Lida com o envio do formulário
     * 
     * @param {Object} data - Dados do formulário
     */
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

            <ReusableModal
                show={show}
                handleClose={handleClose}
                title="Nova Instituição"
                errorMessage={errorMessage}
                formRef={formRef}
                handleSubmit={handleSubmit}
            >
                <FormInstituicao ref={formRef} onSubmit={handleSubmit} />
            </ReusableModal>
        </div>
    );
}

// Validação das propriedades
AddButton.propTypes = {
    onDataChange: PropTypes.func.isRequired,
};

export default AddButton;