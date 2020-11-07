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
            <Link to={`/food/restaurant/product?item=${product.name_to_url}`} style={{ backgroundImage: `url(${product.thumbnail})`}} className="bg-cover blocks-image grey lighten-3"></Link>
          </div>
          <div className="card-content grey lighten-3 p-5">
            <p className="no-white-space">
              <span className="badge orange-text">{product.first_variant_price ? `₱ ${product.first_variant_price}` : ''}</span>
              {product.name}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

RestaurantDetailItem.propTypes = {
  getProducts: PropTypes.func.isRequired,
}


export default connect(null, { getProducts })(RestaurantDetailItem);