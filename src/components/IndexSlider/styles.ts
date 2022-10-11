import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  indexScroll: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  viewAllSection: {
    height: 64,
  },

  viewAllContainer: {
    flex: 1,
    width: width / 3,
    paddingLeft: 10,
    paddingRight: 10,
  },

  viewAllContent: {
    flex: 1,
    backgroundColor: Colors.LIGHTER_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  viewAllText: {
    fontSize: 14,
    color: Colors.DARK_GREY,
    fontWeight: 'bold',
  },

  icon: {
    fontSize: 25,
    zIndex: -1,
    color: Colors.BORDER,
  },

  iconLeft: {
    position: 'absolute',
    left: 0,
    top: 15,
  },

  iconRight: {
    position: 'absolute',
    right: 0,
    top: 15,
  },

  show: {
    opacity: 1,
  },

  hidden: {
    opacity: 0,
  },
});
