import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  headerSectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabView: {
    backgroundColor: Colors.WHITE,
  },
  tabViewIndicator: {
    backgroundColor: Colors.PRIMARY_1,
  },
});
