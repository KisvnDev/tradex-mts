import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    height: 45,
  },
  highlight: {
    backgroundColor: Colors.LIGHTER_GREY,
  },
  checkBoxSection: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    padding: 10,
  },
  codeSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  code: {
    fontSize: 14,
    color: Colors.DARK_GREY,
    fontWeight: 'bold',
  },
  priceSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textPrice: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
    fontSize: 14,
  },
  iconChange: {
    width: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
    marginRight: 5,
    flex: 1,
  },
  optionSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 13,
  },
  buttonRowSection: {
    marginRight: 5,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEdit: {
    color: Colors.DARK_GREY,
    fontSize: 17,
  },
});
