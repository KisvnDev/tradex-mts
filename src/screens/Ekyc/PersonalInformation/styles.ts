import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  checkboxItem: {
    flex: 1,
  },
  checkbox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  textInputRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  textInput1: {
    flex: 1,
    marginRight: 5,
  },
  textInput2: {
    flex: 1,
    marginLeft: 5,
  },
  buttonContainer: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  err: { color: Colors.RED, textAlign: 'center' },
});
