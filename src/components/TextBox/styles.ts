import config from 'config';
import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  labelSection: {
    height: 17,
    marginBottom: 3,
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  emphasizelabelSection: {
    height: 17,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelTextBox: {
    color: Colors.LIGHT_GREY,
    fontSize: 14,
    flex: 1,
    fontFamily: 'Noto Sans',
  },
  emphasizeLabelTextBox: {
    color: Colors.LIGHT_GREY,
    flex: 1,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
  },
  labelErrorSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelErrorSection2: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelError: {
    color: Colors.RED,
    fontSize: config.domain === 'vcsc' ? 12 : 16,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginRight: 17,
  },
  labelError2: {
    color: Colors.PRIMARY_1,
    fontSize: config.domain === 'vcsc' ? 12 : 16,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginRight: 17,
  },
  popover: {
    color: Colors.WHITE,
  },
  errorIcon: {
    position: 'absolute',
    right: 0,
    top: 2,
    marginLeft: 5,
    width: 17,
    color: Colors.RED,
    fontSize: 17,
  },
  textBox: {
    height: height > 640 ? 42 : 32,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    fontSize: height > 640 ? 16 : 14,
    color: Colors.DARK_GREY,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Noto Sans',
  },
  textBoxInnerIconContainer: {
    position: 'absolute',
    right: 20,
    top: height > 640 ? 32 : 24,
  },
  textBoxInnerIcon: {
    color: Colors.LIGHT_GREY,
    fontSize: height > 640 ? 22 : 18,
  },
  textBoxError: {
    borderColor: Colors.RED,
  },
  requiredField: {
    color: Colors.RED,
  },
  textMultiple: {
    paddingTop: 5,
    textAlignVertical: 'top',
  },
});
