import config from 'config';
import { StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  inputSection: {
    height: config.usingNewKisCore === false ? 100 : heightPercentageToDP(32),
    borderBottomWidth: 3,
    borderColor: Colors.LIGHTER_GREY,
  },
  headerStyle: {
    height: 0,
    paddingTop: heightPercentageToDP(2),
    marginBottom: heightPercentageToDP(5),
  },
  itemSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  picker: {
    flex: 4,
  },
});
