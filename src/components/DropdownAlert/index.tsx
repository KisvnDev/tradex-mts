import React, { useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import DropdownAlert, { DropdownAlertType } from 'react-native-dropdownalert';
import config from 'config';
import { INotification } from 'interfaces/common';
import styles from './styles';

interface IDropdownAlertOverlayProps {
  componentId: string;

  onDisplay(componentId: string): void;

  onHide(): void;
}

export const DropdownAlertOverlay = (props: IDropdownAlertOverlayProps) => {
  useEffect(() => {
    if (props.onDisplay != null) {
      props.onDisplay(props.componentId);
    }
    return props.onHide;
  });

  return (
    <TouchableOpacity style={styles.container} onPress={DropdownAlertController.onCloseHandler()}>
      <TouchableOpacity activeOpacity={1} style={styles.subContainer}>
        <DropdownAlert
          ref={(ref: DropdownAlert) => DropdownAlertController.setDropDown(ref)}
          closeInterval={config.alertTimeout}
          onClose={DropdownAlertController.onCloseHandler()}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

let _dropdownAlertComponentId: string;

export class DropdownAlertController {
  static dropDown: DropdownAlert;

  static get componentId() {
    return _dropdownAlertComponentId;
  }

  static set componentId(componentId: string) {
    _dropdownAlertComponentId = componentId;
  }

  static get isShowing() {
    return this.componentId != null;
  }

  static setDropDown(dropDown: DropdownAlert) {
    if (dropDown !== this.dropDown) {
      this.dropDown = dropDown;
    }
  }

  static showAlert(type: DropdownAlertType, title: string, message: string, payload?: INotification) {
    Navigation.showOverlay({
      component: {
        id: 'DropdownAlert',
        name: 'DropdownAlert',
        passProps: {
          onDisplay: (componentId: string) => {
            this.componentId = componentId;
            if (this.dropDown != null) {
              setTimeout(() => {
                if (this.dropDown != null) {
                  this.dropDown.alertWithType(type, title, message, payload);
                }
              }, 0);
            }
          },
          onHide: () => {
            delete this.componentId;
          },
        },
        options: {
          layout: {
            backgroundColor: 'transparent',
            componentBackgroundColor: Platform.OS === 'android' ? undefined : 'transparent',
          },
          overlay: {
            interceptTouchOutside: false,
            handleKeyboardEvents: false,
          },
        },
      },
    });
  }

  static alert(type: DropdownAlertType, title: string, message: string, payload?: INotification) {
    try {
      if (this.isShowing) {
        Navigation.dismissOverlay('DropdownAlert').then(() => {
          this.showAlert(type, title, message, payload);
        });
      } else {
        this.showAlert(type, title, message, payload);
      }
    } catch (error) {}
  }

  static onCloseHandler() {
    return () => {
      try {
        Navigation.dismissOverlay('DropdownAlert');
      } catch (error) {}
    };
  }
}
