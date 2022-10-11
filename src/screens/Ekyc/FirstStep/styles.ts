import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  titleDocument: {
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 20,
  },
  note: {
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 50,
  },
  requirement: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    marginRight: 15,
    overflow: 'visible',
  },
  requirementNumberContainer: {
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#00B3C6',
  },
  requirementNumber: {
    alignSelf: 'center',
    color: Colors.WHITE,
  },
  requirementContent: {
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    margin: 10,
  },
  selectDocument: {
    padding: 20,
    margin: 5,
    borderColor: Colors.BORDER,
    borderWidth: 0.2,
    borderRadius: 3,
  },
});
