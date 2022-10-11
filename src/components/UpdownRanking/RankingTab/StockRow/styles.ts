import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    backgroundColor: Colors.LIGHTER_GREY,
  },
  stockCode: {
    fontSize: 18,
    color: Colors.DARK_GREY,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  rate: {
    fontSize: 13,
  },
  item: {
    flex: 1,
  },
});
