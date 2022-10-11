import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  imageSectionRow: {
    width: 50,
    height: 50,
  },
  wrapperDate: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  image: {
    flex: 1,
  },
  contentSectionRow: {
    flex: 3,
    paddingLeft: 10,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    // height: 35,
  },
  bottomSection: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 15,
  },
  marketText: {
    fontSize: 10,
    color: 'black',
  },
  titleText: {
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: Colors.BLACK,
  },
  tagContainer: {
    flex: 3,
    paddingRight: 10,
  },
  tagList: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  tag: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
    justifyContent: 'center',
  },
  tagName: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.DARK_GREY,
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: Colors.DARK_GREY,
  },
  source: {
    flex: 1,
  },
  sourceText: {
    textAlign: 'right',
    fontSize: 14,
  },
});
