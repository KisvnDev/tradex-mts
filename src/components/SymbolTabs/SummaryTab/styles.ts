import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
  },
  topSection3Item: {
    height: 75,
  },
  topSection5Item: {
    height: 125,
  },
  bottomSection: {
    flex: 1,
  },
  left: {
    marginLeft: 5,
  },
  right: {
    marginRight: 5,
  },
  bidOfferContainer: {
    height: 25,
    flexDirection: 'row',
  },
  InfoContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  bidOfferContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueContainerLeft: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueContainerRight: {
    flex: 2,
    alignItems: 'flex-end',
  },
  labelContainerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  columnContentLabel: {
    flex: 1,
  },
  columnContentValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellButton: {
    flex: 1,
    backgroundColor: Colors.RED,
  },
  buyButton: {
    flex: 1,
    backgroundColor: Colors.UP,
  },
  button: {
    height: 25,
    marginLeft: 35,
    marginRight: 35,
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  borderRight: {
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
});
