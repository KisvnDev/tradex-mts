import { StyleSheet } from 'react-native';
import { Colors, Styles } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Styles.APP_BACKGROUND_COLOR,
  },

  indexSliderContainer: {
    height: 70,
  },
  adsSliderContainer: {
    height: 170,
    paddingTop: 10,
    alignItems: 'center',
  },
  sliderImageContainer: {
    height: '100%',
    width: '100%',
  },

  favoriteSection: {
    height: 120,
    paddingLeft: 5,
    paddingRight: 5,
  },
  symbolPriceSection: {
    flex: 1,
    flexGrow: 1,
  },
  iconImage: {
    height: '100%',
    width: '100%',
  },
  colapseButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: Colors.PRIMARY_1,
    zIndex: 1,
    padding: 5,
    right: 10,
    top: 10,
  },
  paddingTop: {
    paddingTop: 20,
  },
});
