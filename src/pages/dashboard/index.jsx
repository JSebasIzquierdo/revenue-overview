import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { Button, Grid, Stack, Typography, Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import RevenueByDateChart from './RevenueByDate';
import RevenueChart from './RevenueChart';
import RevenueBySourceChart from './RevenueBySource';

// charts imports

// sales report status

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [slot, setSlot] = useState('daily');
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataAgo, setFilteredDataAgo] = useState([]);
  const [filteredDataByMonth, setFilteredDataByMonth] = useState([]);

  useEffect(() => {
    // Fetch the CSV data from the API endpoint
    axios
      .get('http://localhost:5000/api/csv')
      .then((response) => {
        const data = response.data;
        // Parse the "order_date" strings into date objects
        const sortedData = data
          .map((item) => ({
            ...item,
            order_date: new Date(item.order_date)
          }))
          .sort((a, b) => b.order_date - a.order_date);
        setResponseData(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    // Filter the data to keep only the orders within the last 30 days from the latest order_date
    if (responseData.length === 0) {
      return;
    }

    // Find the latest date in the responseData
    const latestOrderDate = new Date(Math.max(...responseData.map((item) => item.order_date.getTime())));

    // Set the date to the start of the current month
    const startOfMonth = new Date(latestOrderDate);
    startOfMonth.setDate(1);

    // Calculate the date 30 days before the latest date
    const thirtyDaysAgo = new Date(latestOrderDate);
    thirtyDaysAgo.setDate(latestOrderDate.getDate() - 30);

    // Calculate the date 60 days before the latest date
    const sixtyDaysAgo = new Date(thirtyDaysAgo);
    sixtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Initialize an object to store the data grouped by months
    const dataByMonths = {};

    // Loop through the responseData and group orders by months
    responseData.forEach((item) => {
      const orderDate = new Date(item.order_date);
      if (orderDate >= sixtyDaysAgo) {
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
        if (!dataByMonths[monthKey]) {
          dataByMonths[monthKey] = [];
        }
        dataByMonths[monthKey].push(item);
      }
    });

    // Convert the grouped data object into an array of months
    const monthsArray = Object.keys(dataByMonths).map((monthKey) => ({
      month: monthKey,
      data: dataByMonths[monthKey]
    }));

    // Sort the monthsArray based on the month (you can customize the sorting logic if needed)
    monthsArray.sort((a, b) => {
      const [yearA, monthA] = a.month.split('-');
      const [yearB, monthB] = b.month.split('-');
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    // Filter the data based on the date range
    const filteredData = responseData.filter((item) => item.order_date >= thirtyDaysAgo);
    const filteredDataAgo = responseData.filter((item) => item.order_date >= sixtyDaysAgo);

    setFilteredData(filteredData);
    setFilteredDataAgo(filteredDataAgo);
    setFilteredDataByMonth(monthsArray);
  }, [responseData]);

  console.log(filteredDataByMonth);

  const calculateMetrics = () => {
    // Variables for the metrics
    var totalRevenue = 0;
    var totalOrders = 0;
    var newCustomers = 0;
    var newCustomersRevenue = 0;
    var averageRevenuePerDay = 0;
    var averageOrdersPerDay = 0;
    var averageItemsPerOrder = 0;
    var averageOrderValue = 0;
    var averageNewCustomersPerDay = 0;
    var totalRevenueLastMonth = 0;
    var totalOrdersLastMonth = 0;
    var totalRevenueLastMonthPercentage = 0;
    var totalOrdersLastMonthPercentage = 0;
    var newCustomersLastMonth = 0;
    var newCustomersRevenueLastMonth = 0;
    var averageRevenuePerDayLastMonth = 0;
    var averageOrdersPerDayLastMonth = 0;
    var averageItemsPerOrderLastMonth = 0;
    var averageOrderValueLastMonth = 0;
    var averageNewCustomersPerDayLastMonth = 0;
    var averageRevenuePerDayPercentage = 0;
    var averageOrdersPerDayPercentage = 0;
    var averageItemsPerOrderPercentage = 0;
    var averageOrderValuePercentage = 0;
    var averageNewCustomersPerDayPercentage = 0;

    filteredData.forEach((order) => {
      totalRevenue += parseInt(order.order_revenue);
      totalOrders += parseInt(order.num_orders);
      if (order.customer_type === 'New') {
        parseInt(newCustomers++);
        newCustomersRevenue += parseInt(order.order_revenue);
      }
    });

    filteredDataAgo.forEach((order) => {
      totalRevenueLastMonth += parseInt(order.order_revenue);
      totalOrdersLastMonth += parseInt(order.num_orders);
      if (order.customer_type === 'New') {
        parseInt(newCustomersLastMonth++);
        newCustomersRevenueLastMonth += parseInt(order.order_revenue);
      }
    });

    // Calculate averages based on the time range (30 days in this case)
    const numDays = 30;
    averageRevenuePerDay = totalRevenue / numDays;
    averageOrdersPerDay = totalOrders / numDays;
    averageItemsPerOrder = filteredData.reduce((sum, order) => sum + parseInt(order.item_quantity), 0) / filteredData.length;
    averageOrderValue = totalRevenue / totalOrders;
    averageNewCustomersPerDay = newCustomers / numDays;

    totalRevenueLastMonthPercentage = Math.round((totalRevenue / totalRevenueLastMonth) * 100);
    totalOrdersLastMonthPercentage = Math.round((totalOrders / totalOrdersLastMonth) * 100);

    averageRevenuePerDayLastMonth = totalRevenueLastMonth / numDays;
    averageOrdersPerDayLastMonth = totalOrdersLastMonth / numDays;
    averageItemsPerOrderLastMonth = filteredData.reduce((sum, order) => sum + parseInt(order.item_quantity), 0) / filteredData.length;
    averageOrderValueLastMonth = totalRevenueLastMonth / totalOrdersLastMonth;
    averageNewCustomersPerDayLastMonth = newCustomersLastMonth / numDays;

    averageRevenuePerDayPercentage = Math.round((averageRevenuePerDay / averageRevenuePerDayLastMonth) * 100);
    averageOrdersPerDayPercentage = Math.round((averageOrdersPerDay / averageOrdersPerDayLastMonth) * 100);
    averageItemsPerOrderPercentage = filteredData.reduce((sum, order) => sum + parseInt(order.item_quantity), 0) / filteredData.length;
    averageOrderValuePercentage = Math.round((averageOrderValue / averageOrderValueLastMonth) * 100);
    averageNewCustomersPerDayPercentage = Math.round((averageNewCustomersPerDay / averageNewCustomersPerDayLastMonth) * 100);

    return {
      totalRevenue,
      totalOrders,
      newCustomers,
      newCustomersRevenue,
      averageRevenuePerDay,
      averageOrdersPerDay,
      averageItemsPerOrder,
      averageOrderValue,
      averageNewCustomersPerDay,
      totalRevenueLastMonth,
      totalOrdersLastMonth,
      totalRevenueLastMonthPercentage,
      totalOrdersLastMonthPercentage,
      newCustomersLastMonth,
      newCustomersRevenueLastMonth,
      averageRevenuePerDayLastMonth,
      averageOrdersPerDayLastMonth,
      averageItemsPerOrderLastMonth,
      averageOrderValueLastMonth,
      averageNewCustomersPerDayLastMonth,
      averageRevenuePerDayPercentage,
      averageOrdersPerDayPercentage,
      averageItemsPerOrderPercentage,
      averageOrderValuePercentage,
      averageNewCustomersPerDayPercentage
    };
  };

  // Call the function to get the calculated metrics
  const metrics = calculateMetrics();

  //Tengo que hacerlo función global
  const formatNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    } else {
      const roundedNumber = Math.round(number);
      return roundedNumber.toString();
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard contentSX={{ display: 'flex', flexDirection: 'column' }} border={false}>
          <div>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4">General Metrics</Typography>
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <AnalyticEcommerce
              title="Total Revenue"
              count={formatNumber(metrics.totalRevenue)}
              percentage={metrics.totalRevenueLastMonthPercentage}
              color="#51d08d"
            />
            <AnalyticEcommerce
              title="Total Orders"
              count={formatNumber(metrics.totalOrders)}
              percentage={metrics.totalOrdersLastMonthPercentage}
              color="#51d08d"
            />
            <AnalyticEcommerce
              title="New Customers"
              count={formatNumber(metrics.newCustomers)}
              percentage={metrics.newCustomersLastMonth}
            />
            <AnalyticEcommerce title="% New Customers Revenue" count="78,250" percentage={metrics.newCustomersRevenueLastMonth} />
          </div>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard contentSX={{ display: 'flex', flexDirection: 'column' }} border={false}>
          <div>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4">Average Performance</Typography>
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <AnalyticEcommerce
              title="Avg Revenue/Day"
              count={formatNumber(metrics.averageRevenuePerDay)}
              percentage={59.3}
              extra="35,000"
            />
            <AnalyticEcommerce title="Avg Orders/Day" count={formatNumber(metrics.averageOrdersPerDay)} percentage={70.5} />
            <AnalyticEcommerce title="Avg Items/Order" count={formatNumber(metrics.averageItemsPerOrder)} percentage={70.5} />
            <AnalyticEcommerce title="Avg Order Value" count={formatNumber(metrics.averageOrderValue)} percentage={70.5} />
            <AnalyticEcommerce title="Avg New Customers/Day" count={formatNumber(metrics.averageNewCustomersPerDay)} percentage={70.5} />
          </div>
        </MainCard>
      </Grid>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={12} lg={12}>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => setSlot('daily')}
              color={slot === 'daily' ? 'primary' : 'secondary'}
              variant={slot === 'daily' ? 'outlined' : 'text'}
            >
              Daily
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('month')}
              color={slot === 'month' ? 'primary' : 'secondary'}
              variant={slot === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
          </Stack>
        </Grid>
        <MainCard sx={{ mt: 1.5 }} border={false}>
          <RevenueByDateChart data={slot === 'daily' ? filteredData : filteredDataByMonth} type={slot} />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <MainCard sx={{ mt: 1.75 }} border={false}>
          <RevenueChart data={filteredData} />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <MainCard sx={{ mt: 1.75 }} border={false}>
          <RevenueBySourceChart data={filteredData} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
