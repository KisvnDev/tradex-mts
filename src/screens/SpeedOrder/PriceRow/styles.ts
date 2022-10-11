import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

const SpeedOrderColors = {
  OFFER: '#FFF3F2',
  SELL: 'rgb(241,181,181)',
  DISABLED: 'rgb(128,128,128)',
  DOWN: 'rgb(255, 244, 244)',
};

export default StyleSheet.create({
  row: {
    height: 40,
    flexDirection: 'row',
    borderColor: Colors.WHITE,
    borderBottomWidth: 1,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.WHITE,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  columnBig: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.WHITE,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  cancelBtn: {
    position: 'absolute',
    backgroundColor: Colors.RED,
    zIndex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    padding: 5,
    color: Colors.WHITE,
  },
  cancelBtnTriangleLeft: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 5,
    borderRightWidth: 12,
    borderRightColor: Colors.RED,
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    left: -10,
  },

  cancelBtnTriangleRight: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 5,
    borderLeftWidth: 12,
    borderLeftColor: Colors.RED,
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    right: -10,
  },
  rowText: {
    fontSize: 12,
  },
  offerQty: {
    backgroundColor: SpeedOrderColors.OFFER,
  },
  bidQty: {
    backgroundColor: Colors.BID_PRICE_BLUR,
  },
  rowSell: {
    backgroundColor: SpeedOrderColors.SELL,
  },
  rowBuy: {
    backgroundColor: Colors.BID_VOLUME_BLUR,
  },
  rowTextStopSell: {
    fontWeight: 'bold',
    color: Colors.DOWN,
    fontSize: 12,
    fontStyle: 'italic',
  },
  rowTextStopBuy: {
    fontWeight: 'bold',
    color: Colors.UP,
    fontSize: 12,
    fontStyle: 'italic',
  },
  rowTextSell: {
    fontWeight: 'bold',
    color: Colors.DOWN,
    fontSize: 12,
  },
  rowTextBuy: {
    fontWeight: 'bold',
    color: Colors.UP,
    fontSize: 12,
  },
  rowTextButtonStyle: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.LIGHT_GREY,
  },
  disabled: {
    flex: 1,
    backgroundColor: SpeedOrderColors.DISABLED,
  },
  highlight: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    backgroundColor: '#FFF',
  },
  upBackground: {
    backgroundColor: Colors.BID_PRICE_BLUR,
  },
  downBackground: {
    backgroundColor: SpeedOrderColors.DOWN,
  },
  currentPrice: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    backgroundColor: Colors.WHITE,
  },
  rowTextPrice: {
    fontWeight: 'bold',
  },
  leftStop: {
    left: width * 0.125 + 5,
  },
  rightStop: {
    right: width * 0.125 + 5,
  },
  leftNormal: {
    left: width * 0.25 + 5,
  },
  rightNormal: {
    right: width * 0.25 + 5,
  },
});
