import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import axios from "../../../api/axios";

/**
 * Cria um gráfico XY com base em um elemento de referência.
 *
 * @param {Object} chartRef - Referência ao elemento DOM onde o gráfico será renderizado.
 * @returns {Object} - Objeto contendo a raiz e o gráfico criado.
 */
export const createChart = (chartRef) => {
  // Inicializa a raiz do gráfico
  const root = am5.Root.new(chartRef.current);

  // Configura o gráfico XY
  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0,
      paddingRight: 1,
    })
  );

  // Configura o cursor do gráfico
  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);

  // Configura o eixo X
  const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30, minorGridEnabled: true });
  xRenderer.labels.template.setAll({
    rotation: -45,
    centerY: am5.p50,
    centerX: am5.p100,    
  });

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "uf",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  // Configura o eixo Y
  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  // Configura a série de dados
  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Quantidade de Alunos",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "totalAlunos",
      sequencedInterpolation: true,
      categoryXField: "uf",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
      }),
    })
  );

  // Configura a aparência das colunas
  series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
  series.columns.template.adapters.add("fill", (fill, target) =>
    chart.get("colors").getIndex(series.columns.indexOf(target))
  );
  series.columns.template.adapters.add("stroke", (stroke, target) =>
    chart.get("colors").getIndex(series.columns.indexOf(target))
  );

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      const response = await axios.get("/instituicoes/aggregated");

      // Ordena os dados pelo campo totalAlunos em ordem decrescente
      const sortedData = response.data.sort((a, b) => b.totalAlunos - a.totalAlunos);

      xAxis.data.setAll(sortedData);
      series.data.setAll(sortedData);
    } catch (error) {
      console.error("Erro ao buscar dados agregados:", error);
    }
  };

  // Chama a função para buscar dados
  fetchData();

  // Retorna a raiz e o gráfico criado
  return { root, chart };
};
