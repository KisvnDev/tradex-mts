import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  containerNewKis: {
    paddingTop: 0,
  },
  containerItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 8,
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  account: {},
  textStyle: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountNum: {},
  bothText: {
    fontWeight: '700',
  },
});
