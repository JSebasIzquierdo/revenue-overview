import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RevenueBySourceChart = ({ data }) => {
  // Step 1: Organize the data and calculate weekly totals

  const groupOrdersByWeek = (orders) => {
    // Calculate the week number for each order date
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
    // Calculate the week number for a given date
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday (0)
    return new Date(date.setDate(diff));
  };

  const groupedOrders = groupOrdersByWeek(data);

  // Function to calculate percentage
  const calculatePercentage = (revenue, totalRevenue) => {
    return (revenue / totalRevenue) * 100;
  };

  const seriesData = [];
  const sourceNames = {}; // Used to map source names to index in the series array

  // Iterate over all the sourceRevenueData objects
  for (const weekStartDate in groupedOrders) {
    const sourceRevenueData = groupedOrders[weekStartDate].sourceRevenue;
    const totalRevenue = groupedOrders[weekStartDate].totalRevenue;
    let totalPercentage = 0;

    // Calculate and add data for each source
    Object.keys(sourceRevenueData).forEach((source) => {
      const revenue = sourceRevenueData[source];
      const percentage = calculatePercentage(revenue, totalRevenue);
      totalPercentage += percentage;

      // If the source name is not already in the sourceNames object, add it with an index
      if (!sourceNames[source]) {
        sourceNames[source] = seriesData.length;
        seriesData.push({
          name: source,
          data: []
        });
      }

      // Push the percentage value to the corresponding data array in seriesData
      seriesData[sourceNames[source]].data.push(percentage);
    });

    // Ensure the total percentage sums up to 100% (necessary if there are rounding errors)
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
      type: 'datetime',
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
