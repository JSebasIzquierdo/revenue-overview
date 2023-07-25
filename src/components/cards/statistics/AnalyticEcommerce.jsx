import PropTypes from 'prop-types';
import { Chip, Grid, Stack, Typography } from '@mui/material';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';

const AnalyticEcommerce = ({ title, count, percentage }) => {
  // Determine whether it's a loss based on the percentage
  const isLoss = percentage < 0;

  // Define styles for the label based on isLoss condition
  const labelStyle = {
    color: isLoss ? '#f5222d' : '#51d08d',
    backgroundColor: 'transparent' // Use red color for loss, otherwise use the provided color prop
  };

  return (
    <div>
      <Stack spacing={0.5}>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          {percentage && (
            <Grid item>
              <Chip
                variant="combined"
                icon={
                  <>
                    {!isLoss && <CaretUpFilled style={{ fontSize: '0.75rem', color: '#51d08d' }} />}
                    {isLoss && <CaretDownFilled style={{ fontSize: '0.75rem', color: '#f5222d' }} />}
                  </>
                }
                label={`${percentage}%`}
                sx={{ ml: 0.5, pr: 0 }}
                size="small"
                style={labelStyle} // Apply the style based on the condition
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
    </div>
  );
};

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number
};

AnalyticEcommerce.defaultProps = {
  color: 'primary'
};

export default AnalyticEcommerce;
