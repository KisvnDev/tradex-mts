import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inputSection: {
    height: 110,
  },
  itemSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  labelContainer2: {
    flex: 1,
    justifyContent: 'center',
    height: 30,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  dataContainer: {
    flex: 3,
  },
  pickerContainer: {
    flex: 6,
    height: 30,
  },
  data: {
    fontSize: 11,
  },
  note: {
    width: 250,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonInModal: {
    height: 50,
    flexDirection: 'row',
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonText2: {
    fontWeight: 'bold',
    color: Colors.RED,
  },
  confirmCancelButton: {
    flex: 1,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
  },
  modalBackground: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    width: 250,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    height: 50,
    width: 250,
  },
  titleContainerBorder: {
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  textInputStyle: {
    height: height > 640 ? 84 : 64,
  },
  iconSize: {
    fontSize: 20,
  },
  disableButton: {
    opacity: 0.2,
  },
});
