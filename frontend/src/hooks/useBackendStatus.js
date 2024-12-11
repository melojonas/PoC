import { useState, useEffect } from 'react';
import axios from '../api/axios';

export const useBackendStatus = () => {
    const [status, setStatus] = useState('idle');

    const checkBackendStatus = async () => {
        setStatus('loading');
        try {
            await axios.get('/healthy');
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    };

    useEffect(() => {
        checkBackendStatus();
    }, []);

    return { status, checkBackendStatus };
};
