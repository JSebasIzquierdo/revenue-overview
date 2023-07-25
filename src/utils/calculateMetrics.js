const calculateMetrics = (filteredData, filteredDataAgo) => {
  console.log(filteredData, filteredDataAgo);
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
    totalRevenue += parseFloat(order.order_revenue);
    totalOrders += parseInt(order.num_orders);
    if (order.customer_type === 'New') {
      newCustomers++;
      newCustomersRevenue += parseFloat(order.order_revenue);
    }
  });

  filteredDataAgo.forEach((order) => {
    totalRevenueLastMonth += parseFloat(order.order_revenue);
    totalOrdersLastMonth += parseInt(order.num_orders);
    if (order.customer_type === 'New') {
      parseInt(newCustomersLastMonth++);
      newCustomersRevenueLastMonth += parseFloat(order.order_revenue);
    }
  });

  // Calculate averages based on the time range (30 days in this case)
  const numDays = 30;
  averageRevenuePerDay = totalRevenue / numDays;
  averageOrdersPerDay = totalOrders / numDays;
  averageItemsPerOrder =
    totalOrders > 0 ? filteredData.reduce((sum, order) => sum + (parseInt(order.item_quantity) || 0), 0) / totalOrders : 0;
  averageOrderValue = totalRevenue / totalOrders;
  averageNewCustomersPerDay = newCustomers / numDays;

  // Calculate percentage change in metrics compared to the last month
  totalRevenueLastMonthPercentage = Math.round(((totalRevenue - totalRevenueLastMonth) / totalRevenueLastMonth) * 100);
  totalOrdersLastMonthPercentage = Math.round(((totalOrders - totalOrdersLastMonth) / totalOrdersLastMonth) * 100);

  const newCustomersPercentage = Math.round(((newCustomers - newCustomersLastMonth) / newCustomersLastMonth) * 100);
  const newCustomersRevenueLastMonthPercentage = Math.round(
    ((newCustomersRevenue - newCustomersRevenueLastMonth) / newCustomersRevenueLastMonth) * 100
  );

  averageRevenuePerDayLastMonth = totalRevenueLastMonth / numDays;
  averageOrdersPerDayLastMonth = totalOrdersLastMonth / numDays;
  averageItemsPerOrderLastMonth =
    totalOrdersLastMonth > 0 ? filteredDataAgo.reduce((sum, order) => sum + parseInt(order.item_quantity), 0) / totalOrdersLastMonth : 0;
  averageOrderValueLastMonth = totalRevenueLastMonth / totalOrdersLastMonth;
  averageNewCustomersPerDayLastMonth = newCustomersLastMonth / numDays;

  averageRevenuePerDayPercentage = Math.round(
    ((averageRevenuePerDay - averageRevenuePerDayLastMonth) / averageRevenuePerDayLastMonth) * 100
  );
  averageOrdersPerDayPercentage = Math.round(((averageOrdersPerDay - averageOrdersPerDayLastMonth) / averageOrdersPerDayLastMonth) * 100);
  averageItemsPerOrderPercentage =
    averageOrdersPerDayLastMonth > 0
      ? Math.round(((averageItemsPerOrder - averageItemsPerOrderLastMonth) / averageItemsPerOrderLastMonth) * 100)
      : 0;
  averageOrderValuePercentage = Math.round(((averageOrderValue - averageOrderValueLastMonth) / averageOrderValueLastMonth) * 100);
  averageNewCustomersPerDayPercentage = Math.round(
    ((averageNewCustomersPerDay - averageNewCustomersPerDayLastMonth) / averageNewCustomersPerDayLastMonth) * 100
  );

  console.log(averageItemsPerOrder, averageItemsPerOrderLastMonth);

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
    averageNewCustomersPerDayPercentage,
    newCustomersPercentage,
    newCustomersRevenueLastMonthPercentage
  };
};

export default calculateMetrics;
