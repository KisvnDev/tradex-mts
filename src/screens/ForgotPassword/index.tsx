import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { isBlank } from 'utils/common';
import config from 'config';
import { confirmAccountNo, resetConfirmAccount, resetPassData, resetPassword } from './actions';
import styles from './styles';
import { IState } from 'redux-sagas/reducers';
import { Navigation } from 'react-native-navigation';
import { reduceUsername } from 'redux-sagas/sagas/Authentication/LoginDomain';
import UIText from 'components/UiText';

const ErrorDefault = {
  username: {
    isError: false,
    message: '',
  },
  card: {
    isError: false,
    message: '',
  },
  password: {
    isError: false,
    message: '',
  },
  confirmPassword: {
    isError: false,
    message: '',
  },
};

function ForgotPassword({ componentId }: { componentId: string }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const username = useRef({ value: '057C' }).current;
  const cardId = useRef({ value: '' }).current;
  const newPass = useRef({ value: '' }).current;
  const confirmNewPass = useRef({ value: '' }).current;
  const otp = useRef({ value: '' }).current;

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState(ErrorDefault);
  const [errorOTP, setErrorOTP] = useState({
    isError: false,
    message: '',
  });

  const { data } = useSelector((state: IState) => state.confirmAccountReducer);
  const { data: dataReset, error } = useSelector((state: IState) => state.resetPasswordReducer);

  const onChangePassword = (text: string) => {
    newPass.value = text;
  };
  const onChangeDate = (text: string) => {
    cardId.value = text;
  };
  const onChangeConfirmPass = (text: string) => {
    confirmNewPass.value = text;
  };
  const onChangeUsername = (text: string) => {
    username.value = text;
  };

  const validate = () => {
    if (isBlank(username.value)) {
      setErrors((e) => ({
        ...e,
        username: {
          isError: true,
          message: 'Account Number is required',
        },
      }));
      return false;
    }

    if (isBlank(cardId.value)) {
      setErrors(() => ({
        ...ErrorDefault,
        card: {
          isError: true,
          message: 'ID Card is required',
        },
      }));
      return false;
    }

    if (isBlank(newPass.value)) {
      setErrors(() => ({
        ...ErrorDefault,
        password: {
          isError: true,
          message: 'Password is not empty',
        },
      }));
      return false;
    }

    if (!config.regex.ForgotPassword.test(newPass.value)) {
      setErrors(() => ({
        ...ErrorDefault,
        password: {
          isError: true,
          message:
            'New password must be greater than 8 characters without whitespace and include 1 uppercase character.',
        },
      }));
      return false;
    }

    if (isBlank(confirmNewPass.value)) {
      setErrors(() => ({
        ...ErrorDefault,
        confirmPassword: {
          isError: true,
          message: 'Confirm password is not empty',
        },
      }));
      return false;
    }

    if (confirmNewPass.value !== newPass.value) {
      setErrors(() => ({
        ...ErrorDefault,
        confirmPassword: {
          isError: true,
          message: 'Password not match',
        },
        password: {
          isError: true,
          message: 'Password not match',
        },
      }));

      return false;
    }

    return true;
  };

  const validateOtp = () => {
    if (isBlank(otp.value)) {
      setErrorOTP({
        isError: true,
        message: 'Otp is required',
      });

      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (validate()) {
      setErrors(ErrorDefault);
      dispatch(confirmAccountNo({ clientID: reduceUsername(username.value), idCardNo: cardId.value }));
    }
  };

  const handleSubmitOTP = () => {
    if (validateOtp()) {
      dispatch(
        resetPassword({
          clientID: reduceUsername(username.value),
          otpValue: otp.value,
          newPassword: newPass.value,
        })
      );
      setErrorOTP({ isError: false, message: '' });
    }
  };

  const handleCancelOTP = () => {
    setShowModal(false);
    dispatch(resetPassData());
    dispatch(resetConfirmAccount());
  };

  const handleResendOtp = () => {
    dispatch(resetConfirmAccount());
    dispatch(confirmAccountNo({ clientID: reduceUsername(username.value), idCardNo: cardId.value }));
  };

  const onChangeOTPValue = (text: string) => {
    otp.value = text;
  };

  useEffect(() => {
    if (data) {
      setShowModal(true);
    }
  }, [data]);

  useEffect(() => {
    if (dataReset?.isSuccess && data) {
      handleCancelOTP();
      Navigation.pop(componentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReset, data]);

  useEffect(() => {
    if (error) {
      setErrorOTP({ isError: true, message: error?.code || 'OTP is wrong' });
    }
  }, [error]);

  useEffect(() => {
    dispatch(resetPassData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" scrollEnabled={true}>
        <TextBox
          label="Account No"
          type={TEXTBOX_TYPE.TEXT}
          keyboardType="default"
          value={username.value}
          error={errors.username.isError}
          errorContent={errors.username.message}
          onChange={onChangeUsername}
          autoCorrect={false}
        />
        <TextBox
          label="ID Card"
          type={TEXTBOX_TYPE.TEXT}
          keyboardType="default"
          value={cardId.value}
          error={errors.card.isError}
          errorContent={errors.card.message}
          onChange={onChangeDate}
          autoCorrect={false}
        />
        <TextBox
          label="New Password"
          type={TEXTBOX_TYPE.PASSWORD}
          keyboardType="default"
          value={newPass.value}
          error={errors.password.isError}
          errorContent={errors.password.message}
          onChange={onChangePassword}
        />
        <TextBox
          label="Confirm New Password"
          type={TEXTBOX_TYPE.PASSWORD}
          keyboardType="default"
          value={confirmNewPass.value}
          error={errors.confirmPassword.isError}
          errorContent={errors.confirmPassword.message}
          onChange={onChangeConfirmPass}
        />
        <View style={styles.btnContainer}>
          <View style={styles.button}>
            <Button onPress={handleConfirm} title={'Confirm 2'} />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Modal transparent={true} visible={showModal} animationType="none">
        <View style={styles.OTPContainer}>
          <View style={[styles.OTPBody]}>
            <View style={styles.titleSection}>
              <UIText allowFontScaling={false} style={styles.titleModal}>
                {t('Confirmation OTP')}
              </UIText>
            </View>
            <ScrollView keyboardShouldPersistTaps={'handled'} scrollEnabled={false} style={[styles.scapingContent]}>
              <View style={styles.OTPContent}>
                <View style={[styles.itemContentStyle]}>
                  <UIText style={styles.boldText}>{t('OTP')}</UIText>
                  <View style={styles.wrapper}>
                    <View style={styles.labelOtp}>
                      <View style={styles.boxMatrix}>
                        <UIText style={styles.labelTouch}>{data?.matrixKey ?? ''}</UIText>
                      </View>
                    </View>
                    <View style={styles.OTPContent1}>
                      <TextBox
                        type={TEXTBOX_TYPE.PASSWORD}
                        keyboardType="numeric"
                        error={errorOTP.isError}
                        errorContent={errorOTP.message}
                        onChange={onChangeOTPValue}
                        textInputStyle={{
                          height: 40,
                        }}
                        labelErrorSection={{ top: -20 }}
                        textBoxInnerIconContainerProps={styles.iconEye}
                        containerStyle={{
                          paddingBottom: 0,
                        }}
                        labelSectionStyle={{
                          height: 0,
                          marginBottom: 0,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.btn}>
                  <Button
                    title={`${t('Resend OTP')} (SMS)`}
                    buttonStyle={styles.sendOtpBtn}
                    onPress={handleResendOtp}
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.OTPFooter}>
              <View style={styles.wrapperBtn}>
                <TouchableOpacity style={[styles.footerBtn, styles.cancelStyle]} onPress={handleCancelOTP}>
                  <UIText style={styles.textCancel}>{t('Cancel')}</UIText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn, styles.confirmStyle]} onPress={handleSubmitOTP}>
                  <UIText style={styles.textConfirm}>{t('Confirm 2')}</UIText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ForgotPassword;
