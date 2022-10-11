import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  labelTable: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.PRIMARY_1,
  },
  loader: {
    paddingTop: 5,
  },
  data: {
    flex: 1,
  },
  row: {
    height: 25,
    width: '100%',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  priceText: {
    fontSize: 12,
    textAlign: 'center',
  },
  volumeText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
