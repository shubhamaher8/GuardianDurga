// Guardian Durga Theme
import { moderateScale, scale, wp } from '../utils/responsive';

const Theme = {
  colors: {
    primary: '#6200EE',
    primaryDark: '#3700B3',
    primaryLight: '#BB86FC',
    secondary: '#03DAC6',
    secondaryDark: '#018786',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    danger: '#F44336',
    text: '#212121',
    textLight: '#757575',
    border: '#E0E0E0',
    disabled: '#9E9E9E',
    disabledBackground: '#F5F5F5',
    disabledText: '#9E9E9E',
    ripple: 'rgba(98, 0, 238, 0.12)',
    accent: '#FF4081', // Adding accent color for floating button
  },
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },
  fontSizes: {
    xs: moderateScale(12),
    sm: moderateScale(14),
    md: moderateScale(16),
    lg: moderateScale(20),
    xl: moderateScale(24),
    xxl: moderateScale(32),
  },
  borderRadius: {
    xs: scale(2),
    sm: scale(4),
    md: scale(8),
    lg: scale(16),
    xl: scale(24),
    round: 999,
  },
  elevation: {
    none: 0,
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  },
  shadows: {
    none: {
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    semiBold: {
      fontFamily: 'System',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
  // Responsive layout breakpoints
  breakpoints: {
    smallPhone: wp(90), // 90% of small phone screen
    phone: wp(85),      // 85% of phone screen
    tablet: wp(75),     // 75% of tablet screen
  },
  // Responsive control sizes
  controlSizes: {
    buttonHeight: scale(48),
    inputHeight: scale(48),
    iconSize: {
      small: scale(16),
      medium: scale(24),
      large: scale(32),
      xlarge: scale(48)
    },
    avatarSize: {
      small: scale(32),
      medium: scale(48),
      large: scale(64),
      xlarge: scale(128)
    }
  }
};

export default Theme; 