import { StyleSheet, PixelRatio } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  avatarContainer: {
    borderColor: Colors.BORDER,
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 75,
  },
  avatar: {
    borderRadius: 35,
    width: 71,
    height: 71,
  },
  icon: {
    color: Colors.PRIMARY_1,
    fontSize: 14,
  },
  label: {
    color: Colors.GREY,
    fontSize: 17,
    textAlign: 'center',
  },
  image: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSmall: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: -5,
    top: 0,
    zIndex: 2,
  },
});
