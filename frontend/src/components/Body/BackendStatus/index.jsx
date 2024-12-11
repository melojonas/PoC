import { useBackendStatus } from '../../../hooks/useBackendStatus';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';

const BackendStatus = ({ onDataChange }) => {
    const { status, checkBackendStatus } = useBackendStatus();

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
                    <Button variant="link" onClick={ () => { checkBackendStatus(); onDataChange(); }}>
                        clique aqui para tentar novamente
                    </Button>.
                </Alert>
            )}
        </div>
    );
};

BackendStatus.propTypes = {
    onDataChange: PropTypes.func.isRequired,
};

export default BackendStatus;
