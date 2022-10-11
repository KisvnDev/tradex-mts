import { StyleSheet } from 'react-native';
import { Colors, width, height } from 'styles';

export default StyleSheet.create({
  container: {
    width,
    height: height > 640 ? 100 : 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHTER_GREY,
    paddingTop: 10,
  },
  subContainer: {
    width,
    flex: 1,
    marginTop: -5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHTER_GREY,
    paddingLeft: 5,
    paddingRight: 10,
    height: 20,
  },
  headerTopName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTopText: {
    color: Colors.WHITE,
  },
  tooltipContainer: {
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  marketLabel: {
    alignItems: 'flex-end',
    width: 60,
  },
  containerModal: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_MODAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyModal: {
    height: 130,
    backgroundColor: Colors.WHITE,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
  },
  buttonSectionModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSectionModal1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
  modalTitleContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 50,
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonText: {
    color: Colors.PRIMARY_1,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonModal: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GREY,
  },

  buttonCancelModal: {
    alignSelf: 'center',
  },
  buttonTitleCancelModal: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
  },
});
