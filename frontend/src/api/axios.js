import axios from 'axios';
import backendUrl from '../utils/backend-url';

/**
 * Cria uma instância do axios com configurações personalizadas.
 * 
 * @typedef {Object} AxiosInstance
 * @property {Function} get - Método para fazer requisições GET.
 * @property {Function} post - Método para fazer requisições POST.
 * @property {Function} put - Método para fazer requisições PUT.
 * @property {Function} delete - Método para fazer requisições DELETE.
 * 
 * @returns {AxiosInstance} - Instância do axios configurada.
 */
const instance = axios.create({
    baseURL: backendUrl,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export default instance;
