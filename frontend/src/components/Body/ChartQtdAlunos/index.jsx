import './index.css';
import { useRef, useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from '../../../api/axios';

const ChartQtdAlunos = () => {
  const chartRef = useRef(null);

  // Creates the chart, this code only runs one time
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

    // Fetch data
    // Mock data
    let mockData = [
        {   uf: "RS",
            totalAlunos: 200},
        {   uf: "SC",
            totalAlunos: 100},
        {   uf: "PR",
            totalAlunos: 300},
        {   uf: "SP",
            totalAlunos: 400},
        {   uf: "RJ",
            totalAlunos: 500},
        {   uf: "MG",
            totalAlunos: 600},
        ];

    const fetchData = async () => {
        try {
            const response = await axios.get(`/instituicoes/aggregated`);  
            
            // Ordena os dados pelo campo totalAlunos em ordem decrescente
            const sortedData = response.data.sort((a, b) => b.totalAlunos - a.totalAlunos);

            xAxis.data.setAll(sortedData);
            series.data.setAll(sortedData);
        } catch (error) {
            console.error(error);
            
            // Ordena os dados mock pelo campo totalAlunos em ordem decrescente
            const sortedMockData = mockData.sort((a, b) => b.totalAlunos - a.totalAlunos);

            xAxis.data.setAll(sortedMockData);
            series.data.setAll(sortedMockData);
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
  }, []);

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
}
export default ChartQtdAlunos;