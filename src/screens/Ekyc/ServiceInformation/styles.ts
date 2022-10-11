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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderColor: Colors.EKYC_BORDER,
  },
  text: {
    flex: 1,
  },
  box: {
    position: 'absolute',
    right: 10,
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
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  dropdown: {
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',

    paddingRight: 16,
  },
  checkboxBox: {
    width: 30,
  },
  checkboxText: {
    marginTop: 5,
    paddingRight: 5,
  },
});
