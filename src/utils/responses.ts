class ResMessages {
  notFound = (name: string, key: string, value: string | number) => {
    return `${name} with ${key} ${value} is not found!`;
  };
  existed = (name: string, value: string) => {
    return `${name} with ${value} is already existed!`;
  };
  created = (name: string, to_be: string = '', hint: string = 'created!') => {
    return `${name} ${to_be} successfully ${hint}!`;
  };
  info = (name: string, key: string, value: string) => {
    return `${name} info with ${key} ${value}`;
  };
  unAuth = () => {
    return `Token is not provided! UNAUTHORIZED!`;
  };
  accessDenied = () => {
    return `Token is not provided! UNAUTHORIZED!`;
  };
  expiredToken = () => {
    return `Your access token already expired! Plz, get new one!`;
  };
  wrongCredentials = () => {
    return 'email or password is incorrect!';
  };
  updated = (name: string, key: string, value: string) => {
    return `${name} by ${key} ${value} is updated successfully!`;
  };
  deleted = (name: string, key: string, value: string) => {
    return `${name} with ${key} ${value} is deleted successfully!`;
  };
}

export const {
  existed,
  notFound,
  created,
  info,
  unAuth,
  expiredToken,
  wrongCredentials,
  updated,
  deleted,
} = new ResMessages();
