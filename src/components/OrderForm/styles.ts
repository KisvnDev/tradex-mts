import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.WHITE,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 4,
  },
  right: {
    flex: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  form: {
    flexGrow: 1,
    flex: 1,
  },
  formDisabled: {
    opacity: 0.5,
  },
  buttonSection: {
    marginTop: height > 640 ? 5 : 0,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.GREY,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBorder: {
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
  labelButton: {
    color: Colors.LIGHT_GREY,
    fontSize: 14,
  },
  active: {
    fontWeight: 'bold',
  },
  buy: {
    color: Colors.UP,
  },
  sell: {
    color: Colors.RED,
  },
  modify: {
    color: Colors.ORANGE,
  },
  itemSection: {
    height: height > 640 ? 70 : 40,
    flexDirection: 'row',
  },
  itemSection2: {
    height: 30,
    flexDirection: 'row',
  },
  itemSectionContainer: {
    height: height > 640 ? 100 : 70,
  },
  itemSectionContainer2: {
    height: height > 640 ? 70 : 40,
  },
  labelSection: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: height > 640 ? 10 : 5,
  },
  labelSection3: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: height > 640 ? 10 : 5,
    alignItems: 'center',
  },
  labelSection2: {
    flex: 2,
  },
  orderTypeLabel: {
    marginBottom: height > 640 ? 30 : 15,
  },
  dateLabelSection: {
    marginBottom: height > 640 ? 20 : 10,
  },
  labelText: {
    fontSize: height > 750 ? 11 : 9,
  },
  valueSection: {
    flex: 7,
    paddingLeft: 5,
    justifyContent: 'center',
  },
  valueSection2: {
    flex: 7,
    flexDirection: 'row',
    paddingLeft: 5,
  },
  buttonBuy: {
    backgroundColor: Colors.UP,
  },
  buttonSell: {
    backgroundColor: Colors.RED,
  },
  buttonCancel: {
    backgroundColor: Colors.ORANGE,
  },
  buttonModify: {
    backgroundColor: Colors.GREEN,
  },
  bottomButton: {
    alignItems: 'stretch',
    height: 40,
    marginTop: 10,
  },
  buttonStyle: {
    height: height > 640 ? 40 : 30,
  },
  valueTextClickable: {
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: Colors.PRIMARY_1,
  },
  valueRatio: {
    alignSelf: 'flex-end',
    color: Colors.BLACK,
  },
  firstValue: {
    flex: 1,
  },
  secondValue: {
    flex: 1,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
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
  alignItemCenter: {
    alignItems: 'center',
  },
  paddingTop: {
    paddingTop: 5,
  },
  limitPriceOption: {
    flex: 1,
    backgroundColor: Colors.GREY,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  limitPriceOption2: {
    flex: 1,
    backgroundColor: Colors.GREY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  selected: {
    backgroundColor: Colors.PRIMARY_1,
  },
  selectedText: {
    color: Colors.WHITE,
  },
});
