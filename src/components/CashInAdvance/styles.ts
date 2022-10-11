import { StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  wrapperTextInput: {
    paddingTop: heightPercentageToDP(4),
  },
  label: {
    fontWeight: '600',
  },
  textBold: {
    color: Colors.BLUE,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  nomalText: {
    fontSize: 13,
  },
  textInutStyle: {
    maxHeight: heightPercentageToDP(4),
    padding: 0,
    textAlign: 'right',
    fontSize: 13,
    borderColor: Colors.BORDER_LIGHT,
    borderWidth: 1,
    paddingRight: 4,
  },
  spaceLine: {
    paddingVertical: 8,
  },
  feeStyle: {
    paddingBottom: 16,
  },
  textInput: {
    width: '38%',
  },
  leftBtnStyle: {
    backgroundColor: '#E0E0E0',
    borderColor: Colors.BORDER_LIGHT,
    borderWidth: 1,
    width: '45%',
    height: heightPercentageToDP(6),
    borderRadius: 4,
  },
  btnLeftTextStyle: {
    color: Colors.BLACK,
  },
  rightBtnStyle: {
    width: '45%',
    height: heightPercentageToDP(6),
    borderRadius: 4,
  },
  containerContent: {
    paddingHorizontal: 10,
  },
  itemContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
  amountMaxWidth: {
    maxWidth: '40%',
    textAlign: 'right',
  },
  errorStyle: {
    position: 'absolute',
    top: -5,
    right: 0,
    maxWidth: widthPercentageToDP(50),
  },
  containerButton: {
    justifyContent: 'space-evenly',
  },
});
