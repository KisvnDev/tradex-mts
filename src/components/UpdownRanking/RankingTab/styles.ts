import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
  },
  marketColumn: {
    flex: 1,
  },
  header: {
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  headerText: {
    color: Colors.LIGHT_GREY,
    fontSize: 14,
  },
  viewAllButton: {
    margin: 10,
    height: 40,
    borderWidth: 2,
    borderColor: Colors.LIGHTER_GREY,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 4,
    alignItems: 'flex-end',
  },
  buttonText: {
    color: Colors.LIGHT_GREY,
    fontSize: 16,
  },
  iconContainer: {
    flex: 3,
    alignItems: 'flex-start',
  },
  icon: {
    color: Colors.LIGHT_GREY,
    fontSize: 18,
    marginLeft: 20,
  },
});
