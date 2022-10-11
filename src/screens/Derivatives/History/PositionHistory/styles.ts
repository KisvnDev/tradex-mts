import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inputSection: {
    height: 60,
    paddingBottom: 10,
  },
  itemSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 5,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  dataContainer: {
    flex: 3,
  },
  data: {
    fontSize: 11,
  },
});
