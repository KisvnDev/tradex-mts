import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  inputSection: {
    height: 180,
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
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 5,
  },
  stockCode: {
    fontWeight: 'bold',
  },
  data: {
    fontSize: 11,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  labelPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountPicker: {
    flex: height > 640 ? 3 : 4,
  },
  dataContainer: {
    flex: 3,
  },
  pickerContainer: {
    flex: 3,
  },
  sheetData: {
    flex: 1,
  },
  txtMonths: {
    alignSelf: 'center',
    marginTop: 5,
  },
});
