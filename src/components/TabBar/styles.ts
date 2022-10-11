import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  tabBarContainer: {
    height: 30,
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  tabActive: {
    color: Colors.PRIMARY_1,
    borderBottomColor: Colors.PRIMARY_1,
    borderBottomWidth: 2,
  },
  tabItemText: {
    color: Colors.PRIMARY_1,
  },
});
