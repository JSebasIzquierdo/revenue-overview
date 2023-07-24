import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RevenueBySourceChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Process the data and create the chart options.
    const options = createChartOptions(data);

    // Update the state with the chart options.
    setChartOptions(options);
  }, [data]);

  const createChartOptions = (data) => {
    // Calculate the total revenue for each revenue source.
    const revenueBySource = {};
    data.forEach((item) => {
      const revenueSource = item.order_revenue_source;
      if (!revenueBySource[revenueSource]) {
        revenueBySource[revenueSource] = 0;
      }
      revenueBySource[revenueSource] += parseFloat(item.order_revenue);
    });

    // Convert the data to an array of objects.
    const chartData = Object.keys(revenueBySource).map((revenueSource) => ({
      name: revenueSource,
      y: revenueBySource[revenueSource]
    }));

    // Sort the chartData based on total revenue in descending order
    chartData.sort((a, b) => b.y - a.y);

    // Create the chart options based on the processed data.
    return {
      chart: {
        type: 'bar',
        backgroundColor: '#202127'
      },
      title: {
        text: 'Revenue by Source',
        align: 'left',
        margin: 30,

        style: {
          color: '#c7c8c9'
        }
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            color: '#c7c8c9'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Total Revenue',
          style: {
            color: '#c7c8c9'
          }
        },
        labels: {
          style: {
            color: '#c7c8c9'
          }
        }
      },
      series: [
        {
          name: 'Revenue',
          data: chartData,
          color: '#003f5c'
        }
      ],
      plotOptions: {
        bar: {
          borderColor: 'none'
        }
      },
      legend: {
        itemStyle: {
          color: '#c7c8c9'
        }
      }
    };
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default RevenueBySourceChart;
