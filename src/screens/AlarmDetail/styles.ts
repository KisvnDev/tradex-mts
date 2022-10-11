import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  inputSection: {
    paddingTop: 15,
    flex: 1,
  },
  priceInput: {
    flexDirection: 'row',
    flex: 1,
  },
  inputItem: {
    flex: 1,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 5,
  },

  textBoxContainer: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  labelSection: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  labelTextBox: {
    color: Colors.DARK_GREY,
    fontSize: 17,
    flex: 1,
    fontFamily: 'Noto Sans',
  },
  labelErrorSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelError: {
    color: Colors.RED,
    fontSize: 17,
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
  },
  errorIcon: {
    marginLeft: 5,
    width: 17,
    color: Colors.RED,
    fontSize: 17,
  },
  textBox: {
    height: height > 640 ? 42 : 32,
    borderWidth: 1,
    borderColor: Colors.DARK_GREY,
    fontSize: height > 640 ? 16 : 14,
    color: Colors.DARK_GREY,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Noto Sans',
  },
  textBoxNumber: {
    textAlign: 'right',
  },
  errorTextBox: {
    borderColor: Colors.RED,
  },
  optionInput: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 5,
  },
  buttonInput: {
    flex: 1,
    marginTop: 5,
    padding: 5,
  },
  sliderInput: {
    flex: 1,
    padding: 5,
  },
  slider: {
    flex: 1,
    flexGrow: 1,
  },
  minValue: {
    position: 'absolute',
    left: 5,
    color: Colors.PRIMARY_1,
    fontWeight: 'bold',
  },
  maxValue: {
    position: 'absolute',
    right: 5,
    color: Colors.PRIMARY_1,
    fontWeight: 'bold',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY_1,
    borderWidth: 2,
  },
});
