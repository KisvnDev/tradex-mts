import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    paddingLeft: 20,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  icon: {
    fontSize: 16,
    color: Colors.PRIMARY_1,
    alignSelf: 'flex-end',
  },
  labelContainer: {
    flex: 5,
    justifyContent: 'center',
  },
  label: {
    color: Colors.LIGHT_GREY,
  },
  dataContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingRight: 5,
  },
  data: {
    alignSelf: 'flex-end',
    color: Colors.DARK_GREY,
  },
  iconContainer: {
    width: 15,
    justifyContent: 'center',
  },
});
