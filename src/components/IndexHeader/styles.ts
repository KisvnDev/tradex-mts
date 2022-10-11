import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

const IndexHeaderColors = {
  LEFT: '#D0E5F3',
  RIGHT: '#FFCCCC',
};
export default StyleSheet.create({
  container: {
    height: 130,
  },
  top: {
    height: 80,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
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
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 60,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  chart: {
    flex: 1,
  },
  rightButton: {
    width: 80,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 8,
    marginBottom: 8,
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
    fontSize: 11,
    padding: 5,
    fontWeight: 'bold',
  },
  buttonIcon: {
    fontSize: 12,
    color: Colors.WHITE,
    paddingBottom: 5,
  },
  changeSection: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
  },
  changeSectionLeft: {
    flex: 1,
    height: 45,
    backgroundColor: IndexHeaderColors.LEFT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 17,
  },
  changeSectionRight: {
    flex: 1,
    height: 45,
    backgroundColor: IndexHeaderColors.RIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 17,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconUp: {
    color: Colors.UP,
    fontSize: 14,
  },
  iconDown: {
    color: Colors.DOWN,
    fontSize: 14,
  },
  rec: {
    width: 50,
    height: 45,
    flexDirection: 'row',
  },
  recLeft: {
    flex: 1,
    backgroundColor: IndexHeaderColors.LEFT,
  },
  recRight: {
    flex: 1,
    backgroundColor: IndexHeaderColors.RIGHT,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 45 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
