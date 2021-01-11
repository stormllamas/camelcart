import {
  CATEGORIES_LOADING, GET_CATEGORIES,
  CATEGORIES_ERROR,

  CURRENT_ORDER_LOADING, GET_CURRENT_ORDER,
  CURRENT_ORDER_ERROR,

  ORDERS_LOADING, MORE_ORDERS_LOADING,
  GET_ORDERS, ORDERS_ERROR,
  GET_MORE_ORDERS, SET_ORDERS_PAGE,
  FILTER_CURRENT_ONLY,

  ORDER_LOADING,
  GET_ORDER,
  ORDER_ERROR,
  REVIEW_ORDER,

  ORDER_ITEM_LOADING, GET_ORDER_ITEM,
  ORDER_ITEM_ERROR,
  REVIEW_PRODUCT,
  REVIEW_PRODUCT_ORDER,

  FILTER_KEYWORDS, CLEAR_KEYWORDS,
  FILTER_CUISINE, CLEAR_CUISINE,
  FILTER_COURSE,
  
  ALL_SELLERS_LOADING, GET_ALL_SELLERS, ALL_SELLERS_ERROR,
  SELLERS_LOADING, MORE_SELLERS_LOADING,
  GET_SELLERS, GET_MORE_SELLERS, SET_SELLERS_PAGE,
  SELLERS_ERROR,

  SELLER_LOADING,
  GET_SELLER,
  SELLER_ERROR,

  PRODUCTS_LOADING, MORE_PRODUCTS_LOADING,
  GET_PRODUCTS, GET_MORE_PRODUCTS, SET_PRODUCTS_PAGE,
  PRODUCTS_ERROR,

  PRODUCT_LOADING,
  GET_PRODUCT,
  PRODUCT_ERROR,
  
  DELETE_LOADING,
  DELETE_ORDER_ITEM,
  DELETE_ERROR,

  CHECKOUT_LOADING,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILED,

  COMPLETE_ORDER_LOADING,
  COMPLETE_ORDER_SUCCESS,
  COMPLETE_ORDER_FAILED,

  QUANTITY_LOADING,
  QUANTITY_CHANGED,
  QUANTITY_CHANGE_ERROR,

  CANCEL_ORDER,

  SYNC_ORDER,

} from '../actions/types'

