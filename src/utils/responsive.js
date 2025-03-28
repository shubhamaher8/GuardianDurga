import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions we design for
const baseWidth = 375; // iPhone X width
const baseHeight = 812; // iPhone X height

// Scales to resize elements proportionally based on screen size
const widthScale = width / baseWidth;
const heightScale = height / baseHeight;

// Helper function to scale values proportionally
const scale = (size, based = 'width') => {
  const scale = based === 'height' ? heightScale : widthScale;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Responsive width - percentage of screen width
const wp = (percentage) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

// Responsive height - percentage of screen height
const hp = (percentage) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

// Font scaling (avoid fonts becoming too large on tablets or too small on small phones)
const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Detect if device is a tablet
const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  
  return (
    (adjustedWidth >= 1000 || adjustedHeight >= 1000) && 
    (adjustedWidth / adjustedHeight > 1.6 || adjustedHeight / adjustedWidth > 1.6)
  );
};

// Screen dimensions & orientation
const screenDimensions = {
  width,
  height,
  isPortrait: () => height > width,
  isLandscape: () => width > height,
  isTablet: isTablet()
};

// Listen for dimension changes (like rotation)
const listenOrientationChange = (callback) => {
  return Dimensions.addEventListener('change', callback);
};

export {
  scale,
  wp,
  hp,
  moderateScale,
  isTablet,
  screenDimensions,
  listenOrientationChange
}; 