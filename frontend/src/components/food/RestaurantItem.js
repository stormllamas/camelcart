import React, { useRef, useCallback, Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import { connect } from 'react-redux';
import { getSellers } from '../../actions/logistics';

const RestaurantItem = ({ sellersLoading, seller, sellers, index, getSellers }) => {
  const observer = useRef();
  const lastProductElement = useCallback(el => {
    if (sellersLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && sellers.next !== null && !sellersLoading) {
        getSellers({
          getMore: true
        });
      }
    })
    if (el) observer.current.observe(el)
  }, [sellersLoading, sellers.next]);
  
  return (
    <Fragment>
      <li className="restaurant-item" ref={sellers.results.length === index + 1 ? lastProductElement : undefined }>
        <div className="restaurant-img">
          <Link to={`/food/restaurant?b=${seller.name_to_url}&course=Meals`} className="bg-cover" style={{ backgroundImage: `url(${seller.thumbnail})`}}></Link>
        </div>
        <div className="row mt-1">
          <div className="col s12 p-0">
            <Link to={`/food/restaurant?b=${seller.name_to_url}&course=Meals`} className="product-title truncate m-0">{seller.name}</Link>
          </div>
          {seller.review_count > 0 ? (
            <div className="col s12 flex-row p-0 ml-n1">
              <Fragment>
                {[...Array(parseInt(seller.total_rating)).keys()].map(star => <i key={star} className="material-icons yellow-text text-darken-2">star</i>)}
                {[...Array(Math.max(5-parseInt(seller.total_rating), 0)).keys()].map(star => <i key={star} className="material-icons grey-text text-lighten-2">star</i>)}
              </Fragment>
            </div>
          ) : (
            <i className="m-0 grey lighten-2 rad-1 p-1">Unrated</i>
          )}
          <div className="col s12 p-0">
            <p className="m-0 truncate">123 Magdiwang St. Delway, Lucena</p>
          </div>
        </div>
      </li>
    </Fragment>
  )
}

export default connect(null, { getSellers })(RestaurantItem);