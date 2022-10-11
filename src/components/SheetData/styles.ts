import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

const CELL_HEIGHT = 45;

const SheetDataColors = {
  FROZEN_BORDER: 'rgb(208, 230, 243)',
  FROZEN_HEADER: 'rgb(200, 200, 200)',
  HEADER_BACKGROUND: 'rgba(216, 216, 216, 0.6)',
};

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {},
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: SheetDataColors.HEADER_BACKGROUND,
  },
  header: {
    textAlign: 'right',
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 10,
  },
  column: {
    flexDirection: 'column',
  },
  identity: {
    flexDirection: 'row',
    position: 'absolute',
  },
  cell: {
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    height: CELL_HEIGHT,
  },
  highlight: {
    backgroundColor: Colors.LIGHTER_GREY,
  },
  frozenHeader: {
    backgroundColor: SheetDataColors.FROZEN_BORDER,
  },
  frozenBorder: {
    borderRightWidth: 3,
    borderColor: SheetDataColors.FROZEN_HEADER,
  },
  containerError: {
    alignItems: 'center',
  },
  labelError: {
    color: Colors.RED,
    fontSize: 15,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginLeft: 3,
  },
});
