// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode) => {
  const colors = presetPalettes;

  const greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  const greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  return createTheme({
    palette: {
      mode: mode === 'dark' ? 'dark' : 'light',
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      text: {
        primary: paletteColor.grey[100], // Change to a suitable text color for dark mode
        secondary: paletteColor.grey[300], // Change to a suitable text color for dark mode
        disabled: paletteColor.grey[500] // Change to a suitable text color for dark mode
      },
      action: {
        disabled: paletteColor.grey[700] // Change to a suitable action color for dark mode
      },
      divider: paletteColor.grey[800], // Change to a suitable divider color for dark mode
      background: {
        paper: '#202127'        , // Change to a suitable background color for dark mode
        default: '#16181c' // Change to a suitable default background color for dark mode
      }
    }
  });
};

export default Palette;
