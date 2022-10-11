import { StyleSheet } from 'react-native';
import { Styles, Colors, height, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  topSection: {
    height: 70,
    borderBottomWidth: 3,
    borderColor: Colors.LIGHTER_GREY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: Styles.APP_BACKGROUND_COLOR,
  },

  account: {
    flex: 1,
    paddingLeft: 10,
  },

  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  accountPicker: {
    height: 50,
  },

  buttonNext: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: height > 750 ? 25 : 15,
    color: Colors.DARK_GREY,
  },

  mainSection: {
    flex: 2,
  },
  menuSection: {
    flex: 2,
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 3,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.GREY,
  },
  menuButton: {
    width: width * 1 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  menuButtonMiddle: {
    borderRightWidth: 1,
    borderColor: Colors.GREY,
  },
  menuButtonLeft: {
    borderRightWidth: 1,
    borderColor: Colors.GREY,
  },

  menuText: {
    marginTop: 5,
    fontSize: height > 750 ? 12 : 10,
    color: Colors.DARK_GREY,
    textAlign: 'center',
  },

  bottomSection: {
    top: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBig: {
    fontSize: height > 640 ? 30 : 26,
    color: Colors.DARK_GREY,
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSize: {
    width: 35,
    height: 35,
  },
  textBig: {
    fontSize: height > 640 ? 14 : 12,
  },
  disabled: {
    opacity: 0.3,
  },
});
