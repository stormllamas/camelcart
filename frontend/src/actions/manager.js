import moment from 'moment'
import axios from 'axios';

import {
  DASHBOARD_LOADING,
  GET_DASHBOARD_DATA,
  DASHBOARD_DATA_ERROR,

  GET_ORDER_ITEMS,
  ORDER_ITEMS_ERROR,

  GET_MANAGER_ORDERS,
  MANAGER_ORDERS_ERROR,

  MANAGER_ORDER_LOADING,
  GET_MANAGER_ORDER,
  MANAGER_ORDER_ERROR,

  CLAIM_ORDER,
  RIDER_CANCEL_ORDER,
  RIDER_UNCLAIM_ORDER,
  PREPARE_ORDER,

  DELIVER_ORDER_ITEM,
  DELIVER_ORDER,

  PICKUP_ORDER_ITEM,
  PICKUP_ORDER,

  TOGGLING_IS_PUBLISHED,
  TOGGLED_IS_PUBLISHED,
  IS_PUBLISHED_ERROR,

  AUTH_ERROR
} from './types'


import { tokenConfig } from './auth';
import { getCurrentOrder } from './logistics';

export const renderRevenueGraph = data => (dispatch, getState) => {
  var chart = new CanvasJS.Chart("revenue_chart_container", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: ""
    },
    axisX:{
      valueFormatString: "DD MMM",
      crosshair: {
        enabled: true,
        snapToDataPoint: true
      }
    },
    axisY: {
      title: "Amount in Peso",
      includeZero: true,
      crosshair: {
        enabled: true
      }
    },
    toolTip:{
      shared:true
    },  
    legend:{
      cursor:"pointer",
      verticalAlign: "bottom",
      horizontalAlign: "left",
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries
    },
    data: [
      {
        type: "line",
        showInLegend: true,
        name: "Food",
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#FFC442",
        dataPoints: data.foodOrders
      },
      {
        type: "line",
        showInLegend: true,
        name: "Delivery",
        lineDashType: "dash",
        xValueFormatString: "DD MMM, YYYY",
        color: "#3DD598",
        dataPoints: data.deliveryOrders
      }
    ]
  });
  chart.render();
  
  function toogleDataSeries(e){
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else{
      e.dataSeries.visible = true;
    }
    chart.render();
  }
}
export const renderSalesPieChart = data => (dispatch, getState) => {
  var chart = new CanvasJS.Chart("sales_chart_container", {
    animationEnabled: true,
    title:{
      text: "",
      horizontalAlign: "left",
    },
    legend:{
      cursor: "pointer",
      fontFamily: "Bahnschrift"
      // itemclick: explodePie
    },
    data: [{
      type: "doughnut",
      showInLegend: true,
      startAngle: 60,
      innerRadius: 80,
      indexLabelFontSize: 17,
      indexLabel: "{label} - #percent%",
      indexLabel: "",
      toolTipContent: "<b>{label}:</b> {y} (#percent%)",
      dataPoints: [
        { y: data.food_count, label: "Food", color: '#FFC442', legendText: "Food" },
        { y: 0, label: "Ride Hail", color: "#0063FF", legendText: "Ride Hail" },
        { y: data.delivery_count, label: "Delivery", color: '#3DD598', legendText: "Delivery" },
      ]
    }]
  });
  chart.render();
}

export const getDashboardData = ({ fromDate, toDate }) => async (dispatch, getState) => {
  // dispatch({ type: DASHBOARD_LOADING })
  try {
    const res = await axios.get(`/api/manager/dashboard_data?from_date=${fromDate}&to_date=${toDate}`, tokenConfig(getState))
    dispatch({
      type: GET_DASHBOARD_DATA,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: DASHBOARD_DATA_ERROR});
  }
}

export const getSellerDashboardData = ({ fromDate, toDate }) => async (dispatch, getState) => {
  // dispatch({ type: DASHBOARD_LOADING })
  try {
    const res = await axios.get(`/api/manager/seller_dashboard_data?from_date=${fromDate}&to_date=${toDate}`, tokenConfig(getState))
    dispatch({
      type: GET_DASHBOARD_DATA,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: DASHBOARD_DATA_ERROR});
  }
}

