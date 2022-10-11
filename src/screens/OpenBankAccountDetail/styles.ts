import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainImageContainer: {
    height: 140,
    width: '100%',
    alignItems: 'center',
  },
  mainContentContainer: {
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contentContainer: {
    paddingTop: 15,
    height: 150,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  mainImage: {
    height: '100%',
    width: '60%',
  },
  mainContent: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  content: {
    fontSize: 15,
  },
  button: {
    paddingHorizontal: 15,
  },
});
