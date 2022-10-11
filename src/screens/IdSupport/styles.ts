import { StyleSheet } from 'react-native';
import { Colors, height, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  checkBoxSection: {
    flexDirection: 'row',
    marginHorizontal: 17,
    height: height > 640 ? 42 : 32,
  },
  instructionTitle: {
    width,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  formSection: {
    width,
    paddingHorizontal: 15,
    flex: 1,
  },
  formItem: {
    paddingHorizontal: 17,
  },
  labelText: {
    color: Colors.LIGHT_GREY,
    marginLeft: 10,
  },
  bankContainer: {
    paddingBottom: 10,
  },
  instructionTitleText: {
    fontSize: 17,
  },
  boldText: {
    fontWeight: 'bold',
  },
  clickableText: {
    color: Colors.PRIMARY_1,
  },
  registerArea: {
    width: '100%',
    alignItems: 'center',
    height: 50,
  },
  sendOTPButtonArea: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  buttonRegister: {
    flex: 1,
    width: '100%',
  },
  buttonSendOTP: {
    width: '50%',
    height: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_MODAL,
  },
  bodyModal: {
    height: 500,
    backgroundColor: Colors.WHITE,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonSectionModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPhoneArea: {
    height: 210,
    width: '100%',
  },
  iconClose: {},
  iconPhone: {
    height: 70,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  titleText: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  contentText: {},
  closeArea: {
    alignItems: 'flex-end',
    paddingTop: 5,
    paddingRight: 5,
  },
  otpInputArea: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    width: '80%',
  },
  underlineStyleBase: {
    width: 35,
    height: 45,
    borderWidth: 0,
    backgroundColor: Colors.GREY,
    borderRadius: 5,
    color: Colors.BLACK,
  },
  sendOTPArea: {
    flex: 1,
  },
  retryArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  resendText: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  textInputStyle: {
    height: height > 640 ? 84 : 64,
  },
  mainTextTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '93%',
    alignSelf: 'center',
  },
  buttonUnderstood: {
    width: '100%',
  },
  note: {
    flex: 2,
    padding: 10,
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
    height: 230,
    justifyContent: 'center',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  modalContent: {
    textAlign: 'center',
  },
});
