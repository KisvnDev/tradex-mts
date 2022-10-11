import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  note: {
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 50,
  },
  button: {
    margin: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  textInputContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  textInput: {
    width: 25,
  },
  resend: {
    textAlign: 'center',
  },
  timer: {
    color: Colors.RED,
  },
  warning: {
    color: Colors.RED,
    textAlign: 'center',
  },
});
