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
    
  NEW_ORDER_UPDATE,
  MARK_ORDER,

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

    case GET_MANAGER_ORDERS:
      return {
        ...state,
        ordersLoading: false,
        orders: action.payload
      }

    case MANAGER_ORDERS_ERROR:
      return {
        ...state,
        ordersLoading: false,
        orders: null
      }

    case MANAGER_ORDER_LOADING:
      return {
        ...state,
        orderLoading: true,
      }

    case GET_MANAGER_ORDER:
      return {
        ...state,
        orderLoading: false,
        order: action.payload
      }

    case MANAGER_ORDER_ERROR:
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

    case PICKUP_ORDER_ITEM:
      return {
        ...state,
        order: {
          ...state.order,
          order_items: state.order.order_items.map(orderItem => {
            if (orderItem.id === action.payload) {
              orderItem.is_pickedup = true
            }
            return orderItem
          }),
        }
      }

    case DELIVER_ORDER_ITEM:
      return {
        ...state,
        order: {
          ...state.order,
          order_items: state.order.order_items.map(orderItem => {
            if (orderItem.id === action.payload) {
              orderItem.is_delivered = true
            }
            return orderItem
          }),
        }
      }

    case TOGGLING_IS_PUBLISHED:
      return {
        ...state,
        togglingIsPublished: true
      }

    case TOGGLED_IS_PUBLISHED:
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

    case NEW_ORDER_UPDATE:
      return {
        ...state,
        orders: {
          ...state.orders,
          count: state.count += 1,
          results: [
            action.payload.order,
            ...state.orders.results
          ]
        }
      }
    
    case MARK_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          count: state.count -= 1,
          results: state.orders.results.filter(order => order.id !== action.payload.order.id)
        }
      }
    
    default:
      return state
  }
}