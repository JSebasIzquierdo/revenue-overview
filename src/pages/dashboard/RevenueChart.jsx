import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RevenueBySourceChart = ({ data }) => {
  const groupOrdersByWeek = (orders) => {
    const groupedOrders = orders.reduce((result, order) => {
      const orderDate = new Date(order.order_date);
      const weekNumber = getFirstDayOfWeek(orderDate);

      if (!result[weekNumber]) {
        result[weekNumber] = {
          orders: [],
          totalRevenue: 0,
          sourceRevenue: {}
        };
      }

      result[weekNumber].orders.push(order);
      result[weekNumber].totalRevenue += parseInt(order.order_revenue);

      if (!result[weekNumber].sourceRevenue[order.order_revenue_source]) {
        result[weekNumber].sourceRevenue[order.order_revenue_source] = 0;
      }
      result[weekNumber].sourceRevenue[order.order_revenue_source] += parseInt(order.order_revenue);

      return result;
    }, {});

    return groupedOrders;
  };

  const getFirstDayOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const groupedOrders = groupOrdersByWeek(data);

  const calculatePercentage = (revenue, totalRevenue) => {
    return (revenue / totalRevenue) * 100;
  };

  const categories = Object.keys(groupedOrders).map((weekStartDate) => {
    const startDate = new Date(weekStartDate);
    const month = startDate.toLocaleString('default', { month: 'short' });
    const day = startDate.getDate();
    return `${month} ${day}`;
  });

  const seriesData = [];
  const sourceNames = {};

  for (const weekStartDate in groupedOrders) {
    const sourceRevenueData = groupedOrders[weekStartDate].sourceRevenue;
    const totalRevenue = groupedOrders[weekStartDate].totalRevenue;
    let totalPercentage = 0;

    Object.keys(sourceRevenueData).forEach((source) => {
      const revenue = sourceRevenueData[source];
      const percentage = calculatePercentage(revenue, totalRevenue);
      totalPercentage += percentage;

      if (!sourceNames[source]) {
        sourceNames[source] = seriesData.length;
        seriesData.push({
          name: source,
          data: []
        });
      }

      seriesData[sourceNames[source]].data.push(percentage);
    });

    if (totalPercentage !== 100) {
      const lastSourceIndex = seriesData.length - 1;
      seriesData[lastSourceIndex].data[seriesData[lastSourceIndex].data.length - 1] += 100 - totalPercentage;
    }
  }

  const options = {
    chart: {
      type: 'column',
      backgroundColor: '#202127'
    },
    title: {
      text: 'Revenue by Source (Stacked weekly)',
      align: 'left',
      margin: 30,
      style: {
        color: '#c7c8c9'
      }
    },
    xAxis: {
      categories: categories,
      labels: {
        style: {
          color: '#c7c8c9'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Percentage of Total Revenue',
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
      max: 100
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        borderColor: 'none'
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: '#c7c8c9'
      }
    },
    series: seriesData
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RevenueBySourceChart;
