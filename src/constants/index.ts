enum permissions {
  PRODUCTS = 'PRODUCTS',
  ORDERS = 'ORDERS',
  CATEGORIES = 'CATEGORIES',
  ALL = 'ALL',
}

enum order_state {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  READY_DELIVERY = 'READY_DELIVERY',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CAME_BACK = 'CAME_BACK',
  ARCHIVED = 'ARCHIVED',
  BANNED = 'BANNED',
}

enum orderType {
  COMMON = 'COMMON',
  CPA = 'CPA',
}
const jwtConstants = {
  secret: 'MY_SECRET',
};

enum OperationType {
  ADD = 'ADD',
  REDUCE = 'REDUCE',
}

const AD_CAMPAIGN_BONUS = 1000;
const MIN_WITHDRAW_AMOUNT = 100;

const MAIL_CODE_EXPIRE_TIME = 300; //5 minute
const MAIL_CODE_RESEND_TIME = 180; //1 minute

export {
  permissions,
  order_state,
  orderType,
  jwtConstants,
  AD_CAMPAIGN_BONUS,
  OperationType,
  MIN_WITHDRAW_AMOUNT,
  MAIL_CODE_EXPIRE_TIME,
  MAIL_CODE_RESEND_TIME,
};
