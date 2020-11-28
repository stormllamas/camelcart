import React, { Fragment, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';

import AccountsRoute from './common/AccountsRoute';
import PublicRoute from './common/PublicRoute';
import PrivateRoute from './common/PrivateRoute';
import SemiPrivateRoute from './common/SemiPrivateRoute';
import AdminRoute from './common/AdminRoute';
import RiderRoute from './common/RiderRoute';
import SellerRoute from './common/SellerRoute';
import Page404 from './common/Page404';
import ScrollToTop from './common/ScrollToTop';

import Preloader from './common/Preloader';
import SiteMessage from './layout/SiteMessage'

import Login from './accounts/Login'
import Signup from './accounts/Signup'
import ConfirmEmail from './accounts/ConfirmEmail';
import Activate from './accounts/Activate';
import PasswordReset from './accounts/passwordReset/PasswordReset';
import PasswordResetForm from './accounts/passwordReset/PasswordResetForm';

import AdminDashboard from './manager/AdminDashboard'
import SellerManager from './manager/SellerManager'
import SellerManagerPrepared from './manager/SellerManagerPrepared'
import Unclaimed from './manager/Unclaimed'
import Claimed from './manager/Claimed'
import Undelivered from './manager/Undelivered'
import Delivered from './manager/Delivered'

import Home from './pages/Home'
import Contact from './pages/Contact'
import RiderInquiry from './pages/RiderInquiry'
import About from './pages/questions/AboutUs/About'
import FoodGuide from './pages/questions/Guide/FoodGuide'
import DeliveryGuide from './pages/questions/Guide/DeliveryGuide'
import RideGuide from './pages/questions/Guide/RideGuide'
import TrackGuide from './pages/questions/Guide/TrackGuide'
import RatesFAQ from './pages/questions/FAQ/RatesFAQ'
import HoursFAQ from './pages/questions/FAQ/HoursFAQ'

import Bookings from './accounts/Bookings'
import Profile from './accounts/Profile'
import Security from './accounts/Security'

import Delivery from './delivery/Delivery'
import DeliveryPayments from './delivery/DeliveryPayments'

import RideHail from './ride_hail/RideHail'
import RideHailPayments from './ride_hail/RideHailPayments'

import ProductReview from './review/ProductReview'
import OrderReview from './review/OrderReview'

import Restaurants from './food/Restaurants'
import RestaurantDetail from './food/RestaurantDetail'
import ItemDetail from './food/ItemDetail'
import FoodPayments from './food/FoodPayment'

import { loadUser } from '../actions/auth'
import { loadSite } from '../actions/siteConfig'

const App = () => {

  useEffect(() => {
    $('#middle-content').hide();
    $('.loader').show();
    store.dispatch(loadUser());
    store.dispatch(loadSite());
  });

  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop/>
        <SiteMessage/>
        <Switch>
          <AccountsRoute exact path="/login" component={Login} />
          <AccountsRoute exact path="/signup" component={Signup} />
          <PublicRoute exact path="/confirm_email/:email" component={ConfirmEmail} />
          <Route exact path="/activate/:uidb64/:token" component={Activate} />
          <PublicRoute exact path="/password_reset" component={PasswordReset} />
          <PublicRoute exact path="/password_reset_form/:uidb64/:token" component={PasswordResetForm} />

          <PrivateRoute exact path="/profile" component={Profile}/>
          <PrivateRoute exact path="/security" component={Security} />
          <PrivateRoute exact path="/bookings" component={Bookings} />

          <PublicRoute exact path="/" component={Home} />
          <PublicRoute exact path="/contact" component={Contact} />
          <PublicRoute exact path="/rider_inquiry" component={RiderInquiry} />
          <PublicRoute exact path="/about" component={About} />
          <PublicRoute exact path="/questions/food" component={FoodGuide} />
          <PublicRoute exact path="/questions/delivery_guide" component={DeliveryGuide} />
          <PublicRoute exact path="/questions/ride_guide" component={RideGuide} />
          <PublicRoute exact path="/questions/track_guide" component={TrackGuide} />
          <PublicRoute exact path="/questions/rates" component={RatesFAQ} />
          <PublicRoute exact path="/questions/operating_hours" component={HoursFAQ} />

          <PublicRoute exact path="/food" component={Restaurants} />
          <PublicRoute exact path="/food/restaurant" component={RestaurantDetail} />
          <PublicRoute exact path="/food/restaurant/product" component={ItemDetail} />
          <PublicRoute exact path="/food/order_payment/:seller" component={FoodPayments} />

          <PrivateRoute exact path="/product_review/:order_item_id" component={ProductReview} />
          <PrivateRoute exact path="/order_review/:order_id" component={OrderReview} />

          <SemiPrivateRoute exact path="/delivery" component={Delivery} />
          <PrivateRoute exact path="/delivery/payments" component={DeliveryPayments} />

          <SemiPrivateRoute exact path="/ride_hail" component={RideHail} />
          <PrivateRoute exact path="/ride_hail/payments" component={RideHailPayments} />

          <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
          <SellerRoute exact path="/seller_manager/new_orders" component={SellerManager} />
          <SellerRoute exact path="/seller_manager/prepared_orders" component={SellerManagerPrepared} />
          <RiderRoute exact path="/order_manager/unclaimed" component={Unclaimed} />
          <RiderRoute exact path="/order_manager/claimed" component={Claimed} />
          <RiderRoute exact path="/order_manager/undelivered" component={Undelivered} />
          <RiderRoute exact path="/order_manager/delivered" component={Delivered} />

          <Route component={Page404} />
        </Switch>
      </Router>
      <Preloader color="blue" size="big" adds="fixed"/>
    </Provider>
  );
}
ReactDOM.render(<App />, document.getElementById('master'))