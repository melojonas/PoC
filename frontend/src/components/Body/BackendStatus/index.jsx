import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import backendUrl from '../../../utils/backend-url';

/**
 * Componente BackendStatus
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onDataChange - Função chamada quando os dados são alterados
 * @returns {JSX.Element} - Elemento JSX do status do backend
 */
const BackendStatus = ({ onDataChange }) => {
    const [status, setStatus] = useState(null);

    /**
     * Verifica o status do backend
     */
    const checkBackendStatus = async () => {
        try {
            const response = await axios.get(backendUrl);
            if (response.status === 200) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    useEffect(() => {
        checkBackendStatus();
    }, []);

    return (
        <div>
            {status === 'success' && (
                <Alert variant="success">
                    API do Backend está acessível.
                </Alert>
            )}
            {status === 'error' && (
                <Alert variant="danger">
                    API do Backend está inacessível,{''}
                    {/* onDataChange é chamado para recarregar os dados */}
                    <Button variant="link" onClick={ () => { checkBackendStatus(); onDataChange(); }}>
                        clique aqui para tentar novamente
                    </Button>.
                </Alert>
            )}
        </div>
    );
};

// Validação de tipos das propriedades
BackendStatus.propTypes = {
    onDataChange: PropTypes.func.isRequired,
};

export default BackendStatus;
