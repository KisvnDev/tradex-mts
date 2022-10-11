import { StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: heightPercentageToDP(2),
  },
});
