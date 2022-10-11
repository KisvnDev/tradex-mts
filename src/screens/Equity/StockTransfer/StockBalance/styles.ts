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
  stockCode: {
    fontWeight: 'bold',
  },
  transferButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
});
