import React from 'react';
import { View, Modal, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { LANG } from 'global';
import { changeLanguage } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ILanguageOption {
  index: number;
  label: string;
  value: LANG;
  image: ImageSourcePropType;
}

const languageList: ILanguageOption[] = [
  {
    index: 0,
    label: 'Tiếng Việt',
    value: LANG.VI,
    image: require('../../../assets/images/Vietnam.png'),
  },
  {
    index: 1,
    label: 'English',
    value: LANG.EN,
    image: require('../../../assets/images/UK.png'),
  },
  /*  {
    index: 2,
    label: '한국어',
    value: LANG.KO,
    image: require('../../../assets/images/Korea.png'),
  },
  {
    index: 3,
    label: '中文 (简体)',
    value: LANG.ZH,
    image: require('../../../assets/images/China.png'),
  },*/
];

interface ILanguagePickerProps extends React.ClassAttributes<LanguagePicker>, WithTranslation {
  callApiAfterChange: boolean;
  alternateForm?: boolean;

  changeLanguage(payload: { lang: LANG; callApi: boolean }): void;
}

interface ILanguagePickerState {
  selectedLanguageIndex: number;
  selectedLanguage: LANG;
  modalVisible: boolean;
}

class LanguagePicker extends React.Component<ILanguagePickerProps, ILanguagePickerState> {
  constructor(props: ILanguagePickerProps) {
    super(props);

    var langIndex = languageList.findIndex((item: ILanguageOption) => item.value === global.lang);

    if (langIndex >= 0) {
      this.state = {
        selectedLanguageIndex: langIndex,
        selectedLanguage: global.lang,
        modalVisible: false,
      };
    } else {
      this.state = {
        selectedLanguageIndex: 1,
        selectedLanguage: LANG.EN,
        modalVisible: false,
      };
    }
  }

  private onPress = (value: LANG, index: number) => {
    this.setState({
      selectedLanguageIndex: index,
      selectedLanguage: value,
      modalVisible: false,
    });
    this.props.changeLanguage({ lang: value, callApi: this.props.callApiAfterChange });
  };

  private openModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  private closeModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { t } = this.props;
    const languageListRender = languageList.map((item) => (
      <TouchableOpacity key={item.index} style={styles.button} onPress={() => this.onPress(item.value, item.index)}>
        <Image source={item.image} style={styles.imageLanguage} />
        <UIText
          allowFontScaling={false}
          style={[styles.labelTouch, styles.language, this.state.selectedLanguage === item.value && styles.selected]}
        >
          {t(item.label)}
        </UIText>
      </TouchableOpacity>
    ));

    return this.props.alternateForm === true ? (
      <View>
        <TouchableOpacity style={styles.labelTouch2} onPress={this.openModal}>
          <Image
            style={{ height: 20, width: 20, marginRight: 10 }}
            resizeMode="contain"
            source={languageList[this.state.selectedLanguageIndex].image}
          />
          <UIText allowFontScaling={false} style={styles.labelTouchText2}>
            {t(languageList[this.state.selectedLanguageIndex].label)}
          </UIText>
          <Svg width={10} height={10} fill="none" viewBox="0 0 10 10">
            <Path
              fill="#999A99"
              d="M9.41 3.241a.308.308 0 00-.089-.205l-.446-.447A.308.308 0 008.67 2.5a.308.308 0 00-.206.09L4.955 6.097 1.446 2.59a.308.308 0 00-.205-.089.29.29 0 00-.205.09l-.447.446A.308.308 0 00.5 3.24c0 .071.036.152.09.205l4.16 4.161c.054.054.134.09.205.09a.308.308 0 00.206-.09l4.16-4.16a.308.308 0 00.09-.206z"
            />
          </Svg>
        </TouchableOpacity>
        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View style={styles.buttonSection}>
              {languageListRender}

              <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={this.closeModal}>
                <UIText allowFontScaling={false} style={styles.buttonTitleCancel}>
                  {t('Cancel')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    ) : (
      <View>
        <TouchableOpacity style={styles.labelTouch} onPress={this.openModal}>
          <Image source={languageList[this.state.selectedLanguageIndex].image} />
          <UIText allowFontScaling={false} style={styles.labelTouchText}>
            {t(languageList[this.state.selectedLanguageIndex].label)}
          </UIText>
        </TouchableOpacity>
        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View style={styles.buttonSection}>
              {languageListRender}

              <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={this.closeModal}>
                <UIText allowFontScaling={false} style={styles.buttonTitleCancel}>
                  {t('Cancel')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withErrorBoundary(
  withTranslation()(connect(null, { changeLanguage })(LanguagePicker)),
  Fallback,
  handleError
);
