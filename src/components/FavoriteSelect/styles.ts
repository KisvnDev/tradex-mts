import { StyleSheet, Platform } from 'react-native';
import { Colors, width, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  favoriteHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    flexShrink: 1,
  },

  favoriteTitle: {
    padding: 10,
  },
  favoriteTitleText: {
    fontWeight: 'bold',
  },
  favoriteName: {
    flex: 1,
  },
  favoriteButton: {
    width: 70,
    padding: 10,
  },
  favoriteNameTouch: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelTouch: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },

  icon: {
    position: 'absolute',
    right: 0,
    fontSize: 15,
  },

  symbolPriceSection: {
    flex: 5,
  },

  content: {
    flex: 1,
    textAlign: 'center',
  },
  buttonSectionFav: {
    flex: 1,
    backgroundColor: Colors.LIGHTER_GREY,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFav: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelButtonFav: {
    color: Colors.DARK_GREY,
    fontSize: 11,
    textAlign: 'center',
  },
  iconFav: {
    color: Colors.PRIMARY_1,
    fontSize: 16,
  },
  addButtonFav: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    marginTop: 15,
    marginBottom: 15,
  },
  editButtonFav: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    marginTop: 15,
    marginBottom: 15,
  },
  modal: {
    height: (height * 3) / 8,
    width: width / 2,
    borderRadius: 3,
  },
  modalContainer: {
    backgroundColor: Colors.OPACITY_BACKGROUND,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    backgroundColor: Colors.GREY,
    width: width * 0.8,
    height: 180,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalTitleContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : undefined,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    alignSelf: 'center',
  },
  modalSubTitle: {
    alignSelf: 'center',
  },
  modalInput: {
    height: 40,
    fontSize: 14,
    backgroundColor: Colors.WHITE,
    width: width * 0.7,
    alignSelf: 'center',
  },
  textBoxContainer: {
    flex: 1,
  },
  textBox: {
    paddingRight: 5,
    paddingLeft: 5,
  },
  modalButtonSection: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 45,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalSubmitButton: {
    borderRightWidth: 1,
    borderColor: Colors.BORDER,
  },
  buttonTitle: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonTitleCancel: {
    color: Colors.PRIMARY_1,
    fontSize: 17,
  },
  newsButton: {
    height: 40,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY_1,
  },
  newsButtonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  newsButtonIcon: {
    color: Colors.WHITE,
  },
  sortSettings: {
    flex: 7,
    backgroundColor: Colors.WHITE,
  },
  modalSort: {
    flex: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 6,
  },
});
