import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSection: {
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 15,
    backgroundColor: Colors.WHITE,
    width: width * 0.8,
    borderRadius: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
    paddingVertical: 10,
  },
  buttonCancel: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GREY,
    paddingVertical: 15,
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
  labelTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelTouch2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelTouchText: {
    color: Colors.DARK_GREY,
    fontSize: 14,
    marginTop: 3,
  },
  labelTouchText2: {
    color: Colors.DARK_GREY,
    fontSize: 14,
    marginRight: 10,
  },
  imageLanguage: {
    flex: 1,
  },
  language: {
    flex: 4,
    marginLeft: 30,
    fontSize: 18,
  },
  selected: {
    opacity: 0.7,
  },
});
