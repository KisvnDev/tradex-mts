import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 30,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    flex: 1,
  },
  rowTitle: {
    backgroundColor: Colors.GREY,
    justifyContent: 'center',
  },
  rowContent: {
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
  },
  borderRight: {
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
  borderBottom: {
    borderBottomColor: Colors.LIGHTER_GREY,
    borderBottomWidth: 1,
  },
  titleText: {
    textAlign: 'center',
  },
  contentText: {
    textAlign: 'right',
    paddingRight: 10,
  },
  mainRowTitle: {
    flex: 1,
  },
  mainRowContent: {
    flex: 1,
  },
});
