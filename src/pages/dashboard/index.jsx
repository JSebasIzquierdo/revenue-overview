import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Stack, Typography, Box } from '@mui/material';

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import RevenueByDateChart from './RevenueByDate';
import RevenueChart from './RevenueChart';
import RevenueBySourceChart from './RevenueBySource';
import calculateMetrics from 'utils/calculateMetrics';
import { formatNumber } from 'utils/formatNumber';
import Loadable from 'components/Loadable';
import Loader from 'components/Loader';

const DashboardDefault = () => {
  const [slot, setSlot] = useState('daily');
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataAgo, setFilteredDataAgo] = useState([]);
  const [filteredDataByMonth, setFilteredDataByMonth] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the CSV data from the API endpoint
    axios
      .get('http://localhost:5000/api/csv')
      .then((response) => {
        const data = response.data;

        console.log('data', data);
        // Parse the "order_date" strings into date objects
        const sortedData = data
          .map((item) => ({
            ...item,
            order_date: new Date(item.order_date)
          }))
          .sort((a, b) => b.order_date - a.order_date);
        setResponseData(sortedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
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

    const sixtyDaysAgo = new Date(latestOrderDate);
    sixtyDaysAgo.setDate(latestOrderDate.getDate() - 60);

    // Initialize an object to store the data grouped by months
    const dataByMonths = {};

    // Loop through the responseData and group orders by months
    responseData.forEach((item) => {
      const orderDate = new Date(item.order_date);
      if (orderDate >= thirtyDaysAgo && orderDate < latestOrderDate) {
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

    setFilteredData(responseData.filter((item) => item.order_date >= thirtyDaysAgo));
    setFilteredDataAgo(responseData.filter((item) => item.order_date >= sixtyDaysAgo && item.order_date < thirtyDaysAgo));
    setFilteredDataByMonth(monthsArray);
  }, [responseData]);

  if (isLoading) {
    return <Loader />;
  }

  // Call the function to get the calculated metrics
  const metrics = calculateMetrics(filteredData, filteredDataAgo);

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
            />
            <AnalyticEcommerce
              title="Total Orders"
              count={formatNumber(metrics.totalOrders)}
              percentage={metrics.totalOrdersLastMonthPercentage}
            />
            <AnalyticEcommerce
              title="New Customers"
              count={formatNumber(metrics.newCustomers)}
              percentage={metrics.newCustomersPercentage}
            />
            <AnalyticEcommerce
              title="% New Customers Revenue"
              count={formatNumber(metrics.newCustomersRevenueLastMonth)}
              percentage={metrics.newCustomersRevenueLastMonthPercentage}
            />
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
              percentage={metrics.averageRevenuePerDayPercentage}
            />
            <AnalyticEcommerce
              title="Avg Orders/Day"
              count={formatNumber(metrics.averageOrdersPerDay)}
              percentage={metrics.averageOrdersPerDayPercentage}
            />
            <AnalyticEcommerce
              title="Avg Items/Order"
              count={metrics.averageItemsPerOrder.toFixed(2)}
              percentage={metrics.averageItemsPerOrderPercentage}
            />
            <AnalyticEcommerce
              title="Avg Order Value"
              count={formatNumber(metrics.averageOrderValue)}
              percentage={metrics.averageOrderValuePercentage}
            />
            <AnalyticEcommerce
              title="Avg New Customers/Day"
              count={formatNumber(metrics.averageNewCustomersPerDay)}
              percentage={metrics.averageNewCustomersPerDayPercentage}
            />
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

export default Loadable(DashboardDefault);
