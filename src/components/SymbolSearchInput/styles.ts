import { StyleSheet, Platform } from 'react-native';
import { Colors, width, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: Platform.OS === 'ios' ? width - 20 : undefined,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    flexGrow: 1,
  },
  innerLeftIconContainer: {
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'ios' ? 5 : height > 640 ? 10 : 5,
    zIndex: 1,
  },
  searchIcon: {
    fontSize: 22,
  },
  textInput: {
    height: Platform.OS === 'ios' ? 35 : height > 640 ? 45 : 35,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.LIGHTER_GREY,
    paddingLeft: 40,
  },
  innerRightIconContainer: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 1,
  },
  clearIcon: {
    fontSize: 22,
  },
  cancelButton: {
    paddingLeft: 10,
    width: 60,
    fontSize: 22,
  },
  cancelText: {
    color: Colors.WHITE,
  },
});
