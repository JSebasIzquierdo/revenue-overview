import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RevenueByStateChart = ({ data }) => {
  // Check if data exists and is an array before processing
  if (!data || !Array.isArray(data)) {
    return null; // Return null or an error message to handle invalid data
  }

  // Map data to Highcharts series format and unify revenue for "United States of America"
  const chartData = data.reduce((accumulator, item) => {
    const country = item.order_country.trim().toLowerCase();
    const existingIndex = accumulator.findIndex((elem) => elem.name.toLowerCase() === country);

    if (existingIndex !== -1) {
      accumulator[existingIndex].y += parseFloat(item.order_revenue);
    } else {
      accumulator.push({ name: item.order_country, y: parseFloat(item.order_revenue) });
    }

    return accumulator;
  }, []);

  // Find the maximum revenue value to dynamically set the y-axis maximum
  const maxRevenue = Math.max(...chartData.map((item) => item.y));

  const options = {
    chart: {
      type: 'column',
      backgroundColor: '#202127'
    },
    title: {
      text: 'Revenue In Countries',
      align: 'left',
      margin: 30,
      style: {
        color: '#c7c8c9'
      }
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
      crosshair: true,
      lineColor: '#ddd',
      labels: {
        style: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Revenue ($)',
        style: {
          color: '#c7c8c9'
        }
      },
      labels: {
        style: {
          color: '#c7c8c9'
        }
      },
      min: 0,
      max: maxRevenue + maxRevenue * 0.1 // Set a dynamic maximum value for the y-axis
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>${point.y:.2f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        borderColor: 'none'
      }
    },
    series: [
      {
        name: 'Revenue by Countries',
        data: chartData.map((item) => item.y),
        dataLabels: {
          style: {
            color: '#c7c8c9'
          }
        },
        color: '#fff58c'
      }
    ],
    legend: {
      symbolWidth: 10,
      symbolHeight: 10,
      layout: 'horizontal',
      itemStyle: {
        color: '#c7c8c9'
      }
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RevenueByStateChart;
