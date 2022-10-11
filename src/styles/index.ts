import { StyleSheet, Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');
export const scapingElement = 15;

export const Colors = {
  PRIMARY_1: 'rgb(1, 108, 197)',
  PRIMARY_2: 'rgb(102, 102, 102)',
  PRIMARY_KBSV: 'rgb(255, 204, 0)',
  SUB_2: 'rgb(110, 110, 110)',
  WHITE: 'rgb(255, 255, 255)',
  BLUE: 'rgb(1, 108, 197)',
  LIGHT_BLUE: 'rgb(23, 131, 195)',
  BLACK: 'rgb(0, 0, 0)',
  YELLOW: 'rgb(255, 222, 2)',
  GREY: 'rgb(240,240,240)',
  DARK_GREY: 'rgb(36, 39, 43)',
  LIGHT_GREY: 'rgb(77, 81, 87)',
  LIGHTER_GREY: 'rgb(248, 248, 248)',
  BORDER: 'rgb(194, 194, 194)',
  BORDER_LIGHT: '#E0E0E0',
  BACKGROUND_MODAL: 'rgba(194, 194, 194, 0.5)',
  OPACITY_BACKGROUND: 'rgba(0, 0, 0, 0.4)',
  RED: 'rgb(255, 0, 0)',
  GREEN: '#39a121',
  ORANGE: 'orange',
  UP: 'rgb(0, 128, 0)',
  DOWN: 'rgb(237, 68, 68)',
  STEADY: 'rgb(0, 0, 0)',
  CEILING: '#c633c6',
  REFERENCE: '#f39324',
  FLOOR: '#02afee',
  HNX: '#39a121',
  HOSE: 'rgb(255, 143, 31)',
  UPCOM: 'rgb(50, 57, 219)',
  OFFER_VOLUME_BLUR: 'rgba(255, 0, 0, 0.2)',
  BID_VOLUME_BLUR: 'rgba(0, 128, 0,0.3)',
  OFFER_PRICE_BLUR: 'rgba(255, 0, 0, 0.1)',
  BID_PRICE_BLUR: 'rgba(0, 128, 0,0.1)',
  EKYC_BLUE: '#00B3C6',
  EKYC_BORDER: '#E0E0E0',
  EKYC_UPLOAD: '#E9F3FF',
};

export const Styles = {
  APP_BACKGROUND_COLOR: Colors.WHITE,
};

const globalStyles = StyleSheet.create({
  chartContainer: {
    flex: 1,
  },
  chart: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  up: {
    color: Colors.UP,
  },
  down: {
    color: Colors.RED,
  },
  steady: {
    color: Colors.STEADY,
  },
  reference: {
    color: Colors.REFERENCE,
  },
  ceiling: {
    color: Colors.CEILING,
  },
  floor: {
    color: Colors.FLOOR,
  },
  noData: {
    color: Colors.BLACK,
  },
  HOSE: {
    color: Colors.HOSE,
  },
  HNX: {
    color: Colors.HNX,
  },
  UPCOM: {
    color: Colors.UPCOM,
  },
  ORANGE: {
    color: Colors.ORANGE,
  },
  GREEN: {
    color: Colors.GREEN,
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
  },
  bizIcon: {
    fontSize: height > 640 ? 25 : 15,
    color: Colors.DARK_GREY,
  },
  boldText: {
    fontWeight: 'bold',
  },
  newContainer: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
    position: 'absolute',
    top: height > 640 ? -6 : -5,
    left: height > 640 ? 30 : 20,
  },
  newText: {
    color: 'white',
    fontSize: height > 640 ? 8 : 6,
  },
  marginTop: {
    marginTop: scapingElement,
  },
  marginBottom: {
    marginBottom: scapingElement,
  },
  scapingElement: {
    marginVertical: scapingElement,
  },
});
export default globalStyles;
