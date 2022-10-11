import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  bottomSection: {
    height: 40,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  left: {
    flex: 5,
  },
  middle: {
    flex: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  right: {
    flex: 5,
  },
  bidOfferContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  bidOfferQuantity: {
    flex: 1,
    flexDirection: 'row',
  },
  offerQuantity: {
    backgroundColor: Colors.OFFER_VOLUME_BLUR,
  },
  bidQuantity: {
    backgroundColor: Colors.BID_VOLUME_BLUR,
  },
  bidOfferVolumeSection: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
  },
  offerVolumeSection: {
    alignItems: 'flex-end',
    left: -3,
  },
  bidVolumeSection: {
    alignItems: 'flex-start',
    right: -3,
  },
  bidOfferPriceContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  bidOfferPrice: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
  },
  offerPrice: {
    backgroundColor: Colors.OFFER_PRICE_BLUR,
  },
  bidPrice: {
    backgroundColor: Colors.BID_PRICE_BLUR,
  },
  price: {
    flex: 1,
  },
  change: {
    width: 45,
  },
  offerPriceText: {
    fontSize: 12,
    textAlign: 'left',
  },
  offerChangeText: {
    fontSize: 12,
    textAlign: 'right',
  },
  bidPriceText: {
    fontSize: 12,
    textAlign: 'left',
  },
  bidChangeText: {
    fontSize: 12,
    textAlign: 'right',
  },
  historySection: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDataRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 2,
    paddingRight: 2,
  },
  historyLabel: {
    flex: 1,
  },
  historyDataLabel: {
    fontSize: 11,
    textAlign: 'left',
  },
  historyDataValue: {
    fontSize: 11,
    textAlign: 'right',
  },
  historyData: {
    flex: 1,
  },
  bottomItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomData: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomLabel: {},
  boldText: {
    fontWeight: 'bold',
  },
});
