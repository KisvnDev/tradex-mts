import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  imageContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderRadius: 35,
    borderColor: Colors.BORDER,
  },
  accountInfo: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingTop: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
    color: Colors.LIGHT_GREY,
  },
  contentText: {
    marginLeft: 10,
    paddingTop: 5,
    fontSize: 18,
    color: Colors.DARK_GREY,
  },
  textBold: {
    fontWeight: '700',
  },
  rowContent: {
    marginBottom: height > 750 ? 10 : 20,
  },
  buttonSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.LIGHT_BLUE,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: Colors.LIGHT_BLUE,
  },
});
