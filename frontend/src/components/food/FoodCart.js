import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { getAddress } from '../../actions/auth'
import { getCurrentOrder, deleteOrderItem, foodCheckout, changeQuantity } from '../../actions/logistics'


const FoodCart = ({
  auth: {
    user,
    userLoading,
    isAuthenticated,
  },
  siteConfig: {
    siteInfo
  },
  logistics: {
    currentOrderLoading,
    currentOrder,
    quantityLoading,
    deleteLoading,
    checkoutLoading
  },
  getCurrentOrder,
  changeQuantity,
  deleteOrderItem,
  getAddress,
  foodCheckout,
  seller,
}) => {
  const history = useHistory()

  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState("");

  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [email, setEmail] = useState(user ? (user.email ? user.email : '') : '');
  const [gender, setGender] = useState(user ? (user.gender ? user.gender : '') : '');

  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [pickupAddress, setPickupAddress] = useState("Please set a pickup address");
  const [deliveryLat, setDeliveryLat] = useState('');
  const [deliveryLng, setDeliveryLng] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState("Please set a delivery address");

  const [distanceText, setDistanceText] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationText, setDurationText] = useState("");
  const [durationValue, setDurationValue] = useState("");
  
  const [description, setDescription] = useState('');
  

  const addressSelected = async () => {
    $('.loader').fadeIn();
    let addressInfo;
    try {
      addressInfo = await getAddress(address)
    } catch (error) {
      history.push('/login')
      $('.loader').fadeOut();
    }
    setDeliveryLat(addressInfo.latitude)
    setDeliveryLng(addressInfo.longitude)
    setDeliveryAddress(addressInfo.address)

    const origin = new google.maps.LatLng(pickupLat, pickupLng);
    const destination =  new google.maps.LatLng(addressInfo.latitude, addressInfo.longitude);
  
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
      }, async (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].distance) {
          const distanceString = response.rows[0].elements[0].distance.text
          const distanceValue = response.rows[0].elements[0].distance.value
          const durationString = response.rows[0].elements[0].duration.text
          const durationValue = response.rows[0].elements[0].duration.value
          setDistanceText(distanceString);
          setDistanceValue(distanceValue);
          setDurationText(durationString);
          setDurationValue(durationValue);
          
          let perKmTotal = Math.round((parseInt(distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
          let total = siteInfo.shipping_base+perKmTotal
          setDelivery(Math.round(total))
        }
      });
    } catch (err) {
      console.log('error', err.data)
    }
    $('.loader').fadeOut();
  }

  const proceedToPayments = async e => {
    e.preventDefault();
    $('.loader').fadeIn();
    if(currentOrder.count < 1 || address === '' || !delivery || !lastName || !firstName || !contact || !email || !gender ? false : true) {
      const formData = {
        vehicleChoice: siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].id,
        firstName, lastName, contact, email, gender,
        pickupLat, pickupLng, pickupAddress,
        deliveryLat, deliveryLng, deliveryAddress,
        distanceText, distanceValue, durationText, durationValue,
      }
      await foodCheckout({
        formData,
        history: history,
        orderSeller: seller
      })
    }
    $('.loader').fadeOut();
  }
  
  useEffect(() => {
    if (address) {
      addressSelected()
    }
  }, [address]);
  
  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      getCurrentOrder({
        type: 'food',
        query: `?order_seller=${seller.id}`
      })
      setPickupLat(seller.latitude)
      setPickupLng(seller.longitude)
      setPickupAddress(seller.address)
    }
  }, [userLoading]);
  
  useEffect(() => {
    if (!currentOrderLoading && currentOrder !== null) {
      if (currentOrder.order_type === 'food') {
        $('.loader').fadeOut();
        $('.middle-content').fadeIn();
        $('.form-notification').attr('style', 'opacity: 1')
        $('select').formSelect();
        $('.collapsible').collapsible({
          accordion: false
        });
        M.updateTextFields();
      } else {
        $('.loader').show();
      }
    } else {
      $('.loader').show();
    }
  }, [currentOrderLoading, currentOrder]);
  
  useEffect(() => {
    if (!quantityLoading && !deleteLoading && !checkoutLoading) {
      $('.loader').fadeOut();
    } else {
      $('.loader').fadeIn();
    }
  }, [quantityLoading, deleteLoading, checkoutLoading]);
  
  return (
    isAuthenticated && !user.groups.includes('rider') && (
      !currentOrderLoading && currentOrder !== null && (
        currentOrder.order_type === 'food' && (
          currentOrder.order_items.length > 0 && (
            <section className="section section-cart pb-1">
              <div className="container">
                <h5>Information</h5>
                <ul className="collapsible mb-5 mt-3">
                  <li>
                    <div className="collapsible-header relative">
                      <span className="main-title">Personal Details</span>
                      {!lastName || !firstName || !contact || !email || !gender ? (
                        <i className="material-icons red-text form-notification">error</i>
                      ) : (
                        <i className="material-icons green-text form-notification">check_circle</i>
                      )}
                      <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div className="collapsible-body grey lighten-4">
                      <div className="row">
                        <div className="col s12 m6">
                          <div className="input-field relative">
                            <input type="text" id="first_name" className="validate grey-text text-darken-2" onChange={e => setFirstName(e.target.value)} required value={firstName}/>
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
                        <div className="col s12 m12 l4">
                          <div className="input-field relative">
                            <input type="text" id="contact" className="validate grey-text text-darken-2" value={contact} onChange={e => setContact(e.target.value)} required/>
                            <label htmlFor="contact" className="grey-text text-darken-2">Contact</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                        <div className="col s12 m12 l4">
                          <div className="input-field relative">
                            <input type="text" id="email" className="validate grey-text text-darken-2" value={email} onChange={e => setEmail(e.target.value)} required/>
                            <label htmlFor="email" className="grey-text text-darken-2">Email</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                        <div className="col s12 m12 l4">
                          <div className="input-field">
                            <select id="gender" className="text-grey validate grey-text text-darken-2" value={gender} onChange={e => setGender(e.target.value)} required>
                              <option value="" disabled>Select a Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <label htmlFor="gender" className="grey-text text-darken-2">Gender</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="active">
                    <div className="collapsible-header relative">
                      <span className="main-title">Delivery Address</span>
                      {!address ? (
                        <i className="material-icons red-text form-notification">error</i>
                      ) : (
                        <i className="material-icons green-text form-notification">check_circle</i>
                      )}
                      <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div className="collapsible-body white p-4">
                      <div className="row">
                        <div className="col s12">
                          <p className="grey-text text-darken-2 fs-18 mb-0">Pick an address</p>
                          <div className="input-field m-0">
                            <select id="address" className="text-grey validate grey-text text-darken-2" value={address} onChange={e => setAddress(e.target.value)} required>
                              <option value="" disabled>Select an address</option>
                              {user && (
                                user.addresses.map(address => (
                                  <option key={address.id} value={address.id}>{address.address}</option>
                                ))
                              )}
                            </select>
                            <Link to="/profile" className="title green-text">Add a new address to your account</Link>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col s12">
                          <div className="input-field relative">
                            <textarea id="delivery-details" className="materialize-textarea validate grey-text text-darken-2" placeholder="Put notes for you order here" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                            <label htmlFor="delivery-details" className="grey-text text-darken-2 fs-22">Order Notes</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="row">
                  <h5>Order</h5>
                  <form className="pb-5">
                    <ul className="collection">
                      {currentOrder !== null && (
                        currentOrder.order_items !== undefined && (
                          currentOrder.order_items.map(orderItem => (
                            <li key={orderItem.id} className={`collection-item avatar pr-5 relative ${!orderItem.product.is_published ? 'grey lighten-3 grey-text text-lighten-1' : ''}`}>
                              <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product.thumbnail})` }}></div>
                              <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>

                              <div className="product-quantity flex-row middle">
                                <div
                                  className={`decrease-quantity flex-col center middle ${orderItem.quantity > 1 && orderItem.product.is_published ? '' : 'disabled grey lighten-3 grey-text text-lighten-1'}`}
                                  onClick={orderItem.quantity > 1 && !quantityLoading && orderItem.product.is_published ? (() => changeQuantity({ orderItemID: orderItem.id, sellerID: seller.id, operation: 'subtract' })) : undefined}
                                >
                                  <i className="material-icons fs-15 fw-6">remove</i>
                                </div>
                                <div className="flex-col center middle quantity">{orderItem.quantity}</div>
                                <div
                                  className={`increase-quantity flex-col center middle ${orderItem.quantity < 10 && orderItem.product.is_published ? '' : 'disabled grey lighten-3 grey-text text-lighten-1'}`}
                                  onClick={orderItem.quantity < 10 && !quantityLoading && orderItem.product.is_published ? (() => changeQuantity({ orderItemID: orderItem.id, sellerID: seller.id, operation: 'add' })) : undefined}
                                >
                                  <i className="material-icons fs-15 fw-6">add</i>
                                </div>
                              </div>

                              <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.product_variant.price.toFixed(2)}</p>
                              <p className="title">₱ {orderItem.total_price.toFixed(2)}</p>
                              <a href="#" className={`secondary-content ${currentOrder.order_items.length < 2 && 'modal-close'}`} onClick={() => deleteOrderItem({ id:orderItem.id, sellerID: seller.id })}>
                                <i className="material-icons red-text">delete_forever</i>
                              </a>
                            </li>
                          ))
                        )
                      )}
                    </ul>
                    <div className="card transparent summary no-shadow mt-3 mb-0">
                      <div className="card-content">
                        <Link to="/food" className="title green-text">Add more items...</Link>
                      </div>
                    </div>
                    <div className="card transparent summary no-shadow mt-2 mb-0">
                      <div className="card-content">
                        <p className="title">Subtotal</p>
                        <p className="secondary-content grey-text text-darken-2 larger">₱ {currentOrder.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="card transparent summary no-shadow">
                      <div className="card-content">
                        <p className="title">Delivery</p>
                        <p className="secondary-content grey-text text-darken-2">{delivery ? `₱ ${delivery.toFixed(2)}` : '-'}</p>
                      </div>
                    </div>
                    <button className='btn btn-extended btn-large green mt-5 mobile-btn relative modal-close'
                      disabled={currentOrder.count < 1 || address === '' || !delivery || !lastName || !firstName || !contact || !email || !gender ? true : false}
                      onClick={proceedToPayments}
                    >
                      <span className="btn-float-text">{currentOrder.count < 1 || address === '' || !delivery || !lastName || !firstName || !contact || !email || !gender ? '' : `₱${(parseFloat(currentOrder.subtotal)+parseFloat(delivery)).toFixed(2)}` }</span>
                      {currentOrder.count < 1 ? 'No items to checkout' : (address === '' || !delivery || !lastName || !firstName || !contact || !email || !gender ? 'Provide details above' : 'Checkout')}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )
        )
      )
    )
  )
}

FoodCart.propTypes = {
  getCurrentOrder: PropTypes.func.isRequired,
  changeQuantity: PropTypes.func.isRequired,
  deleteOrderItem: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,
  foodCheckout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCurrentOrder, deleteOrderItem, getAddress, changeQuantity, foodCheckout })(FoodCart);