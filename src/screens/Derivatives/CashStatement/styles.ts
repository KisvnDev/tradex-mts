import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  inputSection: {
    height: 60,
    borderBottomWidth: 3,
    borderColor: Colors.LIGHTER_GREY,
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
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountPicker: {
    flex: 4,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  dataContainer: {
    flex: 3,
  },
  data: {
    fontSize: 11,
  },
});
