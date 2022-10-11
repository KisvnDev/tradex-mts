import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: Colors.WHITE,
  },
  infoSection: {
    height: height > 640 ? 100 : 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GREY,
  },
  inputSection: {
    height: height > 700 ? 100 : 90,
    borderColor: Colors.LIGHT_GREY,
  },
  accountSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 5,
  },
  accountLabel: {
    flex: 2,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
    flex: 1,
  },
  quantityInputLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  quantityInputRight: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  quantityLabel: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
  },
  quantityLabelText: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  quantityValue: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
  },
  quantityValueText: {
    fontSize: 14,
    color: Colors.PRIMARY_1,
    textAlign: 'right',
  },
  quantityInput: {
    flex: 3,
    flexDirection: 'row',
    marginTop: -10,
  },
  quantityInputContainer: {
    flex: 1,
  },
  accountLabelText: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountPicker: {
    flex: 5,
  },
  accountPickerWithoutBank: {
    flex: 8,
  },
  accountBankPicker: {
    flex: 3,
    paddingRight: 5,
  },
  dataSection: {
    paddingTop: 5,
    flex: 1,
    flexGrow: 1,
  },
  opacityBackground: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    minHeight: 1,
    minWidth: 1,
  },
  listView: {
    flex: 1,
    minHeight: 1,
    minWidth: 1,
  },
  columnBig: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.WHITE,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  header: {
    height: 25,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 11,
    color: Colors.LIGHT_GREY,
    textAlign: 'center',
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
  rowTop: {
    height: 40,
    flexDirection: 'row',
    borderColor: Colors.WHITE,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  rowBottom: {
    height: 40,
    flexDirection: 'row',
    borderColor: Colors.WHITE,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  keyboardAccessoryContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY_1,
  },
  keyboardAccessoryItem: {
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: Colors.BORDER,
  },
  keyboardAccessoryText: {
    fontSize: 15,
    color: Colors.WHITE,
  },
});
