import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  ceFLSection: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidBackgroundColor: {
    backgroundColor: Colors.BID_PRICE_BLUR,
  },
  offerBackgroundColor: {
    backgroundColor: Colors.OFFER_PRICE_BLUR,
  },
  bold: {
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 14,
  },
  bidOfferSection: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
  priceSection: {
    borderRightWidth: 1,
    borderColor: Colors.BORDER,
  },
  priceSectionFuture: {
    flex: 2,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  quantity: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  text: {
    fontSize: 11,
  },
  bidOfferQuantity: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  bidQuantity: {
    backgroundColor: Colors.BID_VOLUME_BLUR,
  },
  offerQuantity: {
    backgroundColor: Colors.OFFER_VOLUME_BLUR,
  },
  volumeSection: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 5,
    justifyContent: 'center',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
});
