export const formatNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    const roundedNumber = Math.round(number);
    return roundedNumber.toString();
  }
};
