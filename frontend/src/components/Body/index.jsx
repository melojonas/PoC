import { useState } from 'react';
import AddButton from './AddButton';
import BackendStatus from './BackendStatus';
import ChartQtdAlunos from './ChartQtdAlunos';
import InstituicoesTable from './InstituicoesTable';
import './index.css'

const Body = () => {
    const [dataChanged, setDataChanged] = useState(false);

    const handleDataChange = () => {
        setDataChanged(!dataChanged);
    };

    return (
        <div className="body">
            <BackendStatus onDataChange={handleDataChange}/>
            <AddButton onDataChange={handleDataChange} />
            <InstituicoesTable onDataChange={handleDataChange} dataChanged={dataChanged} />
            <ChartQtdAlunos dataChanged={dataChanged} />
        </div>
    );
}

export default Body;