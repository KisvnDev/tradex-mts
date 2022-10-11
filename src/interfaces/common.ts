import { StyleProp, ViewStyle, NativeSyntheticEvent } from 'react-native';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';
import { AnyAction } from 'redux';
import { DropdownAlertType } from 'react-native-dropdownalert';
import { ISymbolInfo } from './market';
import { SYSTEM_TYPE, SYMBOL_TYPE } from 'global';
import { IOrderMatch, IStopOrderActivation, IAlarmPrice } from './notification';

export interface IWindow {
  ReactNativeWebView: {
    postMessage(data: string): void;
  };
}

export interface IAction<T> {
  type: string;
  showLoading?: boolean;
  hideLoading?: boolean;
  payload: T;
}

export interface IRequest<T> extends AnyAction {
  response: IResponseType;
  payload: T;
}

export interface IResponseType {
  success: string;
  failure: string;
  successTrigger?: string;
}

export interface IClientData {
  clientId: string;
  clientSecret: string;
}

export interface IResponse<T> {
  data: T;
}

export interface IObject {
  [key: string]: Object;
}

export interface INotification {
  type: DropdownAlertType;
  title: string;
  content: string;
  contentParams?: { [s: string]: string | number | undefined };
  time: Date;
}

export interface IRememberUsername {
  isStored: boolean;
  username: string;
}

export interface IFavorite {
  id: number;
  name: string;
  order?: number;
  count?: number;
  maxCount?: number;
  itemList: IFavoriteItem[];
  index?: number;
  showNotification?: boolean;
  checked?: boolean;
}

export interface IFavoriteItem {
  isNote: boolean;
  data: string;
}

export interface IAccount {
  accountNumber: string;
  subNumber: string;
  type: SYSTEM_TYPE;
  account: string;
  accountDisplay?: string;
  banks?: IAccountBank[];
  isBankLinkingAccount?: boolean;
}

export interface IAccountBank {
  bankCode: string;
  bankName: string;
  bankAccount: string;
  account?: IAccount;
}

export interface IAccountBanks {
  banks: IAccountBank[];
  account?: IAccount;
}
export interface ISubAccount {
  accountName?: string;
  accountNumber?: string;
}

export interface IUserInfo {
  id: number;
  username: string;
  avatar?: string;
  displayName: string;
  accounts?: ISubAccount[];
}

export interface IAccountInfo {
  customerName: string;
  dateOfBirth: string;
  identifierNumber: string;
  identifierIssueDate: string;
  identifierIssuePlace: string;
  address: string;
  email: string;
  phoneNumber: string;
  authorizedPerson?: IAuthorizedPersonDetail;
  customerProfile?: ICustomerProfileDetail;
}

export interface ICustomerProfileDetail {
  accountNo: string;
  customerID: string;
  userName: string;
  IDNumberPassport: string;
  address: string;
  telephone: string;
  mobilePhone: string;
  email: string;
  customerType: string;
  branchName: string;
  brokersName: string;
  brokersContactNo: string;
  brokersEmail: string;
  authorizedPerson: boolean;
}

export interface IAuthorizedPersonDetail {
  exist: boolean;
  authorizedPersonsName: string;
  authorizedPersonsID: string;
  IDCardPassport: string;
  address: string;
  telephone: string;
  email: string;
}

export interface IDomainUserInfo {
  username: string;
  accounts?: IObject[];
}

export interface IToken {
  registerMobileOtp: boolean;
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
  userInfo: IUserInfo | IDomainUserInfo;
  token: IToken;
}

export interface IUserExtraInfo {
  currentSymbol?: ISymbolInfo;
  selectedAccount?: IAccount;
  favoriteLists?: IFavorite[];
  selectedFavorite?: IFavorite;
  settings?: ISettings;
}

export interface IHighChart {
  stock: boolean;
  more?: boolean;
  gauge?: boolean;
  options: object;
  config: object;
  style?: StyleProp<ViewStyle>;
  originWhitelist?: string[];

