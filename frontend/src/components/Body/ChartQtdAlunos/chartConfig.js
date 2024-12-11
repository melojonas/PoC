import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import axios from "../../../api/axios";

export const createChart = (chartRef) => {
  const root = am5.Root.new(chartRef.current);

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);

  const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
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

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Qtd Alunos",
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

  series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
  series.columns.template.adapters.add("fill", (fill, target) =>
    chart.get("colors").getIndex(series.columns.indexOf(target))
  );
  series.columns.template.adapters.add("stroke", (stroke, target) =>
    chart.get("colors").getIndex(series.columns.indexOf(target))
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("/instituicoes/aggregated");
      xAxis.data.setAll(response.data);
      series.data.setAll(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados agregados:", error);
    }
  };

  fetchData();

  return { root, chart };
};
