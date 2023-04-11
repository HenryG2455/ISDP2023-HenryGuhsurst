import { useEffect, useRef } from 'react';
import { Chart, PieController, LinearScale, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, LinearScale, CategoryScale, ArcElement, Tooltip, Legend);

function AllInventoryChart({ data }) {
  const chartRef = useRef(null);

  function aggregateData(data) {
    const chartData = {};

    data.forEach((record) => {
      const { site, quantity } = record;

      if (!chartData[site]) {
        chartData[site] = 0;
      }

      chartData[site] += quantity;
    });

    return chartData;
  }

  function generateChartDataAndOptions(data) {
    const aggregatedData = aggregateData(data);
    const labels = Object.keys(aggregatedData);

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: labels.map((site) => aggregatedData[site]),
          backgroundColor: labels.map(
            () => '#' + Math.floor(Math.random() * 16777215).toString(16)
          ),
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
    };

    return { chartData, chartOptions };
  }

  useEffect(() => {
    if (data && data.length > 0) {
      const { chartData, chartOptions } = generateChartDataAndOptions(data);
      const ctx = chartRef.current.getContext('2d');

      const chart = new Chart(ctx, {
        
        type: 'pie',
        data: chartData,
        options: chartOptions,
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return (<canvas title={'Company Inventory'} ref={chartRef} />);
}

export default AllInventoryChart;
