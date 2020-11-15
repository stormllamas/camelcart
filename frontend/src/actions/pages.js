import axios from 'axios';
import { tokenConfig } from './auth'

import {
  CONTACTING,
  CONTACTED,
  AUTH_ERROR
} from './types'

// Contact
export const addInquiry = inquiry => async (dispatch, getState) => {
  dispatch({type: CONTACTING})
  try {
    await axios.post('/api/contact/', inquiry, tokenConfig(getState));
    dispatch({type: CONTACTED})
    M.toast({
      html: 'Message sent!',
      displayLength: 3500,
      classes: 'green',
    });
    return {
      status: 'okay'
    }
  } catch (err) {
    console.log(err)
    M.toast({
      html: 'Oops! something went wrong. Try again later.',
      displayLength: 3500,
      classes: 'red',
    });
    dispatch({type: CONTACTED})
    dispatch({type: AUTH_ERROR});
    return {
      status: 'error'
    }
  }
}
