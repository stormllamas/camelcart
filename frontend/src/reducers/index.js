import { combineReducers } from 'redux';

import auth from './auth';
import pages from './pages';
import siteConfig from './siteConfig';
import logistics from './logistics';
import manager from './manager';

export default combineReducers({
  pages,
  auth,
  siteConfig,
  logistics,
  manager
});