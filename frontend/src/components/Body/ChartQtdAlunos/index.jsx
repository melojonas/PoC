import './index.css';
import { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from '../../../api/axios';

/**
 * Componente ChartQtdAlunos
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.dataChanged - Indica se os dados foram alterados
 * @returns {JSX.Element} - Elemento JSX do gráfico de quantidade de alunos
 */
const ChartQtdAlunos = ({ dataChanged }) => {
  const chartRef = useRef(null);

  /**
   * Cria o gráfico, este código é executado quando o componente 
   * é montado e quando a propriedade dataChanged é alterada
   */
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft:0,
        paddingRight:1
    }));

    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(root, { 
        minGridDistance: 30, 
        minorGridEnabled: true
    });
    
    xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
    });
    
    xRenderer.grid.template.setAll({
        location: 1
    })
    
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "uf",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yRenderer = am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
    })
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
    }));

    // Create series
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Quantidade de alunos",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "totalAlunos",
        sequencedInterpolation: true,
        categoryXField: "uf",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", (fill, target) => chart.get("colors").getIndex(series.columns.indexOf(target)));
    series.columns.template.adapters.add("stroke", (stroke, target) => chart.get("colors").getIndex(series.columns.indexOf(target)));

    // Cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    /**
     * Busca os dados agregados para o gráfico
     */
    const fetchData = async () => {
        try {
            const response = await axios.get(`/instituicoes/aggregated`);  
            
            // Ordena os dados pelo campo totalAlunos em ordem decrescente
            const sortedData = response.data.sort((a, b) => b.totalAlunos - a.totalAlunos);

            xAxis.data.setAll(sortedData);
            series.data.setAll(sortedData);
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();

    // Animate
    series.appear(1000);
    chart.appear(1000, 100);

    chartRef.current = chart;

    return () => {
      root.dispose();
    };
  }, [dataChanged]);

  // When the paddingRight prop changes it will update the chart
  useLayoutEffect(() => {
      chartRef.current.set("paddingRight");
  }, []);

  return (
    <div className='chart-container'>
        <h1>Gráfico de quantidade de alunos</h1>
        <div className='chart-element'>
            <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
        </div>
    </div>
    
  );
};

// Validação das propriedades
ChartQtdAlunos.propTypes = {
  dataChanged: PropTypes.bool.isRequired,
};

export default ChartQtdAlunos;
