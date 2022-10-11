export enum LANG {
  VI = 'vi',
  EN = 'en',
  KO = 'ko',
  ZH = 'zh',
}

export enum BIOMETRIC_TYPE {
  TouchID = 'TouchID',
  FaceID = 'FaceID',
  None = 'None',
}

export enum BIOMETRIC_FAILED_TYPE {
  LOGIN_BIOMETRIC_NOT_FOUND = 'LOGIN_BIOMETRIC_NOT_FOUND',
  LOGIN_BIOMETRIC_SIGNATURE_VERIFICATION_FAILED = 'LOGIN_BIOMETRIC_SIGNATURE_VERIFICATION_FAILED',
  LOGIN_BIOMETRIC_PASSWORD_NOT_MATCH = 'LOGIN_BIOMETRIC_PASSWORD_NOT_MATCH',
  LOGIN_BIOMETRIC_PUBLIC_KEY_EXISTED = 'LOGIN_BIOMETRIC_PUBLIC_KEY_EXISTED',
  LOGIN_BIOMETRIC_OTP_DOES_NOT_VERIFIED = 'LOGIN_BIOMETRIC_OTP_DOES_NOT_VERIFIED',
  LOGIN_BIOMETRIC_OTP_VERIFIED_FAILED = 'LOGIN_BIOMETRIC_OTP_VERIFIED_FAILED',
}

export enum SYSTEM_TYPE {
  EQUITY = 'EQUITY',
  DERIVATIVES = 'DERIVATIVES',
}

export const EQUITY_DEFAULT_BANK_CODE = '9999';

export enum SYMBOL_TYPE {
  STOCK = 'STOCK',
  FUND = 'FUND',
  ETF = 'ETF',
  FUTURES = 'FUTURES',
  CW = 'CW',
  BOND = 'BOND',
  INDEX = 'INDEX',
  ODDLOT = 'ODDLOT',
}

export enum MARKET {
  HOSE = 'HOSE',
  HNX = 'HNX',
  UPCOM = 'UPCOM',
}

export enum MARKET_NEW_KIS {
  HNX30 = 'HNX30',
  HNXINDEX = 'HNXIndex',
  HNXUpcomIndex = 'HNXUpcomIndex',
}

export enum SELL_BUY_TYPE {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum MASSellBuyType {
  SELL = 'S',
  BUY = 'B',
  ALL = 'ALL',
}

export enum EnquiryOrderStatus {
  SELECT = 'NONE',
  ALL = 'ALL',
  FULLY_EXECUTED = 'FULLYFILLED',
  QUEUED = 'QUEUE',
  PARTIALLY_FILLED = 'PARTIALLYFILL',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  NEW = 'READYTOSEND',
  SENDING = 'SENDING',
  WAITING = 'PENDINGAPPROVAL',
  TRIGGER_ORDER = 'STOP',
  WAITING_CANCEL = 'WAITINGCANCEL',
  WAITING_MODIFY = 'WAITINGMODIFY',
  INACTIVE = 'INACTIVE',
  EXP = 'EXPIRED',
  REJECT = 'REJECT',
  FILLED = 'FILLED',
}

export enum orderBook_HisStatus {
  SELECT = 'NONE',
  ALL = 'ALL',
  FULLY_EXECUTED = 'FULLYFILLED',
  QUEUED = 'QUEUE',
  PARTIALLY_FILLED = 'PARTIALLYFILL',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  NEW = 'READYTOSEND',
  SENDING = 'SENDING',
  WAITING = 'PENDINGAPPROVAL',
  TRIGGER_ORDER = 'STOP',
  WAITING_CANCEL = 'WAITINGCANCEL',
  WAITING_MODIFY = 'WAITINGMODIFY',
  INACTIVE = 'INACTIVE',
  EXP = 'EXPIRED',
  ACTIVESENDING = 'ACTIVESENDING',
  ACTIVE = 'ACTIVE',
}

export enum RightTypeTTL {
  ALL = 'ALL',
  CASH_DIVIDEND = '1',
  STOCK_DIVIDEND = 'I',
  BONUS_SHARE = 'B',
  ADDITIONAL_ISSUE = 'D',
}

export enum NOTIFICATION_TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
  CUSTOM = 'custom',
}