const initialState = {
  categoriesLoading: true,
  categories: [],

  currentOrderLoading: true,
  currentOrder: null,

  keywordsFilter: '',
  cuisineFilter: '',
  courseFilter: '',

  allSellers: [],
  allSellersLoading: true,

  sellersLoading: true,
  moreSellersLoading: false,
  sellers: {results:[]},
  sellersCurrentPage: 1,

  productsLoading: true,
  moreProductsLoading: false,
  products: {results:[]},
  productsCurrentPage: 1,

  ordersLoading: true,
  moreOrdersLoading: false,
  orders: {results:[]},
  ordersCurrentPage: 1,
  currentOnly: true,

  orderLoading: true,
  order: null,
  
  orderItemLoading: true,
  orderItem: null,

  quantityLoading: false,
  deleteLoading: false,

  sellerLoading: true,
  seller: null,

  productLoading: true,
  product: null,

  completeOrderLoading: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case CATEGORIES_LOADING:
      return {
        ...state,
        categoriesLoading: true,
      }

    case GET_CATEGORIES:
      return {
        ...state,
        categoriesLoading: false,
        categories: action.payload
      }

    case CATEGORIES_ERROR:
      return {
        ...state,
        categoriesLoading: false,
        categories: null
      }
    
    case CURRENT_ORDER_LOADING:
      return {
        ...state,
        currentOrderLoading: true,
      }

    case GET_CURRENT_ORDER:
      return {
        ...state,
        currentOrderLoading: false,
        currentOrder: action.payload
      }

    case CURRENT_ORDER_ERROR:
      return {
        ...state,
        currentOrderLoading: false,
        currentOrder: null
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

    case REVIEW_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          is_reviewed: true,
          review: {
            id: action.payload.data.id,
            rating: action.payload.data.rating,
            comment: action.payload.data.comment
          }
        }
      }

    case ORDER_ITEM_LOADING:
      return {
        ...state,
        orderItemLoading: true,
      }

    case GET_ORDER_ITEM:
      return {
        ...state,
        orderItemLoading: false,
        orderItem: action.payload
      }

    case ORDER_ITEM_ERROR:
      return {
        ...state,
        orderItemLoading: false,
        orderItem: null
      }

    case REVIEW_PRODUCT:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          is_reviewed: true,
          review: {
            id: action.payload.data.id,
            rating: action.payload.data.rating,
            comment: action.payload.data.comment
          }
        }
      }

    case REVIEW_PRODUCT_ORDER:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          order: {
            ...state.orderItem.order,
            is_reviewed: true,
            review: {
              id: action.payload.data.id,
              rating: action.payload.data.rating,
              comment: action.payload.data.comment
            }
          }
        }
      }

    case FILTER_KEYWORDS:
      return {
        ...state,
        keywordsFilter: action.payload,
      }
    case CLEAR_KEYWORDS:
      return {
        ...state,
        keywordsFilter: '',
      }
    case FILTER_CUISINE:
      return {
        ...state,
        cuisineFilter: action.payload !== state.cuisineFilter ? action.payload : null,
        sellersCurrentPage: 1
      }
    case CLEAR_CUISINE:
      return {
        ...state,
        cuisineFilter: null,
      }

    case FILTER_COURSE:
      return {
        ...state,
        courseFilter: action.payload,
      }

    case SELLERS_LOADING:
      return {
        ...state,
        sellersLoading: true,
      }

    case MORE_SELLERS_LOADING:
      return {
        ...state,
        moreSellersLoading: true,
      }

      
    case ALL_SELLERS_LOADING:
      return {
        ...state,
        allSellersLoading: true,
      }
    case GET_ALL_SELLERS:
      return {
        ...state,
        allSellers: action.payload,
        allSellersLoading: false,
      }
    case ALL_SELLERS_ERROR:
      return {
        ...state,
        allSellersLoading: false,
      }

    case GET_SELLERS:
      return {
        ...state,
        sellersLoading: false,
        sellersCurrentPage: 1,
        sellers: action.payload
      }

    case GET_MORE_SELLERS:
      const newSellers = [...state.sellers.results, ...action.payload.results]
      action.payload.results = newSellers
      return {
        ...state,
        moreSellersLoading: false,
        sellers: action.payload
      }

    case SET_SELLERS_PAGE:
      return {
        ...state,
        sellersCurrentPage: action.payload
      }

    case SELLERS_ERROR:
      return {
        ...state,
        sellersLoading: false,
        sellers: null
      }

    case PRODUCTS_LOADING:
      return {
        ...state,
        productsLoading: true,
        productsCurrentPage: 1
      }

    case MORE_PRODUCTS_LOADING:
      return {
        ...state,
        moreProductsLoading: true,
      }

    case GET_PRODUCTS:
      return {
        ...state,
        productsLoading: false,
        products: action.payload
      }

    case GET_MORE_PRODUCTS:
      const newProducts = [...state.products.results, ...action.payload.results]
      action.payload.results = newProducts
      return {
        ...state,
        moreProductsLoading: false,
        products: action.payload
      }

    case SET_PRODUCTS_PAGE:
      return {
        ...state,
        productsCurrentPage: action.payload
      }

    case PRODUCTS_ERROR:
      return {
        ...state,
        productsLoading: false,
        products: null
      }

    case SELLER_LOADING:
      return {
        ...state,
        sellerLoading: true,
      }

    case GET_SELLER:
      return {
        ...state,
        sellerLoading: false,
        seller: action.payload
      }

    case SELLER_ERROR:
      return {
        ...state,
        sellerLoading: false,
        seller: null
      }

    case PRODUCT_LOADING:
      return {
        ...state,
        productLoading: true,
      }

    case GET_PRODUCT:
      return {
        ...state,
        productLoading: false,
        product: action.payload
      }

    case PRODUCT_ERROR:
      return {
        ...state,
        productLoading: false,
        product: null
      }

    case ORDERS_LOADING:
      return {
        ...state,
        ordersLoading: true,
        ordersCurrentPage: 1
      }

    case FILTER_CURRENT_ONLY:
      return {
        ...state,
        currentOnly: action.payload,
      }

    case MORE_ORDERS_LOADING:
      return {
        ...state,
        moreOrdersLoading: true,
      }

    case GET_ORDERS:
      return {
        ...state,
        ordersLoading: false,
        orders: action.payload
      }

    case GET_MORE_ORDERS:
      const newOrders = [...state.orders.results, ...action.payload.results]
      action.payload.results = newOrders
      return {
        ...state,
        moreOrdersLoading: false,
        orders: action.payload
      }

    case SET_ORDERS_PAGE:
      return {
        ...state,
        ordersCurrentPage: action.payload
      }

    case ORDERS_ERROR:
      return {
        ...state,
        ordersLoading: false,
        moreOrdersLoading: false,
        orders: null
      }


    case CHECKOUT_LOADING:
      return {
        ...state,
        checkoutLoading: true,
      }
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        checkoutLoading: false,
        currentOrderLoading: true
      }

    case CHECKOUT_FAILED:
      return {
        ...state,
        checkoutLoading: false,
      }

    case COMPLETE_ORDER_LOADING:
      return {
        ...state,
        completeOrderLoading: true,
      }
    case COMPLETE_ORDER_SUCCESS:
    case COMPLETE_ORDER_FAILED:
      return {
        ...state,
        completeOrderLoading: false,
        currentOrderLoading: false
      }

    case QUANTITY_LOADING:
      return {
        ...state,
        quantityLoading: true,
      }
    case QUANTITY_CHANGED:
    case QUANTITY_CHANGE_ERROR:
      return {
        ...state,
        quantityLoading: false,
      }
    

    case DELETE_LOADING:
      return {
        ...state,
        deleteLoading: true,
      }
    case DELETE_ORDER_ITEM:
    case DELETE_ERROR:
      return {
        ...state,
        deleteLoading: false,
      }

    case CANCEL_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          results: state.orders.results.map(order => {
            if (order.id === action.payload) {
              order.is_canceled = true
            }
            return order
          }),
        },
      }

    case SYNC_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          results: state.orders.results.map(order => {
            if (order.id === action.payload.order.id) {
              if (action.payload.mark === 'claim') {
                order.rider = action.payload.order.rider
                order.is_claimed = true
              }
              if (action.payload.mark === 'pickup') {
                order.is_pickedup = true
              }
              if (action.payload.mark === 'deliver') {
                order.is_delivered = true
              }
            }
            return order
          }),
        },
      }
    
    default:
      return state
  }
}