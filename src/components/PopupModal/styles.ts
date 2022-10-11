import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.OPACITY_BACKGROUND,
  },
  modalContainer: {
    height: 300,
    width: 300,
    flexDirection: 'column',
    backgroundColor: Colors.WHITE,
  },
  modalHeader: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  textButtonColor: {
    color: Colors.BLACK,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
});
