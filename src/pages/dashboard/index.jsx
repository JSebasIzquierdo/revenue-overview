import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Stack, Typography, Box } from '@mui/material';

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import RevenueByDateChart from './RevenueByDate';
import RevenueChart from './RevenueChart';
import RevenueBySourceChart from './RevenueBySource';
import RevenueByStateChart from './RevenueByState';
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
    axios
      .get('http://localhost:5000/api/csv')
      .then((response) => {
        const data = response.data;

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
    if (responseData.length === 0) {
      return;
    }

    const latestOrderDate = new Date(Math.max(...responseData.map((item) => item.order_date.getTime())));

    const startOfMonth = new Date(latestOrderDate);
    startOfMonth.setDate(1);

    const thirtyDaysAgo = new Date(latestOrderDate);
    thirtyDaysAgo.setDate(latestOrderDate.getDate() - 30);

    const sixtyDaysAgo = new Date(latestOrderDate);
    sixtyDaysAgo.setDate(latestOrderDate.getDate() - 60);

    const dataByMonths = {};

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

    const monthsArray = Object.keys(dataByMonths).map((monthKey) => ({
      month: monthKey,
      data: dataByMonths[monthKey]
    }));

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
      <Grid item xs={12} md={12} lg={12}>
        <MainCard sx={{ mt: 1.75 }} border={false}>
          <RevenueByStateChart data={filteredData} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Loadable(DashboardDefault);
