import config from 'config';
import { StyleSheet } from 'react-native';
import { Colors, height, width } from 'styles';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingLeft: 10,
    paddingRight: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  logoSection: {
    height: 150,
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection2: {
    height: (width - 20) / 2.74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    width: '90%',
  },
  item2: {
    height: '100%',
    width: '90%',
  },
  settingSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
  },
  settingSection2: {
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 20,
  },
  registeringSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  registeringTitleButtonText: {
    fontSize: 16,
  },
  registeringButtonText: {
    fontSize: 16,
    color: Colors.PRIMARY_1,
    fontWeight: 'bold',
  },
  settingButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButton3: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButton2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxSection: {
    flexDirection: 'row',
    paddingRight: 20,
    height: 32,
  },
  checkBoxSection2: {
    flexDirection: 'row',
    paddingRight: 20,
    height: height > 640 ? 42 : 32,
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
    height: 300,
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
  loginViewModeBtn: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY_1,
    borderWidth: 1,
    height: 40,
    marginTop: 10,
  },
  loginViewModeText: {
    color: Colors.PRIMARY_1,
  },
  deviceInfo: {
    alignSelf: 'center',
    marginTop: config.domain === 'vcsc' ? 10 : undefined,
    marginBottom: 10,
    height: config.domain === 'vcsc' ? 20 : undefined,
  },
  deviceInfo2: {
    alignSelf: 'center',
    marginTop: config.domain === 'vcsc' ? 20 : undefined,
    height: config.domain === 'vcsc' ? 20 : undefined,
  },
  fingerPrintIconUp: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.PRIMARY_1,
    marginLeft: 2,
    backgroundColor: Colors.PRIMARY_1,
    borderRadius: 5,
  },
  fingerPrintIconDown: {
    alignSelf: 'center',
    marginTop: 20,
  },
  fingerPrintIcon: {
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_MODAL,
  },
  bodyModal: {
    height: 150,
    backgroundColor: Colors.WHITE,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
  },
  warningBodyModal: {
    height: 200,
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
  buttonContainer: {
    height: 50,
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  button: {
    flex: 1,
  },
  modalTitleContainer: {
    flex: 1,
    paddingHorizontal: 10,
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
  loginContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  loginButton: {
    flex: 1,
  },
  ekycRegister: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  openAccount: {
    color: Colors.PRIMARY_1,
    marginLeft: 2,
  },

  loginArea: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  buttonLogin: {
    flex: 1,
    borderRadius: 4,
  },
  newContainer: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
    // position: 'absolute',
    // top: -5,
  },
  newText: {
    color: 'white',
    fontSize: 13,
  },
  openAccountTextIcon: {
    flexDirection: 'row',
  },
  otpInput2: {
    width: '90%',
    height: 40,
  },
  underlineStyleBase: {
    flex: 1,
    height: 50,
    borderWidth: 0,
    backgroundColor: Colors.GREY,
    borderRadius: 5,
    color: Colors.BLACK,
  },
  otpResendText: {
    textAlign: 'center',
  },
  adsSliderContainer: {
    height: (width - 20) * 0.38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderImageContainer: {
    height: '100%',
    width: '100%',
  },
  iconImage: {
    height: '100%',
    width: '100%',
  },
  adsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddingTop: {
    paddingTop: 8,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
  forgotPass: {
    marginTop: heightPercentageToDP(1.5),
  },
});
