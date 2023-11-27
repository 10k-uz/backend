import * as crypto from 'crypto';

export * from './responses';
export * from './token-generator';
export * from './captcha';

export const tokenFormatter = (token: string) => {
  return token && token.split(' ')[1];
};

export const codeGenerator = () => {
  return crypto.randomInt(1000, 9999);
};
