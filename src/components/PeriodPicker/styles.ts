import { StyleSheet } from 'react-native';
import { Styles, Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
  },
  title: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'right',
  },
  titleSize: {
    fontSize: 15,
  },
  iconSize: {
    fontSize: 12,
  },
  label: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    width: 12,
  },
  modalContainer: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: Styles.APP_BACKGROUND_COLOR,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 20,
  },
  buttonSection: {
    justifyContent: 'center',
    paddingTop: 15,
  },
  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonCancel: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHTER_GREY,
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
  icon: {
    marginLeft: 5,
  },
  labelTouch: {
    color: Colors.BLACK,
  },
  item: {
    fontSize: 18,
  },
  selected: {
    opacity: 0.7,
    color: Colors.PRIMARY_1,
  },
  selectedBorder: {
    borderBottomColor: Colors.PRIMARY_1,
    borderBottomWidth: 1,
  },
});
