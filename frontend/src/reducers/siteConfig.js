import { SITE_LOADING, SITE_LOADED } from '../actions/types'

const initialState = {
  siteInfo: null,
  siteInfoLoading: true,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SITE_LOADING:
      return {
        ...state,
        siteInfoLoading: true,
      }

    case SITE_LOADED:
      return {
        ...state,
        siteInfoLoading: false,
        siteInfo: action.payload
      }
    
    default:
      return state
  }
}