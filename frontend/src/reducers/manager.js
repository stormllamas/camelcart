import {
  DASHBOARD_LOADING,
  GET_DASHBOARD_DATA,
  DASHBOARD_DATA_ERROR,

  GET_ORDER_ITEMS,
  ORDER_ITEMS_ERROR,

  GET_ORDERS,
  ORDERS_ERROR,

  ORDER_LOADING,
  GET_ORDER,
  ORDER_ERROR,

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
} from '../actions/types'

const initialState = {
  dashboardLoading: true,
  dashboardData: null,
  ordersLoading: true,
  orders: null,
  orderLoading: true,
  order: null,

  togglingIsPublished: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case DASHBOARD_LOADING:
      return {
        ...state,
        dashboardLoading: true,
      }

    case GET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardLoading: false,
        dashboardData: action.payload
      }

    case DASHBOARD_DATA_ERROR:
      return {
        ...state,
        dashboardLoading: false,
        dashboardData: null
      }

    case GET_ORDER_ITEMS:
      return {
        ...state,
        orderItemsLoading: false,
        orderItems: action.payload
      }

    case ORDER_ITEMS_ERROR:
      return {
        ...state,
        orderItemsLoading: false,
        orderItems: null
      }

    case GET_ORDERS:
      return {
        ...state,
        ordersLoading: false,
        orders: action.payload
      }

    case ORDERS_ERROR:
      return {
        ...state,
        ordersLoading: false,
        orders: null
      }

    case ORDER_LOADING:
      return {
        ...state,
        orderLoading: true,
      }

    case GET_ORDER:
      return {
        ...state,
        orderLoading: false,
        order: action.payload
      }

    case ORDER_ERROR:
      return {
        ...state,
        orderLoading: false,
        order: null
      }

    case CLAIM_ORDER:
    case RIDER_CANCEL_ORDER:
    case RIDER_UNCLAIM_ORDER:
    case PREPARE_ORDER:
    case DELIVER_ORDER:
    case PICKUP_ORDER:
      return {
        ...state,
        orders: {
          count: state.orders.count,
          results: state.orders.results.filter(order => order.id != action.payload.id)
        }
      }

    // case PICKUP_ORDER_ITEM:
    //   const newPickedupItems = state.order.order_items.map(orderItem => {
    //     if (orderItem.id === action.payload.id) {
    //       orderItem.is_delivered = true
    //     }
    //     return orderItem
    //   })
    //   return {
    //     ...state,
    //     order: {
    //       ...state.order,
    //       order_items: newPickedupItems,
    //     }
    //   }

    case DELIVER_ORDER_ITEM:
      const newOrderItems = state.order.order_items.map(orderItem => {
        if (orderItem.id === action.payload.id) {
          orderItem.is_delivered = true
        }
        return orderItem
      })
      return {
        ...state,
        order: {
          ...state.order,
          order_items: newOrderItems,
        }
      }

    case TOGGLING_IS_PUBLISHED:
      return {
        ...state,
        togglingIsPublished: true
      }

    case TOGGLED_IS_PUBLISHED:
      // const newOrderItems = state.order.order_items.map(orderItem => {
      //   if (orderItem.id === action.payload.id) {
      //     orderItem.is_delivered = true
      //   }
      //   return orderItem
      // })
      return {
        ...state,
        togglingIsPublished: false,
        dashboardData: {
          ...state.dashboardData,
          products: state.dashboardData.products.map(product => {
            if (product.id === action.payload) {
              product.is_published = !product.is_published
            }
            return product
          })
        }
      }

    case IS_PUBLISHED_ERROR:
      return {
        ...state,
        togglingIsPublished: false,
      }
    
    default:
      return state
  }
}