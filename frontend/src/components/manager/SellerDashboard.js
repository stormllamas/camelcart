import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment'

import DatePicker from "react-datepicker"
import Preloader from '../../components/common/Preloader'

import { renderRevenueGraph, renderSalesPieChart, getSellerDashboardData, toggleIsPublished } from '../../actions/manager'

const SellerDashboard = ({
  manager: {
    dashboardLoading,
    dashboardData,
    togglingIsPublished
  },
  renderRevenueGraph,
  getSellerDashboardData,
  toggleIsPublished,
  setCurLocation
}) => {
  const history = useHistory()

  const [shortcutDate, setShortcutDate] = useState(7);
  const [fromDate, setFromDate] = useState(new Date(moment().subtract(7, 'days').format("YYYY-MM-DD")));
  const [toDate, setToDate] = useState(new Date(moment().format("YYYY-MM-DD")));

  const parseDateValue = value => {
    if (value == 7) return 'last 7 days'
    if (value == 30) return 'this month'
    if (value == 367) return 'this year'
  }

  const fromDateSelected = (date) => {
    setShortcutDate('')
    if (date > toDate) {
      M.toast({
        html: 'exceeds to date',
        displayLength: 3500,
        classes: 'red'
      });
      setFromDate(toDate)
    } else {
      setFromDate(date)
    }
  }

  const toDateSelected = (date) => {
    setShortcutDate('')
    if(fromDate > date) setFromDate(date)
    setToDate(date)
  }

  const shortcutDateSelected = (days) => {
    setShortcutDate(days)
    setFromDate(new Date(moment().subtract(days, 'days').format("YYYY-MM-DD")))
    setToDate(new Date(moment().format("YYYY-MM-DD")))
  }

  const createChartData = (orders, range) => {
    const rangedList = []
    for (let i = 0; i < range+1; i++) {
      rangedList.unshift (
        { x: new Date(moment(toDate).subtract(i ,'days').format("YYYY-MM-DD")), y: 0},
      )
    }
    rangedList.forEach((info, infoIndex) => {
      orders.forEach((order, index) => {
        if (moment(info.x, "YYYY-MM-DD").format("YYYY-MM-DD") === moment(order.date_paid, "YYYY-MM-DD").format("YYYY-MM-DD")) {
          info.y += (order.subtotal)
        }
      })
    })
    return rangedList
  }
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  useEffect(() => {
    getSellerDashboardData({
      fromDate: moment(fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      toDate: moment(toDate, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD")
    })
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!dashboardLoading) {
      const dashboardOrders = createChartData(dashboardData.orders, ((toDate-fromDate)/1000/60/60/24))
      renderRevenueGraph({deliveryOrders:dashboardOrders})

      $('.count').each(function () {
        $(this).prop('Counter', 0).animate({
          Counter: $(this).text()
        }, {
          duration: 1000,
          easing: 'swing',
          step: function (now) {
            $(this).text(Math.ceil(now));
          }
        });
      });
    }
  }, [dashboardData])
  
  useEffect(() => {
    if (!dashboardLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
  
      $('.dropdown-trigger').dropdown({
        coverTrigger: false,
        closeOnClick: false
      });

      $('.tabs').tabs();
  
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [dashboardLoading]);
  
  useEffect(() => {
    if (!togglingIsPublished) {
      $('.loader').fadeOut();
    } else {
      $('.loader').show();
    }
  }, [togglingIsPublished]);
  
  return (
    !dashboardLoading && (
      dashboardData !== null ? (
        <section className="section section-admin-dashboard">
          <div className="container widen">
            <div className="row">
              <div className="col flex-row middle s12">
                <a href="#" data-target="mobile-nav" className="sidenav-trigger grey-text text-darken-1 show-on-small-and-up mr-4 ml-2 pt-1">
                  <i className="material-icons">menu</i>
                </a>
                <h5 className="mt-2 mb-2 mr-4">Dashboard</h5>
                <a className='dropdown-trigger btn grey grey-text lighten-2 text-darken-1 relative pr-5 flex-row middle' data-target='daterange'>
                  <span className="truncate">{shortcutDate ? parseDateValue(shortcutDate) : `${moment(fromDate).format('ll')} - ${moment(toDate).format('ll')}`}</span>
                  <i className="material-icons">expand_more</i>
                </a>
                <ul id='daterange' className='dropdown-content pb-2 daterange'>
                  <li className="pl-1 pr-1 mb-2">
                    <p className="fw-5 mb-0">Shortcuts</p>
                    <div className="input-field m-0">
                      <select id="date_range" className="text-grey grey-text text-darken-4" value={shortcutDate} onChange={e => {shortcutDateSelected(e.target.value)}}>
                        <option value={7}>last 7 days</option>
                        <option value={30}>this month</option>
                        <option value={367}>this year</option>
                      </select>
                    </div>
                  </li>
                  <li className="divider" tabIndex="-1"></li>
                  <li className="pl-1 pr-1">
                    <p className="fw-5 mb-0">From</p>
                    <DatePicker selected={fromDate} onChange={date => fromDateSelected(date)}/>
                  </li>
                  <li className="pl-1 pr-1">
                    <p className="fw-5 mb-0">To</p>
                    <DatePicker selected={toDate} onChange={date => toDateSelected(date)}/>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col s12 m6 l6">
                <div className="card-panel grey lighten-3 rad-3 no-shadow relative">
                  <h5 className="m-0 mb-1 fw-6">Sales</h5>
                  <p className="m-0 fs-22">₱ <span className="count">{dashboardData.sales_total}</span></p>
                  <div className="side-icon flex-col center">
                    <i className="material-icons green-text text-lighten-2 fs-50">bar_chart</i>
                    <p className="green-text text-lighten-2 fs-15">16%</p>
                  </div>
                </div>
              </div>
              <div className="col s12 m6 l6">
                <div className="card-panel grey lighten-3 rad-3 no-shadow relative">
                  <h5 className="m-0 mb-1 fw-6">Sold</h5>
                  <p className="m-0 fs-22"><span className="count">{dashboardData.sold}</span></p>
                  <div className="side-icon flex-col center">
                    <i className="material-icons green-text text-lighten-2 fs-50">bar_chart</i>
                    <p className="green-text text-lighten-2 fs-15">16%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <div className="card-panel white rad-3 no-shadow admin-dashboard">
                  <div className="row m-0 mb-2">
                    <h5 className="m-0 fw-6">Daily Revenue</h5>
                  </div>
                  <div id="revenue_chart_container" style={{ height: "370px", width:"100%"}}></div>
                </div>
              </div>
            </div>
                
            <div className="row">
              <div className="col s12">
                <ul className="tabs">
                  <li className="tab col s6">
                    <a href="#seller-products" className="green-text text-darken-3">My Products</a>
                  </li>
                  <li className="tab col s6">
                    <a href="#recent-orders" className="green-text text-darken-3">Recent Orders</a>
                  </li>
                </ul>
              </div>

              <div id="seller-products" className="col s12">
                <div className="card-panel white no-shadow height-530 mt-0">
                  <h5 className="m-0 mb-3 fs-18">{ dashboardData.seller.name }</h5>
                  <div className="row m-0 overflow-scroll height-438">
                    <table className="bordered highlight">
                      <thead>
                        <tr className="grey lighten-3">
                          <th>Name</th>
                          <th>Price</th>
                          <th>Total Orders</th>
                          <th>Published</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.products.map(product => (
                          <tr key={product.id} className="collection-item avatar pr-5 relative mt-3">
                            <td className="title flex-row valign-wrapper">
                              <div className="grey lighten-2 circle bg-cover mr-2" style={{ backgroundImage: `url(${product.thumbnail ? product.thumbnail : '/static/frontend/img/no-image.jpg'})`, height: "50px", width: "50px"}}></div>
                              {product.name}
                            </td>
                            <td className="title mw-medium">₱ {(product.final_price).toFixed(2)}</td>
                            <td className="title">{(product.total_orders)}</td>
                            <td className="mw-small manager-checklist flex-col middle center pr-2">
                              <div className="checklist-item flex-col middle center">
                                <input id={`${product.id}`} type="checkbox" className="check" name={`${product.id}`} value={product.id} checked={product.is_published ? true : false} onChange={() => toggleIsPublished({id:product.id})}/>
                                <label className="btn-check text-center" htmlFor={`${product.id}`}><i className="fas fa-check"></i></label>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div id="recent-orders" className="col s12">
                <div className="card-panel white no-shadow height-530 mt-0 overflow-scroll">
                  <h5 className="m-0 mb-3">Recent Orders</h5>
                  <table className="bordered highlight">
                      <thead>
                        <tr className="grey lighten-3">
                          <th>Ref Code</th>
                          <th>Order Total</th>
                          <th>Items</th>
                          <th>Subtotal</th>
                          <th>Shipping</th>
                          <th>Date Ordered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recent_orders.length > 0 ? (
                          dashboardData.recent_orders.map(order => (
                            <tr key={order.id}>
                              <td className="mw-small fw-6">{order.ref_code}</td>
                              <td className="mw-medium"><p className="m-0 fw-6">₱ {(order.total-order.ordered_commission).toFixed(2)}</p></td>
                              <td className="mw-medium">{order.count} items</td>
                              <td className="mw-medium">₱ {order.subtotal.toFixed(2)}</td>
                              <td className="mw-medium">₱ {order.ordered_shipping.toFixed(2)}</td>
                              <td className="mw-medium">{moment(order.date_ordered).format('lll')}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" className="grey-text center fs-20 pt-5 pb-5 full-height uppercase">No recent orders</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  {/* <ul className="collection with-header top-brands no-shadow">
                    {dashboardData.recent_orders.map(order => (
                      <li key={order.id} className="collection-item avatar no-shadow">
                        <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${order.thumbnail})` }}></div>
                        <span className="title">{order.name}</span>
                        <p className="fw-4">{order.quantity} x ₱ {order.ordered_price.toFixed(2)}</p>
                        <p className="title">₱ {(order.quantity*order.ordered_price).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>
            </div>
            {/* <div id="ordermodal" className="modal modal-fixed-footer supermodal">
              {orderLoading ? (
                <div className="flex-col full-height middle center relative preloader-wrapper pb-5">
                  <Preloader color="green" size="big" adds="visible"/>
                </div>
              ) : (
                <Fragment>
                  <div className="modal-content">
                    <h5 className="mt-0 mb-2">Order Summary <small>({order.ref_code})</small></h5>
                    <ul className="collection transparent no-shadow">
                      {order.order_items.map(orderItem => (
                        <li key={orderItem.id} className="collection-item avatar transparent">
                          <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product_variant.thumbnail})` }}></div>
                          <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                          <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</p>
                          <p className="title">₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="fs-16 m-0 ml-2">Subtotal: <span className="fw-4 fs-16 ml-2">₱ {order.subtotal.toFixed(2)}</span></p>
                    <p className="fs-16 m-0 ml-2">Delivery: <span className="fw-4 fs-16 ml-2">₱ {order.shipping.toFixed(2)}</span></p>
                    <p className="fw-6 fs-22 m-0 ml-2">Total: <span className="fw-4 fs-18 ml-2">₱ {(order.subtotal+order.shipping).toFixed(2)}</span></p>
                  </div>
                </Fragment>
              )}
              <div className="modal-footer">
                <a className="modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
              </div>
            </div> */}
          </div>
        </section>
      ) : (
        <Redirect to="/"/>
      )
        
    )
  )
}

SellerDashboard.propTypes = {
  renderRevenueGraph: PropTypes.func.isRequired,
  renderSalesPieChart: PropTypes.func.isRequired,
  getSellerDashboardData: PropTypes.func.isRequired,
  toggleIsPublished: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  manager: state.manager,
});

export default connect(mapStateToProps, { renderRevenueGraph, renderSalesPieChart, getSellerDashboardData, toggleIsPublished })(SellerDashboard);