import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    backgroundColor: Colors.PRIMARY_1,
    borderRadius: 6,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 65,
  },

  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
  },
});
