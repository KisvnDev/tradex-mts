import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  info: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginVertical: 5,
  },
  infoTitle: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infoResult: {
    flex: 4,
  },
  buttonContainer: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFlex: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    textAlign: 'left',
  },
  warning: {
    color: Colors.RED,
    textAlign: 'center',
  },
});
