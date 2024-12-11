import './index.css';
import { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { createChart } from './chartConfig';

const ChartQtdAlunos = ({ dataChanged }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const { root, chart } = createChart(chartRef);

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

ChartQtdAlunos.propTypes = {
  dataChanged: PropTypes.bool.isRequired,
};

export default ChartQtdAlunos;