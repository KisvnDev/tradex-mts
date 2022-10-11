import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  dataContainer: {
    flex: 1,
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
