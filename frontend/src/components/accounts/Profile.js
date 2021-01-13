import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import AuthPrompt from '../layout/AuthPrompt'
import Preloader from '../common/Preloader'
import moment from 'moment'

import { addAddress, deleteAddress, getAddress, updateUser, updateAddressName } from '../../actions/auth'
import { USER_UPDATED } from '../../actions/types';

const Profile = ({
  auth: { userLoading, user, isAuthenticated },
  logistics: { currentOrder, currentOrderLoading },
  addAddress, deleteAddress, getAddress, updateAddressName,
  updateUser,
  setCurLocation
}) => {
  const history = useHistory()

  const [currentMap, setCurrentMap] = useState('');
  const [searchBox, setSearchBox] = useState(''); 
  const [marker, setMarker] = useState('');
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [addressName, setAddressName] = useState('');

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressName, setSelectedAddressName] = useState('');

  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [gender, setGender] = useState(user ? (user.gender ? user.gender : '') : '');

  const locationGeocode = (latLng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          for (let i=0; i < results.length; i++) {
            if (!results[i].formatted_address.includes('Unnamed Road')) {
              setAddress(results[i].formatted_address)
              break
            }
          }
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    });
  }

  const showGoogleMaps = () => {
    const centerLatLng = new google.maps.LatLng(13.942813, 121.613806);

    // Map options
    const LUCENA_BOUNDS = {
      north: 14.064176315019349,
      south: 13.87847842331748,
      west: 121.39448686001403,
      east: 121.7682355093625,
    }

    // Map options
    const mapOptions = {
      zoom: 14,
      restriction: {
        latLngBounds: LUCENA_BOUNDS,
        strictBounds: false
      },
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: centerLatLng,
      gestureHandling: "greedy",
    }

    // Create and set map
    const map = new google.maps.Map(document.getElementById('googlemap'), mapOptions)
    setCurrentMap(map);

    // Display a caption in the map with user location
    const infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (pos.lat <= LUCENA_BOUNDS.north && pos.lat >= LUCENA_BOUNDS.south && pos.lng >= LUCENA_BOUNDS.west && pos.lng <= LUCENA_BOUNDS.east) {
          infoWindow.setPosition(pos);
          infoWindow.setContent('You');
          infoWindow.open(map);
        }
        map.setCenter(centerLatLng);
      }, function() {
      });
    }

    // Initialize location search bar
    initAutocomplete(map);
  };

  const addSearchListener = () => {
    google.maps.event.clearInstanceListeners(searchBox);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      
      if (places) if (places.length == 0) {
        return;
      }
      
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        event = {
          latLng: place.geometry.location,
          placeId: place.place_id
        }
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        
        addMarker(event, place.formatted_address)
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      currentMap.fitBounds(bounds);
    });
  }
  
  const initAutocomplete = (map) => {
    // Create and set variable for pickup search bar
    const addressInput = $('#profile_address')[0];
    const addressSearchBox = new google.maps.places.SearchBox(addressInput);
    setSearchBox(addressSearchBox);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(addressInput);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      addressSearchBox.setBounds(map.getBounds());
    });
  }
  
  let addressMarkerDown;

  const addMarker = (e, customAddress) => {
    // Deletes previous marker from both confirmed and current sessions
    marker !== '' && marker.setMap(null)
    addressMarkerDown && addressMarkerDown.setMap(null)

    // console.log(e)

    const newMarker = new google.maps.Marker({
      position: e.latLng,
      map: currentMap,
      icon: {
        url: '/static/frontend/img/google-marker-green.png'
      },
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    setMarker(newMarker);
    addressMarkerDown = newMarker
    newMarker.setMap(currentMap)

    setLatitude(newMarker.getPosition().lat())
    setLongitude(newMarker.getPosition().lng())
    
    newMarker.addListener('dragend', function(e) {
      const locationLatLng = new google.maps.LatLng(newMarker.getPosition().lat(), newMarker.getPosition().lng())
      locationGeocode(locationLatLng);
      setLatitude(newMarker.getPosition().lat())
      setLongitude(newMarker.getPosition().lng())
    });

    if (!customAddress) {
      const locationLatLng = new google.maps.LatLng(newMarker.getPosition().lat(), newMarker.getPosition().lng())
      locationGeocode(locationLatLng);
    } else {
      setAddress(customAddress)
    }
  }

  const addNewAddress = () => {
    // if (addressName) {
      const body = {
        user: user.id,
        latitude,
        longitude,
        address,
        name: addressName
      }
      addAddress(body)
    // } else {
    //   M.toast({
    //     html: 'Label this Address',
    //     displayLength: 5500,
    //     classes: 'orange'
    //   });
    // }
  }

  const saveUserChanges = () => {
    const body = {
      username: user.username,
      first_name: firstName,
      last_name: lastName,
      contact: contact,
      gender: gender
    }
    updateUser(body)
  }

  const addressSelected = async (id) => {
    const address = await getAddress(id)
    setSelectedAddress(address)
    setSelectedAddressName(address.name ? address.name : '')
  }

  const saveAddressChanges = async () => {
    const body = {
      id: selectedAddress.id,
      user: selectedAddress.user,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      address: selectedAddress.address,
      name: selectedAddressName
    }
    await updateAddressName(body)
  }
  
  useEffect(() => {
    currentMap && currentMap.addListener('click', e => addMarker(e));
  }, [currentMap]);
  
  useEffect(() => {
    searchBox && addSearchListener();
  }, [searchBox]);

  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
      showGoogleMaps();
    }
  }, [userLoading]);
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);

  useEffect(() => {
    $('select').formSelect();
    M.updateTextFields();
  }, [gender]);

  return (
    <Fragment>
      <section className="section section-profile mt-3">
        <div className="container">
          {user.groups.includes('rider') || user.groups.includes('admin') ? (
            <div className="row">
              <div className="col mb-2">
                {user.picture ? (
                  <div className="bg-cover circle" style={{ backgroundImage: `url(${user.picture}`, height: '100px', width: '100px'}}></div>
                ) : (
                  <div className="bg-cover circle" style={{ backgroundImage: `url(/static/frontend/img/user.jpg)`, height: '100px', width: '100px'}}></div>
                )}
              </div>
              <div className="col pl-2">
                <div className="row mb-0">
                  <div className="col mb-2">
                    <p className="m-0 light-blue-text fw-5 fs-18">{user.first_name} {user.last_name}</p>
                    <small className="grey-text uppercase">{user.groups.includes('admin') ? 'Administrator' : `Rider ${user.rider_info.plate_number ? `(${user.rider_info.plate_number})` : ''}`}</small>
                    <div className="row mt-3 mb-0">
                      <div className="col">
                        {[...Array(parseInt(user.rider_info.review_total)).keys()].map(star => <i key={star} className="material-icons yellow-text text-darken-2">star</i>)}
                        {[...Array(Math.max(5-parseInt(user.rider_info.review_total), 0)).keys()].map(star => <i key={star} className="material-icons grey-text text-lighten-2">star</i>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row flex-col center">
              <div className="col pl-2">
                <p className="m-0 light-blue-text fw-5 center fs-28 full-width">{user.first_name} {user.last_name}</p>
              </div>
            </div>

          )}
          <div className="row mb-5">
            <div className="col s12 flex-row center">
              <button className="btn light-blue lighten-2 modal-trigger uppercase rad-4" data-target="profilemodal">Edit profile</button>
              {/* {user.groups.includes('rider') || user.groups.includes('admin') ? (
                <button className="btn white grey-text text-darken-2 modal-trigger uppercase rad-4 ml-2" data-target="profilemodal">Make payment</button>
              ) : undefined} */}
            </div>
          </div>
        </div>
        {user.groups.includes('rider') || user.groups.includes('admin') ? (
          <Fragment>
            <div className="divider"></div>
            <div className="container">
              <div className="row mt-2">
                <div className="col s12">
                  <div className="grey-text">
                    <p className="fw-6">Amount Due</p>
                    <p className="valign-wrapper mt-1 mb-0 fs-18 fw-6"><i className="material-icons prefix light-blue-text fs-24 mr-2">payments</i>₱ {user.rider_info.accounts_payable.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ) : undefined}
        <div className="divider"></div>
        <div className="container">
          <div className="row mt-2">
            <div className="col s12">
              <div className="grey-text">
                <small>Email</small>
                <i className="valign-wrapper mt-1 mb-0"><i className="material-icons prefix light-blue-text fs-24 mr-2">email</i>{user.email}</i>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="container">
          <div className="row mt-2">
            <div className="col s12">
              <div className="grey-text">
                <small>Phone</small>
                <p className="valign-wrapper mt-1 mb-0"><i className="material-icons prefix light-blue-text fs-24 mr-2">phone</i>{contact}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="container">
          <div className="row mt-2">
            <div className="col s12">
              <div className="grey-text">
                <small>Gender</small>
                <p className="valign-wrapper mt-1 mb-0"><i className="fas fa-venus-mars prefix light-blue-text fs-24 mr-2"></i>{gender}</p>
              </div>
            </div>
          </div>
        </div>
        {user.groups.includes('rider') || user.groups.includes('admin') ? (
          <Fragment>
            <div className="divider"></div>
            <div className="container">
              <div className="row mt-2">
                <div className="col s12">
                  <div className="grey-text">
                    <small>Date Joined</small>
                    <p className="valign-wrapper mt-1 mb-0"><i className="material-icons prefix light-blue-text fs-24 mr-2">calendar_today</i>{moment(user.date_joined).format('ll')}</p>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ) : undefined}
        <div className="divider"></div>
        
        {!user.groups.includes('rider') && (
          <div className="container">
            <div className="row mt-2">
              <div className="col s12">
                <div className="grey-text">
                  <p>Saved Addresses</p>
                  {user.addresses.length > 0 ? (
                    <ul className="collection">
                      {user.addresses.map(address => (
                        <li key={address.id} className="collection-item pr-5 relative">
                          <p className="m-0 grey-text text-darken-1 fw-6">{address.name ? address.name : 'Unnamed Address'} <Link to="" className="ml-1 blue-text pt-2 modal-trigger" data-target="update_addressmodal" onClick={() => addressSelected(address.id)}><i className="fas fa-edit fs-14"></i> Edit</Link></p>
                          <div>{address.address}</div>
                          <Link to="" className="secondary-content top-right" onClick={e => {e.preventDefault(), deleteAddress(address.id)}}>
                            <i className="material-icons red-text">delete_forever</i>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="row mt-3">
                      <div className="col s12 center">
                        <h5 className="grey-text text-lighten-1">No address saved</h5>
                      </div>
                    </div>
                  )}
                  <div className="row mt-4">
                    <div className="col s12 flex-col center middle">
                      <button className="green lighten-1 white-text btn flex-row center middle modal-trigger waves-effect m-0" data-target="addressmodal"><i className="material-icons">add</i>Add new address</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {user.groups.includes('rider') || user.is_superuser ? (
          <div className="container">
            <div className="row mt-2">
              <div className="col s12">
                <div className="grey-text">
                  <p>Payment History</p>
                  {user.rider_info.commission_payments.length > 0 ? (
                    <ul className="collection">
                      {user.rider_info.commission_payments.map(payment => (
                        <li key={payment.id} className="collection-item pr-5 relative">
                          <p className="m-0">{payment.ref_code}</p>
                          <p className="m-0">{payment.description}</p>
                          <small>{moment(payment.date_paid).format('ll')}</small>
                          <div className="right fw-6">₱ {payment.amount.toFixed(2)}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="row mt-3">
                      <div className="col s12 center">
                        <h5 className="grey-text text-lighten-1">No Payments Made</h5>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ): undefined}
      </section>
      
      <div id="addressmodal" className="modal supermodal">
        <div id="googlemap"></div>
        <input id="profile_address" type="text" placeholder="Enter a Location" className="addressmodal-input open"
          value={latitude && longitude ? (address ? address : `(${latitude}), (${longitude})`) : address}
          onChange={e => {
            setAddress(e.target.value);
            setLatitude('');
            setLongitude('');
          }}
        />
        <input type="text" placeholder="Give this place a name" className="addressmodal-name-input open"
          value={addressName}
          onChange={e => setAddressName(e.target.value)}
        />
        <div className="modal-footer">
          <a className="modal-action modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
          <a className="waves-effect waves-blue btn center blue btn-large btn-extended modal-close" onClick={() => addNewAddress()} disabled={!latitude || !longitude || !address ? true : false}>Add New Address</a>
        </div>
      </div>

      <div id="update_addressmodal" className="modal">
        <div className="modal-content relative">
          <a className="modal-action modal-close cancel"><i className="material-icons grey-text">close</i></a>
          <div className="row  m-0 mt-1">
            <div className="col s12 m8 l6">
              <div className="input-field relative">
                <input type="text" id="address_name" className="validate grey-text text-darken-2 m-0 fs-18 fw-6" placeholder="Address Name" value={selectedAddressName} onChange={e => setSelectedAddressName(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12 mb-3">
              <span className="grey-text">{selectedAddress.address}</span>
            </div>
            <a className="modal-action modal-close waves-effect waves-blue btn center blue btn-extended" onClick={() => saveAddressChanges()}>Save Name</a>
          </div>
        </div>
      </div>

      <div id="profilemodal" className="modal supermodal">
        <div className="modal-content relative">
          <h5>Edit Your Profile</h5>
          <a className="modal-action modal-close cancel"><i className="material-icons grey-text">close</i></a>
          <div className="row mt-3">
            <form>
              <div className="col s12 m6">
                <div className="input-field relative">
                  <input type="text" id="first_name" className="validate grey-text text-darken-2" value={firstName} onChange={e => setFirstName(e.target.value)} required/>
                  <label htmlFor="first_name" className="grey-text text-darken-2">First Name</label>
                  <span className="helper-text" data-error="This field is required"></span>
                </div>
              </div>
              <div className="col s12 m6">
                <div className="input-field relative">
                  <input type="text" id="last_name" className="validate grey-text text-darken-2" value={lastName} onChange={e => setLastName(e.target.value)} required/>
                  <label htmlFor="last_name" className="grey-text text-darken-2">Last Name</label>
                  <span className="helper-text" data-error="This field is required"></span>
                </div>
              </div>
              <div className="col s12 m6">
                <div className="input-field relative">
                  <input type="text" id="contact" className="validate grey-text text-darken-2" value={contact} onChange={e => setContact(e.target.value)} required/>
                  <label htmlFor="contact" className="grey-text text-darken-2">Contact</label>
                  <span className="helper-text" data-error="This field is required"></span>
                </div>
              </div>
              <div className="col s12 m6">
                <div className="input-field">
                  <select id="gender" className="text-grey validate grey-text text-darken-2" value={gender} onChange={e => setGender(e.target.value)} required>
                    <option value="" disabled>Select a Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label htmlFor="gender" className="grey-text text-darken-2">Gender</label>
                </div>
              </div>
              <a className="modal-action modal-close waves-effect waves-blue btn center blue btn-large btn-extended" onClick={() => saveUserChanges()}>Save Changes</a>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

Profile.propTypes = {
  addAddress: PropTypes.func.isRequired,
  deleteAddress: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,
  updateAddressName: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { addAddress, deleteAddress, getAddress, updateAddressName, updateUser })(Profile);