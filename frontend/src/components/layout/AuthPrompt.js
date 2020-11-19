import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';

const AuthPrompt = () => {
  const history = useHistory()
  return (
    <section className="section-auth-prompt flex-col center middle">
      {history.location.pathname.includes('/delivery') && (
        <Fragment>
          <div className="section-auth-img mt-5" style={{ backgroundImage: `url('/static/frontend/img/Trike_motor_logo.png')` }}></div>
          <p className="m-0 mt-4">Just set a pickup and drop-off point</p>
          <p className="m-0">and we'll get a rider right to you</p>
          <p className="mt-5 grey-text">Terms and Conditions</p>
        </Fragment>
      )}
      {history.location.pathname.includes('/food') && (
        <Fragment>
          <div className="section-auth-img mt-5" style={{ backgroundImage: `url('/static/frontend/img/Trike_food_logo.png')` }}></div>
          <p className="m-0 mt-4">Hungry?</p>
          <p className="m-0">Have you food delivered right to you door</p>
          <p className="mt-5 grey-text">Terms and Conditions</p>
        </Fragment>
      )}
      <Link to='/login' className="btn btn-large green lighten-1 bold mt-5 mb-2 mobile-btn" >Log in with Trike</Link>
    </section>
  )
}

export default AuthPrompt;