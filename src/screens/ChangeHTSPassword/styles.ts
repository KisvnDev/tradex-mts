import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  form: {
    flexGrow: 1,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  inputSection: {
    height: 60,
    borderBottomWidth: 3,
    borderColor: Colors.LIGHTER_GREY,
    marginBottom: 10,
  },

  itemSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  inputItem: {
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowContent: {
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 17,
    color: Colors.DARK_GREY,
  },
  contentText: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 18,
    color: Colors.DARK_GREY,
  },
  button: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