  onMessage?: (event: NativeSyntheticEvent<WebViewMessage>) => void;
}

export interface ISettings {
  autoLockPrevention?: boolean;
  usingTouchFaceId?: boolean;
  loginSession?: number;
  usingMobileOTP?: boolean;
}

export interface IPushNoficiaton {
  payload: {
    additionalData: (IOrderMatch | IAlarmPrice | IStopOrderActivation) & {
      method: 'MATCH_ORDER' | 'STOP_ORDER_ACTIVATION' | 'ALARM_PRICE' | 'MOBILE_OTP';
    };
    body: string;
  };
  isAppInFocus?: boolean;
}

export interface IAlarm {
  id?: number;
  alarmId?: number;
  code: string;
  value: number;
  currentValue?: number;
  type: SYMBOL_TYPE;
  option: string;
  notificationMethod: string;
  checked?: boolean;
}

export interface IWSNotification {
  method: 'MATCH_ORDER' | 'STOP_ORDER_ACTIVATION' | 'ALARM_PRICE';
  payload: IOrderMatch | IStopOrderActivation | IAlarmPrice;
}

export interface IAndroidEkycResult {
  challengeCode?: string;
  dataBase64?: string;
  dataSign?: string;
  imgs?: { img_back: string; img_front: string };
  logID?: string;
  message?: string;
  object?: IEkycInfo;
  server_version?: string;
  statusCode?: number;
  imgFront?: string;
  imgRear?: string;
  imagePortrait?: string;
  info?: string;
  faceResult?: string;
  compare?: string;
  imageFront?: string;
  imageFace?: string;
  imageBack?: string;
  errors?: string[];
}

export interface IEkycInfo {
  back_corner_warning: string;
  back_expire_warning: string;
  back_type_id: number;
  birth_day: string;
  birth_day_prob: number;
  card_type: string;
  citizen_id: string;
  citizen_id_prob: number;
  corner_warning: string;
  expire_warning: string;
  gender: string;
  id: string;
  id_fake_prob: number;
  id_fake_warning: string;
  id_probs: string;
  issue_date: string;
  issue_date_prob: number;
  issue_date_probs: number[];
  issue_place: string;
  issue_place_prob: number;
  msg: string;
  msg_back: string;
  name: string;
  name_prob: number;
  nation_policy: string;
  nationality: string;
  origin_location: string;
  origin_location_prob: number;
  recent_location: string;
  recent_location_prob: number;
  type_id: number;
  valid_date: string;
  valid_date_prob: number;
  prob: number;
}

export interface IPersonalInfo {
  type: IPersonalInfoType;
  birthDay: string;
  expiredDate: string;
  issueDate: string;
  issuePlace: string;
}

export type IPersonalInfoType = 'CMND' | 'CC' | 'PASSPORT';

export interface IEkycParams {
  identifierId?: string;
  fullName?: string;
  phoneNo?: string;
  gender?: string;
  type?: string; // CMND, CC, PASSPORT
  birthDay?: string; //YYYYMMDD
  expiredDate?: string; //YYYYMMDD
  issueDate?: string; //YYYYMMDD
  issuePlace?: string; //YYYYMMDD
  address?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  portraitImageUrl?: string;
  signatureImageUrl?: string;
  isMargin?: boolean;
  matchingRate?: number;
  occupation?: string;
  homeTown?: string;
  permanentProvince?: string;
  permanentDistrict?: string;
  permanentAddress?: string;
  contactProvince?: string;
  contactDistrict?: string;
  contactAddress?: string;
  email?: string;
  referrerIdName?: string;
  referrerBranch?: string;
  bankAccount?: string;
  accountName?: string;
  bankName?: string;
  branch?: string;
  branchId?: string;
  bankId?: string;
  nationality?: string;
  tradingCodeImageUrl?: string;
}

//IICA
export interface IMASCommonResponse {
  errorCode: string;
  errorMessage: string;
}
