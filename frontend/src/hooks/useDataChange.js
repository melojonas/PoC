import { useState, useCallback } from 'react';

export const useDataChange = () => {
    const [dataChanged, setDataChanged] = useState(false);

    const handleDataChange = useCallback(() => {
        setDataChanged(prevState => !prevState);
    }, []);

    return { dataChanged, handleDataChange };
};
