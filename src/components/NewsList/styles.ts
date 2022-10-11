import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.GREY,
  },
  containerError: {
    alignItems: 'center',
  },
  labelError: {
    color: Colors.RED,
    fontSize: 15,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginLeft: 3,
  },
});
