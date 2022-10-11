import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  instructionTitle: {
    width,
    padding: 15,
  },
  formSection: {
    width,
    paddingHorizontal: 15,
    flex: 1,
  },
  formItem: {},
  labelText: {
    color: Colors.LIGHT_GREY,
    marginLeft: 10,
    fontSize: 12,
  },
  bankContainer: {
    paddingBottom: 10,
  },
  instructionTitleText: {
    fontSize: 17,
  },
  modalContent: {
    textAlign: 'center',
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
    marginTop: 15,
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
    height: 400,
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
  buttonSectionModal2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: width / 3,
  },
  iconPhoneArea: {
    height: 200,
    width: '100%',
  },
  iconClose: {},
  iconPhone: {
    height: 60,
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
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    width: '90%',
  },
  otpInput2: {
    width: '90%',
    height: 40,
  },
  underlineStyleBase: {
    // flex: 1,
    height: 40,
    width: 35,
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
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
  referralSuccessText: {
    color: Colors.GREEN,
  },
  referralFailedText: {
    color: Colors.RED,
  },
});
