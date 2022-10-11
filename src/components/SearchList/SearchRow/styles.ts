import { StyleSheet, Platform } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
  },
  checkbox: {
    flex: 1,
    paddingLeft: 5,
    marginTop: Platform.OS === 'ios' ? -10 : height > 640 ? -10 : -5,
  },
  code: {
    flex: 2,
    paddingLeft: 20,
  },
  textCode: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    flex: 4,
    justifyContent: 'center',
    paddingRight: 20,
  },
  textTitle: {},
  market: {
    paddingTop: 5,
  },
  textMarket: {
    fontSize: 12,
    color: Colors.WHITE,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    alignSelf: 'flex-start',
  },
  iconRight: {
    flex: 1,
  },
  HNX: {
    backgroundColor: Colors.HNX,
  },
  UPCOM: {
    backgroundColor: Colors.UPCOM,
  },
  HOSE: {
    backgroundColor: Colors.HOSE,
  },
});
