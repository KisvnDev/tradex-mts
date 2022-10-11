import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    borderTopWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  timeText: {
    fontSize: 10,
    color: Colors.DARK_GREY,
    flex: 2,
    textAlign: 'left',
  },
  tag: {
    marginLeft: 2,
    marginRight: 2,
  },
  tagName: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.DARK_GREY,
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: Colors.LIGHTER_GREY,
  },
  tagList: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pdf: {
    flex: 1,
  },
  source: {
    flex: 3,
    justifyContent: 'center',
  },
});
