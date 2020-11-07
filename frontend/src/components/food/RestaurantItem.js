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
          <Link to={`/food/restaurant?b=${seller.name_to_url}`} className="bg-cover" style={{ backgroundImage: `url(${seller.thumbnail})`}}></Link>
        </div>
        <div className="row mt-1">
          <div className="col s9 p-0">
            <Link to={`/food/restaurant?b=${seller.name_to_url}`} className="product-title truncate m-0">{seller.name}</Link>
          </div>
          <div className="col s3 flex-col end p-0">
            <p className="m-0">Rating</p>
          </div>
          <div className="col s12 p-0">
            <p className="m-0 truncate">123 Magdiwang St. Delway, Lucena</p>
          </div>
        </div>
      </li>
    </Fragment>
  )
}

export default connect(null, { getSellers })(RestaurantItem);