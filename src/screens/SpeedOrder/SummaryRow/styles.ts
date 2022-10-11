import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

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
  rowText: {
    fontSize: 12,
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
  totalOrder: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalOrderText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
