import React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IState } from 'redux-sagas/reducers';
import { dateFormatCheck, NOTIFICATION_TYPE } from 'global';
import { IObject } from 'interfaces/common';
import { handleError } from 'utils/common';
import Button from 'components/Button';
import Fallback from 'components/Fallback';
import { checkEkycID, showNoti } from '../../action';
import config from 'config';
import styles from './styles';
import UIText from 'components/UiText';

interface IEkycDocumentResultProps extends React.ClassAttributes<EkycDocumentResult>, WithTranslation {
  documentResult: any;
  faceResult: any;
  ekycCheckID: IState['ekycCheckID'];
  onCheckDocument: (params: IObject, isReturn?: boolean) => void;
  checkEkycID: typeof checkEkycID;
  showNoti: typeof showNoti;
}

const infoTitle = {
  idCard: 'ID Card',
  name: 'Full name',
  hometown: 'Hometown',
  address: 'Address',
  birthday: 'Birthday',
  issueDate: 'Issue Date',
  issuePlace: 'Issue Place',
};
class EkycDocumentResult extends React.Component<IEkycDocumentResultProps> {
  constructor(props: IEkycDocumentResultProps) {
    super(props);
    this.state = {
      idCard: this.props.documentResult?.id,
      name: this.props.documentResult?.name,
      hometown: this.props.documentResult?.origin_location,
      address: this.props.documentResult?.recent_location.replace(/(\r\n|\n|\r)/gm, ','),
      birthday: this.props.documentResult?.birth_day,
      issueDate: this.props.documentResult?.issue_date,
      issuePlace: this.props.documentResult?.issue_place.replace(/(\r\n|\n|\r)/gm, ' '),
    };
  }

  componentDidMount() {
    if (!config.usingNewKisCore) {
      this.props.checkEkycID({ nationalId: this.props.documentResult.id });
    }
  }

  render() {
    const { t } = this.props;
    const greenTick = (
      <TouchableOpacity style={styles.icon}>
        <FontAwesome5 name="check" size={14} color={'#27AE60'} />
      </TouchableOpacity>
    );

    const redTick = (
      <TouchableOpacity style={styles.icon}>
        <FontAwesome5 name="times" size={14} color={'#EB5757'} />
      </TouchableOpacity>
    );

    const tickFilter = (info: string) =>
      info === 'idCard'
        ? (config.usingNewKisCore ? true : this.props.ekycCheckID?.result === true)
          ? greenTick
          : redTick
        : info === 'birthday'
        ? dateFormatCheck.test((this.state as any).birthday)
          ? greenTick
          : redTick
        : info === 'issueDate'
        ? dateFormatCheck.test((this.state as any).issueDate)
          ? greenTick
          : redTick
        : (this.state as any)[info].trim()
        ? greenTick
        : redTick;

    return (
      <ScrollView>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <UIText style={styles.heading}>{t('Personal Information')}</UIText>
            {Object.keys(this.state).map((info) => (
              <View style={styles.info} key={info}>
                <View style={styles.infoTitle}>
                  <UIText>{t(infoTitle[info])}:</UIText>
                </View>
                <View style={styles.infoResult}>
                  <TextInput
                    style={styles.input}
                    editable={info === 'idCard' ? false : true}
                    value={this.state[info]}
                    multiline={true}
                    onChangeText={(e) => {
                      this.onChangeValue(info, e);
                    }}
                  />
                </View>
                <View style={styles.iconContainer}>
                  <View style={styles.iconFlex}>
                    {tickFilter(info)}
                    <TouchableOpacity style={styles.icon}>
                      <FontAwesome5 name="pencil-alt" size={14} color={'#2569B0'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {this.props.ekycCheckID?.result === false && !config.usingNewKisCore && (
              <UIText style={styles.warning}>
                {t('Your ID Card has already been registered for opening KIS account')}
              </UIText>
            )}
            {this.props.faceResult.msg !== 'MATCH' && (
              <UIText style={styles.warning}>{t('Unmatch face, please try again')}</UIText>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {this.props.faceResult.msg === 'MATCH' && (config.usingNewKisCore || this.props.ekycCheckID?.result) ? (
              <Button title={t('ACCEPT')} onPress={this.onAccept} />
            ) : (
              <Button title={'Return'} onPress={this.onReturn} />
            )}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    );
  }

  private onChangeValue = (info: string, e: string) => {
    this.setState({ [info]: e });
    if (info === 'idCard') {
    }
  };

  private onReturn = () => {
    console.log('on return');
    this.props.onCheckDocument(this.state, true);
  };

  private onAccept = () => {
    if (!dateFormatCheck.test((this.state as any).birthday) || !dateFormatCheck.test((this.state as any).issueDate)) {
      this.props.showNoti(this.props.t('Personal Information'), this.props.t('DAY_REQUIRED'), NOTIFICATION_TYPE.ERROR);
      return;
    }
    if (
      !(this.state as any).name.trim() ||
      !(this.state as any).hometown.trim() ||
      !(this.state as any).address.trim() ||
      !(this.state as any).issuePlace.trim()
    ) {
      this.props.showNoti(this.props.t('Personal Information'), this.props.t('BLANK_INFOR'), NOTIFICATION_TYPE.ERROR);
      return;
    }
    config.usingNewKisCore
      ? this.props.onCheckDocument(this.state, false)
      : this.props.onCheckDocument(this.state, !this.props.ekycCheckID);
  };
}

const mapStateToProps = (state: IState) => ({
  ekycCheckID: state.ekycCheckID,
});

const mapDispathToProps = {
  checkEkycID,
  showNoti,
};

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, mapDispathToProps)(EkycDocumentResult)),
  Fallback,
  handleError
);