export const SYMBOL_LIST_STORAGE_KEY = 'symbolList';
export const VIEW_MODE_KEY = 'viewMode';
export const VIEW_MODE_USERNAME = 'viewModeUsername';
export const SESSION_TIME_KEY = 'sessionTime';
export const OTP_TOKEN_FOR_NEW_KIS_CORE = 'OTP_TOKEN_FOR_NEW_KIS_CORE';
export const PUBLIC_KEY_BIOMETRIC = 'publicKeyBiometric';
export const USERNAME_BIOMETRIC = 'usernameBiometric';
export const INPUT_QUANTIY_ID_KEY = 'INPUT_QUANTIY_ID_KEY';
export const ACCOUNT_FETCH_COUNT = 20;

export enum REALTIME_CHANNEL_DATA_TYPE {
  QUOTE = 'QUOTE',
  BID_OFFER = 'BID_OFFER',
}

export const SYMBOL_BID_OFFER_MAX_SIZE = {
  [SYMBOL_TYPE.STOCK]: 3,
  [SYMBOL_TYPE.FUND]: 3,
  [SYMBOL_TYPE.ETF]: 3,
  [SYMBOL_TYPE.CW]: 3,
  [SYMBOL_TYPE.FUTURES]: 5,
};

export enum PERIOD_OPTIONS {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export type TypeFocusOn = 'TICKS' | 'MINUTES' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SETTINGS';
export type TypeChartType = 'ticks' | 'minutes' | 'period';

export const TICK_OPTIONS = [
  { label: '1', value: 1 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
];

export const MINUTE_OPTIONS = [
  { label: '1', value: 1 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '30', value: 30 },
];

export enum ORDER_KIND {
  NORMAL_ORDER = 'Normal Order',
  STOP_ORDER = 'Stop Order',
  STOP_LIMIT_ORDER = 'Stop Limit Order',
  ADVANCE_ORDER = 'Advance Order',
  ODDLOT_ORDER = 'Oddlot Order',
}

export enum ORDER_TYPE {
  LO = 'LO',
  MP = 'MP',
  ATO = 'ATO',
  ATC = 'ATC',
  MOK = 'MOK',
  MAK = 'MAK',
  MTL = 'MTL',
  PLO = 'PLO',
  ODDLOT = 'ODDLOT',
}

export enum STOP_ORDER_TYPE {
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
}

export enum STOP_ORDER_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  ALL = 'ALL',
  SENDING = 'SENDING',
}

export enum DERIVATIVES_ADVANCE_ORDER_TYPE {
  AO = 'AO',
  CAO = 'CAO',
}

export const DERIVATIVES_ADVANCE_ORDER_TYPES = [
  { label: 'AO', value: DERIVATIVES_ADVANCE_ORDER_TYPE.AO },
  { label: 'CAO', value: DERIVATIVES_ADVANCE_ORDER_TYPE.CAO },
];

export enum DERIVATIVES_MARKET_SESSION {
  ATO = 'ATO',
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  ATC = 'ATC',
}

export const DERIVATIVES_MARKET_SESSION_OPTION = [
  { label: 'ATO', value: DERIVATIVES_MARKET_SESSION.ATO },
  { label: 'MORNING', value: DERIVATIVES_MARKET_SESSION.MORNING },
  { label: 'AFTERNOON', value: DERIVATIVES_MARKET_SESSION.AFTERNOON },
  { label: 'ATC', value: DERIVATIVES_MARKET_SESSION.ATC },
];

export enum DERIVATIVES_TRANSFER_IM_TYPE {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum DERIVATIVES_TRANSFER_IM_BANK_TYPE {
  DEPOSIT_FROM = 'DEPOSIT_FROM',
  DEPOSIT_TO = 'DEPOSIT_TO',
  WITHDRAW_FROM = 'WITHDRAW_FROM',
  WITHDRAW_TO = 'WITHDRAW_TO',
}

export enum ORDER_FORM_ACTION_MODE {
  CANCEL = 'Cancel',
  MODIFY = 'Modify',
}

export const ORDER_TYPES = {
  [SYMBOL_TYPE.STOCK]: {
    [MARKET.HOSE]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'ODDLOT', value: 'ODDLOT' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MP', value: 'MP' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.HNX]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MTL', value: 'MTL' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.UPCOM]: {
      [ORDER_KIND.NORMAL_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.ADVANCE_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
  },
  [SYMBOL_TYPE.ETF]: {
    [MARKET.HOSE]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MP', value: 'MP' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.HNX]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MTL', value: 'MTL' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.UPCOM]: {
      [ORDER_KIND.NORMAL_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.ADVANCE_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
  },
  [SYMBOL_TYPE.FUND]: {
    [MARKET.HOSE]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MP', value: 'MP' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.HNX]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MTL', value: 'MTL' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.UPCOM]: {
      [ORDER_KIND.NORMAL_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.ADVANCE_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
  },
  [SYMBOL_TYPE.FUTURES]: {
    [MARKET.HNX]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATO', value: 'ATO' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: {
        ATO: [
          { label: 'LO', value: 'LO' },
          { label: 'ATO', value: 'ATO' },
        ],
        MORNING: [
          { label: 'LO', value: 'LO' },
          { label: 'MOK', value: 'MOK' },
          { label: 'MAK', value: 'MAK' },
          { label: 'MTL', value: 'MTL' },
        ],
        AFTERNOON: [
          { label: 'LO', value: 'LO' },
          { label: 'MOK', value: 'MOK' },
          { label: 'MAK', value: 'MAK' },
          { label: 'MTL', value: 'MTL' },
        ],
        ATC: [
          { label: 'LO', value: 'LO' },
          { label: 'ATC', value: 'ATC' },
        ],
      },
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MOK', value: 'MOK' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
  },
  [SYMBOL_TYPE.CW]: {
    [MARKET.HOSE]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'MP', value: 'MP' },
        { label: 'ATO', value: 'ATO' },
        { label: 'ATC', value: 'ATC' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MP', value: 'MP' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.HNX]: {
      [ORDER_KIND.NORMAL_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.ADVANCE_ORDER]: [
        { label: 'LO', value: 'LO' },
        { label: 'ATC', value: 'ATC' },
        { label: 'MOK', value: 'MOK' },
        { label: 'MAK', value: 'MAK' },
        { label: 'MTL', value: 'MTL' },
        { label: 'PLO', value: 'PLO' },
      ],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'MTL', value: 'MTL' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
    [MARKET.UPCOM]: {
      [ORDER_KIND.NORMAL_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.ADVANCE_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_ORDER]: [{ label: 'LO', value: 'LO' }],
      [ORDER_KIND.STOP_LIMIT_ORDER]: [{ label: 'LO', value: 'LO' }],
    },
  },
};

export enum MARKET_STATUS {
  ATO = 'ATO',
  LO = 'LO',
  INTERMISSION = 'INTERMISSION',
  ATC = 'ATC',
  PLO = 'PLO',
  RUNOFF = 'RUNOFF',
  CLOSED = 'CLOSED',
}

export const QUANTITY_LIST = {
  [SYMBOL_TYPE.STOCK]: {
    [MARKET.HOSE]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000],
    [MARKET.HNX]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
    [MARKET.UPCOM]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
  },
  [SYMBOL_TYPE.ETF]: {
    [MARKET.HOSE]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000],
    [MARKET.HNX]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
    [MARKET.UPCOM]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
  },
  [SYMBOL_TYPE.FUND]: {
    [MARKET.HOSE]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000],
    [MARKET.HNX]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
    [MARKET.UPCOM]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
  },
  [SYMBOL_TYPE.CW]: {
    [MARKET.HOSE]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000],
    [MARKET.HNX]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
    [MARKET.UPCOM]: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 5000, 7500],
  },
  [SYMBOL_TYPE.FUTURES]: {
    [MARKET.HNX]: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 50, 75, 100, 150, 200, 300, 400, 500],
  },
  [SYMBOL_TYPE.ODDLOT]: {
    [MARKET.HOSE]: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99],
    [MARKET.HNX]: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99],
    [MARKET.UPCOM]: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99],
  },
};

export const ALARMS_NOTIFICATION_OPTION_LIST = [
  { value: 'ONCE', label: 'Alarm Once' },
  { value: 'MULTIPLE', label: 'Alarm Multiple' },
];

export const ALARMS_NOTIFICATION_METHODS = [{ value: 'PUSH_NOTIFICATION', label: 'PUSH_NOTIFICATION' }];

export enum FAVORITE_SORT_TYPE {
  NO_SORT = 'noSort',
  BY_NAME = 'byName',
  BY_PERCENTAGE = 'byPercentage',
  BY_VOLUMN = 'byVolume',
  BY_PRICE = 'byPrice',
}

export const dateFormatCheck = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
