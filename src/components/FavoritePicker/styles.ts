import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 150,
    height: 30,
    paddingLeft: 10,
  },
  favoriteName: {
    fontWeight: 'bold',
    color: Colors.WHITE,
    flex: 1,
    fontSize: 16,
  },
  arrowDown: {
    position: 'absolute',
    right: 0,
  },
});
