// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';

// project import
import HeaderContent from './HeaderContent';

// assets

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = () => {
  const theme = useTheme();

  // common header
  const mainHeader = (
    <Toolbar>
      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
      // boxShadow: theme.customShadows.z1
    }
  };

  return <AppBar {...appBar}>{mainHeader}</AppBar>;
};

export default Header;
