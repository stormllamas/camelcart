import { SITE_LOADING, SITE_LOADED } from './types'
import axios from 'axios';

export const loadSite = () => async dispatch => {
  dispatch({ type: SITE_LOADING });
  const res = await axios.get('/api/get_site_info')
  dispatch({
    type: SITE_LOADED,
    payload: res.data
  });
}
