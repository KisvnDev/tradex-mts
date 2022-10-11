import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    flex: 2,
    justifyContent: 'center',
  },
  labelText: {
    color: Colors.DARK_GREY,
  },
  value: {
    alignSelf: 'flex-end',
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_MODAL,
  },
  bodyModal: {
    height: 175,
    backgroundColor: Colors.WHITE,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
  },
  buttonSectionModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSectionModal1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
  modalTitleContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    height: 50,
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonText: {
    color: Colors.PRIMARY_1,
  },
  textInputStyle: {
    width: 275,
  },
  OTPContainer: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  OTPBody: {
    backgroundColor: Colors.WHITE,
    width: width * 0.8,
    height: 200,
    justifyContent: 'center',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  OTPContent: {
    flex: 5,
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  buttonCancel: {
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
  },
  labelTouch: {
    color: Colors.DARK_GREY,
    fontSize: 14,
  },
  OTPResend: {
    flexDirection: 'row',
  },
  resendOTPButton: {
    color: Colors.PRIMARY_1,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.PRIMARY_1,
  },
  warningBodyModal: {
    height: 200,
    backgroundColor: Colors.WHITE,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
  },
});
