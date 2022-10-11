import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inputSection: {
    height: 100,
  },
  itemSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
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
  pickerContainer: {
    flex: 1,
  },
  data: {
    fontSize: 11,
  },
  iconSize: {
    fontSize: 20,
  },
  disableButton: {
    opacity: 0.2,
  },
});
