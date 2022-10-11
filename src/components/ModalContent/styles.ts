import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  minmaxHeight: {
    maxHeight: 300,
  },
  infoContent: {
    width: 250,
    flexDirection: 'row',
  },
  infoContentLeft: {
    flex: 2,
    backgroundColor: Colors.GREY,
    borderRightWidth: 1,
    borderRightColor: Colors.BORDER,
    paddingLeft: 10,
  },
  infoContentRight: {
    flex: 3,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  infoText: {
    fontSize: 10,
  },
  rowHeight: {
    height: 30,
    justifyContent: 'flex-start',
  },
});
