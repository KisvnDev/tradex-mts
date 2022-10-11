import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scrollList: {
    flex: 1,
    paddingRight: 20,
  },
  label: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 5,
    marginTop: 5,
  },
  labelText: {
    color: Colors.DARK_GREY,
    paddingLeft: 10,
  },
  length: {
    fontSize: 14,
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 50,
  },
  symbol: {
    flexDirection: 'row',
    height: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  code: {
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    fontSize: 14,
  },
  icon: {
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    width: 70,
    alignItems: 'center',
    marginRight: 5,
  },
  button: {
    width: 70,
  },
});
