import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  listStyle: {
    height: '100%',
  },
  headerContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    borderBottomColor: Colors.LIGHTER_GREY,
    borderBottomWidth: 1,
  },
  headerCode: {
    flex: 2,
  },
  headerCodeText: {
    textAlign: 'left',
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  headerPrice: {
    flex: 3,
  },
  headerPriceText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  headerChange: {
    flex: 3,
  },
  headerTrading: {
    flex: 5,
  },
  headerChangeText: {
    textAlign: 'left',
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  headerInfo: {
    flex: 7,
    flexDirection: 'row',
  },
  containerError: {
    alignItems: 'center',
    height: '100%',
  },
  labelError: {
    color: Colors.RED,
    fontSize: 15,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginLeft: 3,
    height: '100%',
  },
});
