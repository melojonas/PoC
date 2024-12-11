import './index.css';
import { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { createChart } from './chartConfig';

/**
 * Componente que renderiza um gráfico de quantidade de alunos.
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {boolean} props.dataChanged - Indica se os dados do gráfico foram alterados.
 * @returns {JSX.Element} Elemento JSX que representa o gráfico de quantidade de alunos.
 *
 * @example
 * <ChartQtdAlunos dataChanged={true} />
 */
const ChartQtdAlunos = ({ dataChanged }) => {
  const chartRef = useRef(null);

  /**
   * Cria o gráfico quando o componente é montado
   * e quando a propriedade dataChanged é alterada
   */
  useLayoutEffect(() => {
    const { root } = createChart(chartRef);

    return () => {
      root.dispose();
    };
  }, [dataChanged]);

  return (
    <div className='chart-container'>
        <h1>Gráfico de quantidade de alunos</h1>
        <div className='chart-element'>
            <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
        </div>
    </div>
  );
};

// Validação de tipos de props
ChartQtdAlunos.propTypes = {
  dataChanged: PropTypes.bool.isRequired,
};

export default ChartQtdAlunos;