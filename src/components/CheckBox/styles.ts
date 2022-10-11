import config from 'config';
import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    height: config.domain === 'vcsc' ? 32 : height > 640 ? 42 : 32,
    flexDirection: 'row',
  },
  fill: {
    flex: 1,
  },
  textWrapping: {
    flexWrap: 'wrap',
  },
  icon: {
    width: 22,
    justifyContent: 'center',
  },
  label: {
    paddingLeft: 5,
    justifyContent: 'center',
  },
  label2: {
    flexDirection: 'row',
    paddingLeft: 5,
    alignItems: 'center',
  },
  labelText: {
    color: Colors.LIGHT_GREY,
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
  },
  labelLink: {
    color: Colors.PRIMARY_1,
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
  },
});
