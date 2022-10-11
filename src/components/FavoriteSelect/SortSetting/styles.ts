import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerItem: {
    flex: 1,
    paddingVertical: 10,
  },
  borderBottom: {
    borderBottomColor: Colors.LIGHTER_GREY,
    borderBottomWidth: 1,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checked: {
    color: Colors.PRIMARY_1,
  },
  itemLeft: {
    flex: 2,
    justifyContent: 'center',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 13,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContent: {
    marginRight: 15,
    alignSelf: 'flex-end',
    color: Colors.PRIMARY_1,
  },
});
