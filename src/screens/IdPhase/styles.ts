import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    height: 170,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    paddingHorizontal: 25,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  ruleContainer: {
    justifyContent: 'center',
    width: '85%',
    alignItems: 'center',
  },
  ruleItem: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 80,
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62c8f1',
    width: 50,
    height: 50,
    borderRadius: 7,
    marginRight: 10,
  },
  numberText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnderstood: {
    paddingHorizontal: 10,
  },
  ruleText: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 15,
  },
  text: {
    fontSize: 15,
  },
});
