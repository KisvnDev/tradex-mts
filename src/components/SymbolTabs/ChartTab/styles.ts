import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  buttonSection: {
    height: 45,
    backgroundColor: Colors.GREY,
    paddingTop: 5,
    paddingBottom: 7,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    width: width - 10,
    alignSelf: 'center',
  },
  button: {
    height: 30,
    paddingRight: 5,
    flex: 1,
    borderRightWidth: 1,
    borderColor: Colors.SUB_2,
    justifyContent: 'center',
  },
  rightMostButton: {
    borderRightWidth: 0,
  },
  pickerActive: {
    color: Colors.PRIMARY_1,
  },
  pickerInactive: {
    color: Colors.DARK_GREY,
  },
  tabTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  labelButton: {
    color: Colors.LIGHT_GREY,
    fontSize: 12,
    textAlign: 'center',
  },
  active: {
    color: Colors.PRIMARY_1,
  },
  settingButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartSection: {
    flex: 1,
    padding: 5,
  },
});
