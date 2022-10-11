import config from 'config';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { width } from 'styles';
import { readJson } from 'utils/socketApi';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';

type LoginBannerType = {
  splashImage: string;
  url: string;
};

let adsBannerCache: LoginBannerType[] = [];
export const openBannerURL = (uri: string) =>
  uri + (uri.includes('?') ? '&' : '?') + `id=${DeviceInfo.getMacAddressSync()}`;

const AdsBanner = () => {
  const [banner, setBanner] = useState<LoginBannerType[]>(adsBannerCache);

  const readJsonbanner = async () => {
    const data = config as any;

    if (data.loginBannerLink) {
      const _banner = await readJson<LoginBannerType[]>(data.loginBannerLink);

      adsBannerCache = _banner || [];

      setBanner(adsBannerCache);
    }
  };

  const validURL = (uri: string) => {
    return uri !== null && uri !== undefined && uri.includes('/') && uri.includes('.') ? uri : '';
  };

  useEffect(() => {
    readJsonbanner();
  }, []);

  const renderItem = (item: { item: LoginBannerType; index: number }) => {
    return (
      <TouchableOpacity
        key={item.index}
        style={styles.sliderImageContainer}
        onPress={() => {
          item.item.url && Linking.openURL(openBannerURL(item.item.url));
        }}
      >
        <FastImage style={styles.iconImage} resizeMode="stretch" source={{ uri: validURL(item.item.splashImage) }} />
      </TouchableOpacity>
    );
  };

  return (
    <Carousel
      data={banner}
      renderItem={renderItem}
      sliderWidth={width - 20}
      itemWidth={width - 20}
      loop
      enableSnap
      autoplay
      autoplayDelay={1000}
    />
  );
};

const styles = StyleSheet.create({
  sliderImageContainer: {
    height: '100%',
    width: '100%',
  },
  iconImage: {
    height: '100%',
    width: '100%',
  },
});

export default AdsBanner;
