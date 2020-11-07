// import {} from '../actions/types';

import axios from 'axios';

export const getGoogleKey = async () => {
  const res = await axios.get(`/api/google_keys`)
  return res.data
}

export const getDistance = (pickupLat, pickupLng, deliveryLat, deliveryLng) => {
  // dispatch({ type: USER_LOADING })
  const origin = new google.maps.LatLng(pickupLat, pickupLng);
  const destination =  new google.maps.LatLng(deliveryLat, deliveryLng);

  try {
    const distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        // transitOptions: TransitOptions,
        // drivingOptions: DrivingOptions,
        // unitSystem: UnitSystem,
        // avoidHighways: Boolean,
        // avoidTolls: Boolean,
      }, (response, status) => {
        const distanceString = response.rows[0].elements[0].distance.text
        const distanceValue = response.rows[0].elements[0].distance.value
        const durationString = response.rows[0].elements[0].duration.text
        const durationValue = response.rows[0].elements[0].duration.value
        console.log('distance', distanceString)
        console.log('duration', durationString)
        console.log(status)
        const body = {
          distanceString,
          distanceValue,
          durationString,
          durationValue,
        }
        console.log('google distance', body)
        return body
    });


    // dispatch({
    //   type: LOGIN_SUCCESS,
    //   payload: res.data
    // })
  } catch (err) {
    console.log('error', err.data)
    // if (err.response.data[Object.keys(err.response.data)][0] !== 'The usename or password you have entered is incorrect') {
    //   history.push(`/confirm_email/${err.response.data[Object.keys(err.response.data)][0]}`)
    // } else {
    //   dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)][0] }));
    // }
  }
}