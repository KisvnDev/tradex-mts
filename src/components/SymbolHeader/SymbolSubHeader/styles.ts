import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  left: {
    paddingTop: 10,
    flex: 35,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePrice: {
    flex: 3,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  },
  estimatedPriceStyle: {
    flex: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimatedPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    color: Colors.DARK_GREY,
  },
  change: {
    flex: 2,
    fontSize: 14,
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  },
  candleStick: {
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 70,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  chart: {
    flex: 60,
  },
  rightButton: {
    width: 70,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: Colors.PRIMARY_1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    fontSize: 13,
    color: Colors.WHITE,
    paddingBottom: 5,
  },
});
