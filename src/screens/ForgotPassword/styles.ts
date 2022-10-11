import { StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    paddingHorizontal: widthPercentageToDP(4),
    paddingTop: heightPercentageToDP(4),
    flex: 1,
  },
  btnContainer: {},
  button: {},
  wrapperTitle: {
    marginBottom: heightPercentageToDP(2),
  },
  title: {
    fontSize: widthPercentageToDP(6),
    color: '#2569B0',
    fontWeight: 'bold',
  },
  OTPContainer: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  OTPBody: {
    backgroundColor: Colors.WHITE,
    width: width * 0.8,
    borderRadius: 20,
  },
  titleSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 0.5,
  },
  titleModal: {
    fontWeight: 'bold',
    fontSize: widthPercentageToDP(4),
  },
  boldText: {
    fontWeight: '700',
  },
  OTPContent: {},
  OTPContent1: {
    flex: 1,
  },
  itemContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthPercentageToDP(6),
    marginVertical: heightPercentageToDP(3),
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
  },
  textInputBox: {
    width: '100%',
  },
  wrapperText: {
    marginVertical: heightPercentageToDP(2),
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendOtpBtn: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    flex: 1,
  },
  selectTimeSession: {
    width: '20%',
  },
  OTPFooter: {
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
    borderTopWidth: 1,
    paddingVertical: 15,
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
    color: Colors.DARK_GREY,
    fontSize: 14,
    paddingHorizontal: 6,
  },
  labelOtp: {
    backgroundColor: Colors.GREY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
  },
  retryArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpResendText: {
    textAlign: 'center',
  },
  textBtn: {
    fontWeight: 'bold',
    padding: 4,
  },
  resendText: {},
  scapingContent: {
    width: '100%',
    paddingVertical: heightPercentageToDP(2),
  },
  borderTop: {
    borderTopColor: Colors.BORDER,
    borderTopWidth: 0.5,
  },
  textCancel: { color: Colors.DOWN, fontWeight: '600' },
  textConfirm: { color: Colors.PRIMARY_1, fontWeight: '600' },
  bottomContent: { paddingBottom: 10 },
  iconEye: {
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 10,
    justifyContent: 'center',
  },
  boxMatrix: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
