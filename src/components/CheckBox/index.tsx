import React from 'react';
import { TouchableOpacity, View, Linking } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { LANG } from 'global';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ICheckBoxProps extends React.ClassAttributes<CheckBox>, WithTranslation {
  checked?: boolean;
  label?: string;
  index?: number;
  hyperLink?: { label: string; labelLink: string; link: string };
  disabled?: boolean;
  textWrapping?: boolean;

  onChange?(checked: boolean, checkBoxRef: MaterialIcons, index?: number): void;
}

interface ICheckBoxState {
  redraw: boolean;
}

export class CheckBox extends React.Component<ICheckBoxProps, ICheckBoxState> {
  private checkbox: MaterialIcons;
  private checked: boolean;

  constructor(props: ICheckBoxProps) {
    super(props);

    this.checked = props.checked != null ? props.checked : false;

    this.state = {
      redraw: false,
    };
  }

  componentDidMount = () => {
    this.props.i18n.on('languageChanged', this.onChangeLanguaged);
  };

  shouldComponentUpdate(nextProps: ICheckBoxProps, nextState: ICheckBoxState) {
    if (nextProps.checked !== this.props.checked) {
      this.checked = nextProps.checked != null ? nextProps.checked : false;
      return true;
    }

    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }

  private onChangeLanguaged = (lng: LANG) => {
    this.setState({
      redraw: !this.state.redraw,
    });
  };

  private onPress = () => {
    if (this.props.disabled !== true) {
      this.checked = !this.checked;
      this.setState({}, () => {
        if (this.props.onChange) {
          this.props.onChange(this.checked, this.checkbox, this.props.index);
        }
      });
    }
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={this.props.textWrapping === true && styles.fill}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <MaterialIcons
              ref={(ref: MaterialIcons) => (this.checkbox = ref)}
              name={this.checked ? 'check-box' : 'check-box-outline-blank'}
              size={22}
              color={Colors.PRIMARY_1}
              style={{ opacity: this.props.disabled === true ? 0.5 : 1 }}
            />
          </View>
          {this.props.hyperLink != null ? (
            <View style={styles.label2}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {`${this.props.hyperLink.label} `}
              </UIText>
              <UIText
                allowFontScaling={false}
                style={styles.labelLink}
                onPress={() => {
                  Linking.openURL(this.props.hyperLink!.link);
                }}
              >
                {this.props.hyperLink.labelLink}
              </UIText>
            </View>
          ) : (
            this.props.label && (
              <View style={[styles.label, this.props.textWrapping === true && styles.fill]}>
                <UIText
                  allowFontScaling={false}
                  style={[styles.labelText, this.props.textWrapping === true && styles.textWrapping]}
                >
                  {this.props.t(this.props.label)}
                </UIText>
              </View>
            )
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default withErrorBoundary(withTranslation()(CheckBox), Fallback, handleError);
