import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import backendUrl from '../../../utils/backend-url';

const BackendStatus = ({ onDataChange }) => {
    const [status, setStatus] = useState(null);

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