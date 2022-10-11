import { StyleSheet } from 'react-native';
import { width, Colors } from 'styles';

export default StyleSheet.create({
  containerModal: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyModal: {
    height: 500,
    backgroundColor: Colors.WHITE,
    width,
    justifyContent: 'center',
  },
  modalTitleContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },

  buttonSectionModal: {
    justifyContent: 'center',
    alignItems: 'stretch',
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
  buttonTitleModal: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonTitleCancelModal: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
  },
  labelTouch: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: '900',
  },
  labelChild: {
    position: 'absolute',
    color: Colors.BORDER,
    fontSize: 14,
    right: 70,
  },
  iconSelected: {
    right: 30,
    position: 'absolute',
    fontSize: 20,
    color: Colors.PRIMARY_1,
  },
});
