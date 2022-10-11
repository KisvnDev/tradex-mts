import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  gestureStyle: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  favoriteNameInput: {
    margin: 10,
  },
  favoriteButton: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY_1,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },

  favoriteButtonText: {
    color: Colors.PRIMARY_1,
  },
  favortieList: {
    flex: 1,
  },
  moveButtonSection: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    left: width / 2 - 45,
    bottom: 55,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moveButton: {
    height: 45,
    width: 45,
    borderRadius: 25,
    backgroundColor: Colors.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moveIcon: {
    fontSize: 45,
  },
  buttonSection: {
    height: 45,
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderTopWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelButton: {
    color: Colors.PRIMARY_1,
    fontSize: 14,
  },
  icon: {
    color: Colors.PRIMARY_1,
    fontSize: 14,
  },
});
