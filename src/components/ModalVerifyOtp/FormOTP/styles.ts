import { StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors, width } from 'styles';

export default StyleSheet.create({
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
    minHeight: heightPercentageToDP(40),
    borderRadius: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: widthPercentageToDP(4),
  },
  boldText: {
    fontWeight: '700',
  },
  OTPContent: {
    flex: 1,
    paddingTop: 8,
  },
  itemContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  modalPadding: {
    paddingHorizontal: width * 0.1,
  },
  wrapper: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    marginLeft: 8,
  },
  textInputBox: {
    width: '100%',
  },
  wrapperText: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '98%',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sendOtpBtn: {
    width: '100%',
  },
  sendOtpBlur: {},
  selectTimeSession: {
    width: 100,
  },
  OTPFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  wrapperBtn: {
    flexDirection: 'row',
  },
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: Colors.BORDER,
    borderTopWidth: 2,
    paddingVertical: 8,
  },
  cancelStyle: {
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
  confirmStyle: {
    borderLeftColor: Colors.BORDER,
    borderLeftWidth: 1,
  },
  buttonCancel: {
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
  },
  labelTouch: {
    position: 'absolute',
    color: Colors.DARK_GREY,
    fontSize: 14,
  },
  labelOtp: {
    backgroundColor: Colors.GREY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    marginTop: 8,
  },
  retryArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpResendText: {
    textAlign: 'center',
    marginVertical: heightPercentageToDP(2),
  },
  textBtn: {
    fontWeight: 'bold',
    padding: 4,
  },
  textBtnBlur: {
    color: Colors.BORDER,
  },
  btnSelect: {
    width: widthPercentageToDP(5),
    height: widthPercentageToDP(5),
    borderRadius: widthPercentageToDP(3),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectStyle: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP(3),
    marginVertical: heightPercentageToDP(0.5),
  },
  selectedStyle: {
    width: widthPercentageToDP(3),
    height: widthPercentageToDP(3),
    borderRadius: widthPercentageToDP(2),
    backgroundColor: Colors.BLACK,
  },
  wrapperSelected: {
    flexDirection: 'row',
  },
  textSelected: {
    padding: 4,
    fontWeight: 'bold',
    fontSize: 13,
  },
  resendText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.PRIMARY_1,
  },
  iconEye: {
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 10,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  left5: {
    marginLeft: 5,
  },
  boxMatrix: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
