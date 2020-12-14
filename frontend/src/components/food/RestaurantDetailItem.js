import React, { useRef, useCallback, Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { getProducts } from '../../actions/logistics';

const RestaurantDetailItem = ({ productsLoading, product, products, index, getProducts }) => {
  const observer = useRef();
  const lastProductElement = useCallback(el => {
    if (productsLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && products.next !== null && !productsLoading) {
        getProducts({
          getMore: true
        });
      }
    })
    if (el) observer.current.observe(el)
  }, [productsLoading, products.next]);
  
  return (
    <Fragment>
      <div className="col s12 m6 l4" key={product.id} ref={products.results.length === index + 1 ? lastProductElement : undefined }>
        <div className="card">
          <div className="card-image">
            <Link to={`/food/restaurant/product?item=${product.name_to_url}&b=${product.seller.name_to_url}`} style={{ backgroundImage: `url(${product.thumbnail})`}} className="bg-cover blocks-image grey lighten-3"></Link>
          </div>
          <div className="card-content grey lighten-3 p-5">
            <p className="no-white-space">
              {product.cheapest_variant.sale_price_active ? (
                <span className="badge orange-text"> <span className="sale grey-text">₱ { product.cheapest_variant.price }</span><span className="grey-text">-{ product.cheapest_variant.percent_off }%</span> {product.cheapest_variant.final_price ? `₱ ${product.cheapest_variant.final_price}` : ''}</span>
              ) : (
                <span className="badge orange-text">{product.cheapest_variant.price ? `₱ ${product.cheapest_variant.price.toFixed(2)}` : ''}</span>
              )}
              {product.name}
            </p>
          </div>
          {!product.is_published && (
            <div className="na-overlay flex-col middle center">
              <span className="grey-text text-lighten-3 fs-38">NOT AVAILABLE</span>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

RestaurantDetailItem.propTypes = {
  getProducts: PropTypes.func.isRequired,
}


export default connect(null, { getProducts })(RestaurantDetailItem);