export const getOrders = ({ page, claimed, prepared, pickedup, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`/api/manager/orders?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`/api/manager/orders?page=${page ? page : '0'}${claimed !== undefined ? `&claimed=${claimed}` : ''}${prepared !== undefined ? `&prepared=${prepared}` : ''}${pickedup !== undefined ? `&pickedup=${pickedup}` : ''}${delivered !== undefined ? `&delivered=${delivered}` : ''}${keywords !== undefined ? `&keywords=${keywords}` : ''}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_MANAGER_ORDERS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: MANAGER_ORDERS_ERROR});
    dispatch({type: AUTH_ERROR});
    $('.loader').fadeOut();
  }
}
export const getOrder = ({ id }) => async (dispatch, getState) => {
  dispatch({type: MANAGER_ORDER_LOADING});
  try {
    const res = await axios.get(`/api/manager/order/${id}/`, tokenConfig(getState))
    dispatch({
      type: GET_MANAGER_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    dispatch({type: MANAGER_ORDER_ERROR});
  }
}

export const toggleIsPublished = ({ id }) => async (dispatch, getState) => {
  dispatch({ type: TOGGLING_IS_PUBLISHED });
  try {
    await axios.put(`/api/manager/toggle_is_published/${id}/`, null, tokenConfig(getState))
    dispatch({
      type: TOGGLED_IS_PUBLISHED,
      payload: id
    });
  } catch (err) {
    dispatch({ type: IS_PUBLISHED_ERROR });
  }
}

export const claimOrder = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`/api/manager/claim_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already claimed') {
        await dispatch(getOrders({
          page: 1,
          claimed: false,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: CLAIM_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Orders Claimed',
        displayLength: 5000,
        classes: 'orange'
      });
      socket.send(JSON.stringify({
        'mark' : 'claim',
        'order_id' : id,
      }))
    }
    $('.loader').fadeOut();
  } catch (err) {
    await dispatch(getOrders({
      page: 1,
      claimed: false,
      delivered: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const prepareOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`/api/manager/prepare_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already prepared') {
        await dispatch(getOrders({
          page: 1,
          prepared: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: PREPARE_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order Prepared',
        displayLength: 5000,
        classes: 'orange'
      });
    }
    $('.loader').fadeOut();
  } catch (err) {
    await dispatch(getOrders({
      page: 1,
      prepared: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const cancelOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`/api/manager/cancel_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already canceled') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          pickedup: false,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: RIDER_CANCEL_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order Canceled',
        displayLength: 5000,
        classes: 'orange'
      });
    }
    $('.loader').fadeOut();
  } catch (err) {
    M.toast({
      html: 'Opps something happend. Try again.',
      displayLength: 5000,
      classes: 'red'
    });
    await dispatch(getOrders({
      page: 1,
      claimed: true,
      pickedup: false,
      delivered: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const unclaimOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`/api/manager/unclaim_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already unclaimed') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          pickedup: false,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: RIDER_UNCLAIM_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order Unclaimed',
        displayLength: 5000,
        classes: 'blue'
      });
    }
    $('.loader').fadeOut();
  } catch (err) {
    M.toast({
      html: 'Opps something happend. Try again.',
      displayLength: 5000,
      classes: 'red'
    });
    await dispatch(getOrders({
      page: 1,
      claimed: true,
      pickedup: false,
      delivered: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const pickupOrderItem = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/pickup_order_item/${id}/`, null, tokenConfig(getState))
    if (res.data.status === 'error') {
      M.toast( {
        html: res.data.msg,
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      await dispatch({
        type: PICKUP_ORDER_ITEM,
        payload: parseInt(id)
      });
      M.toast({
        html: 'Item marked as picked up',
        displayLength: 5000,
        classes: 'orange'
      });
      if (res.data.order_picked_up) {
        await dispatch({
          type: PICKUP_ORDER,
          payload: getState().manager.order
        });
        M.toast({
          html: 'Order picked up',
          displayLength: 5000,
          classes: 'blue'
        });
        socket.send(JSON.stringify({
          'mark' : 'pickup',
          'order_id' : getState().manager.order.id,
        }))
      }
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const pickupOrder = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/pickup_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already picked up') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: PICKUP_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order marked as picked up',
        displayLength: 5000,
        classes: 'blue'
      });
      socket.send(JSON.stringify({
        'mark' : 'pickup',
        'order_id' : id,
      }))
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const deliverOrderItem = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/deliver_order_item/${id}/`, null, tokenConfig(getState))
    if (res.data.status === 'error') {
      M.toast( {
        html: res.data.msg,
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      await dispatch({
        type: DELIVER_ORDER_ITEM,
        payload: id
      });
      M.toast({
        html: 'Item marked as delivered',
        displayLength: 5000,
        classes: 'orange'
      });
      if (res.data.order_delivered) {
        await dispatch({
          type: DELIVER_ORDER,
          payload: getState().manager.order
        });
        M.toast({
          html: 'Order delivered',
          displayLength: 5000,
          classes: 'blue'
        });
        socket.send(JSON.stringify({
          'mark' : 'deliver',
          'order_id' : getState().manager.order.id,
        }))
      }
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const deliverOrder = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/deliver_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already delivered') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: DELIVER_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order fulfilled',
        displayLength: 5000,
        classes: 'blue'
      });
      socket.send(JSON.stringify({
        'mark' : 'deliver',
        'order_id' : id,
      }))
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}

export const getOrderItems = ({ page, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`/api/manager/order_items?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`/api/manager/order_items?page=${page ? page : '0'}&delivered=${delivered ? delivered : 'false'}&keywords=${keywords}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_ORDER_ITEMS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: ORDER_ITEMS_ERROR});
    dispatch({type: AUTH_ERROR});
    $('.loader').fadeOut();
  }
}
export const getRefunds = ({ page, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`/api/manager/order_items?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`/api/manager/order_items?page=${page ? page : '0'}&delivered=${delivered ? delivered : 'false'}&keywords=${keywords}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_ORDER_ITEMS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: ORDER_ITEMS_ERROR});
    $('.loader').fadeOut();
  }
}