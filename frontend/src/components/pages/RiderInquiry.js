import React, { useState, Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import ReCAPTCHA from "react-google-recaptcha";

import { connect } from 'react-redux';
import { addInquiry } from '../../actions/pages';

const RiderInquiry = ({
  auth: { userLoading, user },
  pages: { contacting },
  addInquiry
}) => {
  const history = useHistory()

  const [name, setName] = useState(user? user.first_name+' '+user.last_name : '');
  const [email, setEmail] = useState(user? user.email : '');
  const [phone, setPhone] = useState(user? user.contact ? user.contact : '' : '');
  const [age, setAge] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [city, setCity] = useState('');
  const [license, setLicense] = useState('');
  const [riderAcknowledgent, setRiderAcknowledgent] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  const setControlledAge = (num) => {
    if (num.length > 1) {
      if (parseInt(num) >= 18 && parseInt(num) <= 50) {
        setAge(num)
      } else if (parseInt(num) < 18) {
        setAge(18)
      } else if (parseInt(num) > 50) {
        setAge(50)
      }
    } else {
      setAge(num)
    }
  }

  useEffect(() => {
    if (!userLoading) {
      $('#id_message').characterCounter();
      $('select').formSelect();
      M.updateTextFields();
    }
  }, [userLoading]);

  useEffect(() => {
    if (!contacting) {
      $('.loader').fadeOut();
    } else {
      $('.loader').fadeIn();
    }
  }, [contacting]);


  const onSubmit = async e => {
    e.preventDefault();

    if (!name || !email || !phone || !serviceType || !city || !riderAcknowledgent) {
      M.toast({
        html: 'Please fill in required fields',
        displayLength: 5000,
        classes: 'red'
      });
    } else if(!license) {
      M.toast({
        html: 'Lisence photo required',
        displayLength: 5000,
        classes: 'red'
      });
    } else if(license.size > 5000000) {
      M.toast({
        html: 'Maximum file size is 5MB',
        displayLength: 5000,
        classes: 'red'
      });
    } else if(!captchaValid) {
      M.toast({
        html: 'Please check captcha box',
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      const body = new FormData();
      body.append('drivers_license', license, license.name);
      body.append('name', name);
      body.append('email', email);
      body.append('phone', phone);
      body.append('age', age);
      body.append('service_type', serviceType);
      body.append('city', city);
      body.append('subject', serviceType+' - '+city);
      body.append('contact_type', 'rider_inquiry');

      const inquiry = await addInquiry(body);
      if (inquiry.status === 'okay') {
        setName('')
        setEmail('')
        setPhone('')
        setAge('')
        setServiceType('')
        setCity('')
        setRiderAcknowledgent(false)
        setCaptchaValid(false)
      }
    }
  }

  return (
    <Fragment>
      
      <header className="section main-header relative bg-cover"
        style={{
          backgroundImage: "url(/static/frontend/img/delivery_man.jpg",
          height: "360px",
        }}>
        
        <div className="primary-overlay valign-wrapper">
          <div className="row full-width">
            <div className="col s12 m8 offset-m2 center">
              <h4 className="m-0 uppercase f-style-breeserif lh-8"></h4>
              <h2 className="m-0 uppercase f-style-breeserif lh-8"></h2>
              <p className="fs-16 mt-3"></p>
            </div>
          </div>
        </div>
      </header>
      <section className="section section-rider-inquiry">
        <div className="container">
          <div className="row">
            <div className="col l6 hide-on-med-and-down">
              <h4>Earn more with Trike</h4>
              <p className="fs-17">Become one of our riders and create a livelihood part-time or full-time. It's your decision!</p>
              <img src="/static/frontend/img/Trike_score.gif" alt="" className="responsive-img"/>
            </div>
            <div className="col s12 m12 l6">
              <form method="POST" onSubmit={!contacting ? onSubmit : ''} className="card-panel rider-inquiry-form rad-3" noValidate>
                <div className="col s12">
                  <h5 className="mb-1">Application Form</h5>
                  <p className="mt-0 grey-text">Fill out the form below and we'll setup a schedule and reach out to you as soon as we can</p>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <label htmlFor="id_name">Name</label>
                    <input type="text" name="name" rows="1" value={name} maxLength="50" className="validate" id="id_name" onChange={e => setName(e.target.value)} required/>
                  </div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <label htmlFor="id_email">Email</label>
                    <input type="text" name="email" rows="1" value={email} maxLength="50" className="validate" id="id_email" onChange={e => setEmail(e.target.value)} required/>
                  </div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <label htmlFor="id_phone">Phone</label>
                    <input type="text" name="phone" rows="1" value={phone} maxLength="50" className="validate" id="id_phone" onChange={e => setPhone(e.target.value)} required/>
                  </div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <label htmlFor="age" className="grey-text">Age (18-50)</label>
                    <input type="number" name="age" value={age} max="50" className="validate" id="id_age" onChange={e => setControlledAge(e.target.value)} required/>
                  </div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <select id="service_type" className="text-grey validate grey-text text-darken-2" value={serviceType} onChange={e => setServiceType(e.target.value)} required>
                      <option value="" className="grey-text text-darken-2" disabled>Select Service Type</option>
                      <option value="Delivery Rider - Motorcycle" className="grey-text text-darken-2">Delivery Rider - Motorcycle</option>
                      <option value="Delivery Rider - Tricycle" className="grey-text text-darken-2">Delivery Rider - Tricycle</option>
                      <option value="Delivery Rider - Bicycle" className="grey-text text-darken-2">Delivery Rider - Bicycle</option>
                    </select>
                    <label htmlFor="service_type" data-error="This field is required" className="grey-text text-darken-2">Service Type</label>
                  </div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <select id="service_type" className="text-grey validate grey-text text-darken-2" value={city} onChange={e => setCity(e.target.value)} required>
                      <option value=""  className="grey-text text-darken-2" disabled>Designation</option>
                      <option value="Lucena" className="grey-text text-darken-2">Lucena</option>
                    </select>
                    <label htmlFor="service_type" className="grey-text text-darken-2">City</label>
                  </div>
                </div>
                <div className="col s12">
                  <div className="file-field input-field">
                    <div className="btn light-green">
                      <span><i className="material-icons">upload</i></span>
                      <input type="file" accept="image/*" className="validate" onChange={e => {setLicense(e.target.files[0]), 
                      M.toast({
                        html: e.target.files.length,
                        displayLength: 5000,
                        classes: 'red'
                      });}}/>
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" placeholder="Take a photo of your license"/>
                    </div>
                  </div>
                </div>
                <div className="col s12">
                  <p className="mb-1">
                    <label>
                      <input type="checkbox" id="rider_acknowledgent" name="rider_acknowledgent" className="filled-in" 
                        onChange={e => setRiderAcknowledgent(!riderAcknowledgent)}
                        checked={riderAcknowledgent === true}
                      />
                      <span>I agree to be a rider of Trike and that I have a valid drivers license, a registered vehicle (if applicable) and working smartphone</span>
                    </label>
                  </p>
                </div>
                <div className="col s12 flex-col center mb-4">
                  <div id="google-captcha-group" className="col center mt-3">
                    <ReCAPTCHA
                      sitekey="6LdGa-IZAAAAAPhgbM7qWDb7iBSJbr9z23yGcGgE"
                      onChange={() => setCaptchaValid(true)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-large btn-extended green mt-5 mb-2">Send Message</button>
              </form>
            </div>
          </div>
          <div className="row hide-on-large-only">
            <div className="col s12">
              <h4>Earn more with Trike</h4>
              <p className="fs-17">Become one of our riders and create a livelihood part-time or full-time. It's your decision!</p>
              <img src="/static/frontend/img/Trike_score.gif" alt="" className="responsive-img"/>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

RiderInquiry.propTypes = {
  addInquiry: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  pages: state.pages
});

export default connect(mapStateToProps, { addInquiry })(RiderInquiry);
