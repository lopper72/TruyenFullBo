import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ifIphoneX = (iphoneXStyle: any, regularStyle: any) => {
  if (Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896)) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const ifAndroid = (androidStyle: any, regularStyle: any) => {
  if (Platform.OS === 'android') {
    return androidStyle;
  }
  return regularStyle;
}; 