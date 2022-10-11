import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  data: {
    fontSize: 11,
  },
  code: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
    textDecorationLine: 'underline',
  },
  InputSection: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  InputSection2: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Item: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  pickerContainer: {
    flex: 1,
  },
});
