import { useState, useEffect } from 'react';
import axios from '../api/axios';

/**
 * Custom hook to check the backend status.
 *
 * @function useBackendStatus
 * @returns {Object} - The status of the backend and a function to manually check the backend status.
 * @property {string} status - The current status of the backend ('idle', 'loading', 'success', 'error').
 * @property {Function} checkBackendStatus - Function to manually check the backend status.
 */
export const useBackendStatus = () => {
    const [status, setStatus] = useState('idle');

    const checkBackendStatus = async () => {
        setStatus('loading');
        try {
            await axios.get('/');
            setStatus('success');
        } catch  {
            setStatus('error');
        }
    };

    useEffect(() => {
        checkBackendStatus();
    }, []);

    return { status, checkBackendStatus };
};
