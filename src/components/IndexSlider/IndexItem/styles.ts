import { StyleSheet } from 'react-native';
import { width, Colors } from 'styles';

export default StyleSheet.create({
  container: {
    width: width / 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: Colors.BORDER,
    paddingRight: 10,
    paddingLeft: 10,
  },
  indexCode: {
    fontSize: 13,
    color: Colors.DARK_GREY,
    fontWeight: 'bold',
  },

  indexValue: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.DARK_GREY,
  },
  indexChange: {
    marginTop: 3,
    fontSize: 12,
  },
});
