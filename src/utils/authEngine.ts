import { AuthEngine } from 'socketcluster-client/lib/auth';
import { getKey, setKey, removeKey } from './asyncStorage';

AuthEngine.prototype.saveToken = function(name: string, token: string, options?: object, callback?: Function) {
  setKey(name, token).then(() => {
    callback && callback(null, token);
  });
};

AuthEngine.prototype.removeToken = function(name: string, callback: Function) {
  let token: string;

  this.loadToken(name, (err: Error, authToken: string) => {
    token = authToken;
  });

  removeKey(name).then(() => {
    callback && callback(null, token);
  });
};

AuthEngine.prototype.loadToken = function(name: string, callback: Function) {
  getKey(name).then((token) => {
    callback(null, token);
  });
};
