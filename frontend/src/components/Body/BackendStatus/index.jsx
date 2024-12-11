import { useBackendStatus } from '../../../hooks/useBackendStatus';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';

/**
 * Componente BackendStatus
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onDataChange - Função chamada quando os dados são alterados
 * @returns {JSX.Element} - Elemento JSX do status do backend
 */
const BackendStatus = ({ onDataChange }) => {
    const { status, checkBackendStatus } = useBackendStatus(); // Custom hook para verificar o status do backend

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
