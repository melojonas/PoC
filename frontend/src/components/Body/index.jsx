import { useDataChange } from '../../hooks/useDataChange';
import AddButton from './AddButton';
import BackendStatus from './BackendStatus';
import ChartQtdAlunos from './ChartQtdAlunos';
import InstituicoesTable from './InstituicoesTable';
import './index.css'

/**
 * Componente Body
 * 
 * @component
 * @returns {JSX.Element} - Elemento JSX do corpo da aplicação
 */
const Body = () => {
    const { dataChanged, handleDataChange } = useDataChange();

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
