import { combineReducers } from 'redux';

import auth from './auth';
import siteConfig from './siteConfig';
import logistics from './logistics';
import manager from './manager';

export default combineReducers({
  auth,
  siteConfig,
  logistics,
  manager
});