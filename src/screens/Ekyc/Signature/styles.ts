import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  uploadContainer: {
    width: '100%',
    height: 157,
    backgroundColor: Colors.EKYC_UPLOAD,
    opacity: 0.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  note: {
    color: Colors.RED,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  returnButton: {
    marginTop: 10,
  },
  returnButtonText: {
    textAlign: 'center',
  },
  warning: {
    color: Colors.RED,
    textAlign: 'center',
  },
});
