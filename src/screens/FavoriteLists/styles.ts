import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  gestureStyle: { width: '100%', height: '100%' },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
  },
  highlight: {
    backgroundColor: Colors.LIGHTER_GREY,
  },
  checkbox: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.DARK_GREY,
  },
  labelChild: {
    color: Colors.DARK_GREY,
    fontSize: 17,
  },
  buttons: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: Colors.DARK_GREY,
    fontSize: 14,
  },
  buttonSection: {
    height: 45,
    backgroundColor: Colors.LIGHTER_GREY,
    padding: 5,
    borderTopWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurButton: {
    opacity: 0.3,
  },
  labelButton: {
    color: Colors.PRIMARY_1,
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    backgroundColor: Colors.GREY,
    width: width * 0.8,
    height: 180,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalTitleContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    alignSelf: 'center',
  },
  modalSubTitle: {
    alignSelf: 'center',
  },
  modalInput: {
    height: 40,
    fontSize: 14,
    backgroundColor: Colors.WHITE,
    width: width * 0.7,
    alignSelf: 'center',
  },
  textBoxContainer: {
    flex: 1,
  },
  textBox: {
    paddingRight: 5,
    paddingLeft: 5,
  },
  modalButtonSection: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 45,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalSubmitButton: {
    borderRightWidth: 1,
    borderColor: Colors.BORDER,
  },
  buttonTitle: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonTitleCancel: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
  },
  content: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});
