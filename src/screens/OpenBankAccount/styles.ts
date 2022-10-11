import { StyleSheet } from 'react-native';
import { Styles, Colors, height, width } from 'styles';

const itemSize = width * (1 / 4);
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  itemContainer: {
    height: itemSize,
    width: itemSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    borderColor: Colors.BORDER,
    borderWidth: 1,
    height: itemSize - 35,
    width: itemSize - 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemTextContainer: {
    marginTop: 7,
  },
  adsSliderContainer: {
    height: 170,
    paddingTop: 10,
    alignItems: 'center',
  },
  sliderImageContainer: {
    height: '100%',
    width: '100%',
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
  titleSection: {
    height: 80,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  openAccountText: {
    fontWeight: 'bold',
    fontSize: 16,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.GREY,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  menuButtonMiddle: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
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
  iconImage: {
    height: '100%',
    width: '100%',
  },
  iconImage2: {
    height: '80%',
    width: '80%',
  },
});
