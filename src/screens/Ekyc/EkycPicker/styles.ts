import { StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Colors } from 'styles';

export default StyleSheet.create({
  pickerContainer: {
    padding: 15,
    backgroundColor: Colors.WHITE,
  },
  icon: {
    paddingTop: heightPercentageToDP(3),
  },
  search: {
    marginTop: 10,
  },
  item: {
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
  },
});
