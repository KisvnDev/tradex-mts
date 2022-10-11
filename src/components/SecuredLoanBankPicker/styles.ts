import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  textBox: {
    height: height > 640 ? 42 : 32,
    borderWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 1,
    paddingBottom: 5,
  },
});
