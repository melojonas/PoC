import axios from 'axios';
import backendUrl from '../utils/backend-url';

const instance = axios.create({
    baseURL: backendUrl,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export default instance;