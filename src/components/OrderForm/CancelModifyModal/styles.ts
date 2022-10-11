import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    height: 90,
    alignItems: 'center',
  },
  itemSection: {
    paddingTop: 5,
    flex: 1,
    flexDirection: 'row',
  },
  codeSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  itemCode: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  text: {
    marginRight: 10,
    fontSize: 18,
  },
  buySell: {
    paddingBottom: 1,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  dateTime: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 5,
    alignItems: 'flex-end',
    marginLeft: 15,
  },
  dateTimeDerivatives: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 5,
    alignItems: 'flex-end',
  },
  dateTimeSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  itemDateTime: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    paddingLeft: 5,
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
  headerSection: {
    flexDirection: 'row',
    backgroundColor: Colors.BLUE,
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 76 : 56,
    paddingTop: Platform.OS === 'ios' ? 20 : undefined,
  },
  icon: {
    marginLeft: 18,
    fontSize: 22,
    color: Colors.WHITE,
  },
  textHeader: {
    marginLeft: 50,
    fontSize: 20,
    color: Colors.WHITE,
  },
  limitPriceContainer: {
    flex: 1,
  },
  textBold: {
    fontWeight: 'bold',
  },
  marginLeft: {
    marginLeft: 5,
  },
  marginRight: {
    marginRight: 30,
  },
  paddingLeft: {
    paddingLeft: 10,
  },
});
