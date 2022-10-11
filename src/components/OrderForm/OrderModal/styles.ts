import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    width: 250,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
  },
  titleContainer: {
    height: 50,
    width: 250,
  },
  titleContainerBorder: {
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  button: {
    width: 125,
  },
  buttonBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.BORDER,
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonText2: {
    fontWeight: 'bold',
    color: Colors.RED,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
