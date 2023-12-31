import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

const RevenueByDateChart = ({ data, type }) => {
  RevenueByDateChart.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        order_date: PropTypes.instanceOf(Date),
        order_revenue: PropTypes.number,
        customer_type: PropTypes.string,
        num_orders: PropTypes.number,
        date: PropTypes.string
      })
    ),
    type: PropTypes.oneOf(['daily', 'month'])
  };

  const getDailyChartData = (data) => {
    const revenueByDate = {};
    const existingCustomerRevenue = {};
    const existingCustomerOrdersByDate = {};
    const newCustomerOrdersByDate = {};

    data?.forEach((item) => {
      const dateStr = item.order_date.toISOString().substr(0, 10);
      if (item.customer_type === 'Existing') {
        existingCustomerRevenue[dateStr] = (existingCustomerRevenue[dateStr] || 0) + parseFloat(item.order_revenue);
        existingCustomerOrdersByDate[dateStr] = (existingCustomerOrdersByDate[dateStr] || 0) + parseInt(item.num_orders);
      }
    });

    data?.forEach((item) => {
      const dateStr = item.order_date.toISOString().substr(0, 10);
      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + parseFloat(item.order_revenue);
      newCustomerOrdersByDate[dateStr] = (newCustomerOrdersByDate[dateStr] || 0) + parseInt(item.num_orders);
    });

    const chartData = Object.keys(revenueByDate).map((dateStr) => ({
      date: dateStr,
      revenue: revenueByDate[dateStr],
      existingRevenue: existingCustomerRevenue[dateStr],
      existingCustomerOrders: existingCustomerOrdersByDate[dateStr] || 0,
      newCustomerOrders: newCustomerOrdersByDate[dateStr] || 0
    }));

    chartData?.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  const getMonthlyChartData = (data) => {
    const chartData = data.map((monthData) => {
      const revenue = monthData.data.reduce((sum, item) => sum + parseFloat(item.order_revenue), 0);
      const existingRevenue = monthData.data
        .filter((item) => item.customer_type === 'Existing')
        .reduce((sum, item) => sum + parseFloat(item.order_revenue), 0);
      const existingCustomerOrders = monthData.data
        .filter((item) => item.customer_type === 'Existing')
        .reduce((sum, item) => sum + parseInt(item.num_orders), 0);
      const newCustomerOrders = monthData.data
        .filter((item) => item.customer_type === 'New')
        .reduce((sum, item) => sum + parseInt(item.num_orders), 0);

      return {
        date: monthData.month,
        revenue: revenue,
        existingRevenue: existingRevenue,
        existingCustomerOrders: existingCustomerOrders,
        newCustomerOrders: newCustomerOrders
      };
    });

    chartData?.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  const chartData = useMemo(() => {
    return type === 'daily' ? getDailyChartData(data) : getMonthlyChartData(data);
  }, [data, type]);

  const xAxisCategories = chartData.map((data) => {
    if (type === 'daily') {
      return data.date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    } else if (type === 'month') {
      const [year, month] = data.date.split('-');
      const formattedDate = new Date(year, parseInt(month) - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const [formattedMonth, formattedYear] = formattedDate.split(' ');
      const result = `${formattedMonth}, ${formattedYear}`;
      return result;
    }
    return '';
  });

  const settingsXAxis = () => {
    if (type === 'daily') {
      return {
        formatter: function () {
          return Highcharts.dateFormat('%b %e', new Date(this.value));
        },
        style: {
          color: '#fff'
        },
        rotation: -45
      };
    } else if (type.startsWith('month')) {
      return {
        style: {
          color: '#fff'
        },
        rotation: -50
      };
    }
  };

  const options = useMemo(() => {
    return {
      chart: {
        type: 'column',
        backgroundColor: '#202127'
      },

      title: {
        text: 'Revenue By Date',
        align: 'left',
        margin: 30,
        style: {
          color: '#c7c8c9'
        }
      },
      xAxis: {
        categories: xAxisCategories,
        labels: settingsXAxis(),
        lineColor: '#ddd'
      },
      yAxis: [
        {
          labels: {
            style: {
              color: '#c7c8c9'
            }
          },
          title: {
            text: 'Existing Customer Revenue',
            style: {
              color: '#c7c8c9'
            }
          }
        },

        {
          labels: {
            style: {
              color: '#c7c8c9'
            }
          },
          title: {
            text: 'Total Orders',
            style: {
              color: '#c7c8c9'
            }
          },
          gridLineColor: '#c7c8c9',
          opposite: true
        }
      ],
      plotOptions: {
        column: {
          stacking: 'column',
          borderColor: 'none'
        }
      },
      tooltip: {
        pointFormatter: function () {
          return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${Highcharts.numberFormat(
            this.y,
            2,
            ',',
            '.'
          )}</b><br/>`;
        }
      },
      series: [
        {
          name: 'New Customer Revenue',
          data: chartData.map((data) => data.revenue),
          dataLabels: {
            enabled: true,
            verticalAlign: 'top',
            formatter: function () {
              return Highcharts.numberFormat(this.y, 0, ',', '.');
            },
            style: {
              color: '#c7c8c9'
            }
          },
          color: '#fff58c'
        },
        {
          name: 'Existing Customer Revenue',
          data: chartData.map((data) => data.existingRevenue),
          color: '#b6b7c2'
        },
        {
          name: 'Total Orders',
          data: chartData.map((data) => data.existingCustomerOrders + data.newCustomerOrders),
          yAxis: 1,
          type: 'line',
          color: '#40424d'
        },
        {
          name: 'New Customer Orders',
          data: chartData.map((data) => data.newCustomerOrders),
          yAxis: 1,
          type: 'line',
          color: '#ff9b0f'
        }
      ],
      legend: {
        align: 'right',
        symbolWidth: 10,
        symbolHeight: 10,
        layout: 'horizontal',
        itemStyle: {
          color: '#c7c8c9'
        }
      }
    };
  }, [chartData, type]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RevenueByDateChart;
