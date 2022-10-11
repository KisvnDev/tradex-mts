import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkEmpty: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    padding: 10,
  },
  editEmpty: {
    marginRight: 5,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bothText: {
    fontWeight: '700',
  },
  codeLabel: {
    flex: 2,
    justifyContent: 'center',
  },
  valueLabel: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  priceLabel: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  buttonSection: {
    height: 45,
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderTopWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelButton: {
    color: Colors.PRIMARY_1,
    fontSize: 14,
  },
  icon: {
    color: Colors.PRIMARY_1,
    fontSize: 22,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
});
