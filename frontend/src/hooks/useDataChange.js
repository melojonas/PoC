import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar mudanças de dados.
 *
 * @returns {Object} Um objeto contendo:
 * - dataChanged {boolean}: Estado que indica se os dados foram alterados.
 * - handleDataChange {Function}: Função para alternar o estado de dataChanged.
 */
export const useDataChange = () => {
    const [dataChanged, setDataChanged] = useState(false);

    /**
     * Alterna o estado de dataChanged.
     */
    const handleDataChange = useCallback(() => {
        setDataChanged(prevState => !prevState);
    }, []);

    return { dataChanged, handleDataChange };
};
