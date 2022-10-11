import { StyleSheet } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.LIGHTER_GREY,
    paddingHorizontal: 10,
  },
  icon: {
    fontSize: 16,
    color: Colors.PRIMARY_1,
    alignSelf: 'flex-end',
  },
  labelContainer: {
    width: widthPercentageToDP(27),
    justifyContent: 'center',
    maxHeight: 40,
  },
  label: {
    color: Colors.LIGHT_GREY,
    paddingVertical: 9,
  },
  dataContainer: {
    width: widthPercentageToDP(64),
    justifyContent: 'center',
  },
  row2: {
    borderLeftColor: Colors.BORDER,
    borderLeftWidth: 2,
    justifyContent: 'center',
    width: '100%',
    minHeight: 40,
  },
  data: {
    color: Colors.DARK_GREY,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dataNewRow: {
    textAlign: 'center',
  },
  iconContainer: {
    width: 15,
    justifyContent: 'center',
  },
  borderBottom: { borderBottomColor: Colors.BORDER, borderBottomWidth: 2 },
});
