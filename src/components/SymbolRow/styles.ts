import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: 50,
    flexDirection: 'row',
    padding: 3,
    paddingRight: 10,
    paddingLeft: 10,
  },
  highlight: {
    backgroundColor: Colors.LIGHTER_GREY,
  },
  checkBoxSection: {
    flex: 1,
    paddingLeft: 5,
  },
  symbolCodeSection: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  symbolCode: {
    fontSize: 12,
    color: Colors.DARK_GREY,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dataContainer: {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  priceSection: {
    flex: 3,
    justifyContent: 'center',
  },
  rankingPrice: {
    fontSize: 14,
  },
  price: {
    textAlign: 'right',
    fontSize: 17,
  },
  tradingVolume: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.LIGHT_GREY,
  },
  changeSection: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rankingChange: {
    paddingTop: 6,
  },
  rankingChangeData: {
    marginRight: 10,
  },
  tradingSection: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tradingSectionLabel: {
    fontSize: 14,
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  caretIcon: {
    flex: 1,
    fontSize: 20,
  },
  candleStick: {
    paddingLeft: 20,
    flex: 1,
  },
  content: {
    flex: 3,
    flexDirection: 'row',
  },
  change: {
    fontSize: height > 640 ? 12 : 9,
    textAlign: 'right',
    flex: 1,
    alignSelf: 'flex-end',
  },

  changeRate: {
    fontSize: 15,
    textAlign: 'right',
  },

  buttonSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  orderButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },

  rowDataHeight: {
    height: 35,
  },

  iconReorder: {
    color: Colors.SUB_2,
    fontSize: 18,
  },
});
