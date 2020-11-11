import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import RestaurantItem from '../food/RestaurantItem'
import Preloader from '../../components/common/Preloader'

import { getSellers, getCategories, setCuisine, clearCuisine } from '../../actions/logistics'


const Restaurants = ({
  logistics: {
    categoriesLoading, categories,
    cuisineFilter,
    sellersLoading, moreSellersLoading,
    sellers
  },
  getSellers, getCategories,
  setCuisine, clearCuisine
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const setQuery = (query, filter, set) => {
    query.split('--').forEach(q => {
      filter !== q && set({ cuisine: q.replaceAll('-', ' '), history })
    })
  }

  const activeCuisine = c => {
    let active = false
    const cuisineQuery = query.get('cuisine')
    if (cuisineQuery) {
      cuisineQuery.split('--').forEach(q => {
        c === q.replaceAll('-', ' ') && (active = true)
      })
    }
    return active
  }
  
  useEffect(() => {
    getCategories({
      categoryQueries: [
        'Cuisine'
      ]
    })
    const cuisineQuery = query.get('cuisine')
    if (cuisineQuery) {
      setQuery(cuisineQuery, cuisineFilter, setCuisine)
    } else {
      clearCuisine();
    }
  }, []);
  
  useEffect(() => {
    if (!sellersLoading, !categoriesLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [sellersLoading, categoriesLoading]);
  
  useEffect(() => {
    getSellers({
      getMore: false,
    })
  }, [cuisineFilter]);
  
  return (
    <Fragment>
      <section className="section section-cuisines list-slider">
        <div className="container">
          <h5 className="mb-4">Food Categories</h5>
          <div className="flex-row">
            {!categoriesLoading ? (
              categories.map(category => (
                <div key={category.id} className={`flex-col center mb-2 waves-effect waves-grey rad-2 ${activeCuisine(category.name) && 'green'}`} onClick={() => setCuisine({ cuisine: category.name, history })}>
                  <div to="/" className="list-img circle bg-cover grey" style={{ backgroundImage: `url(${category.thumbnail})` }}></div>
                  <div to="/" className={`grey-text mt-1`}>{category.name}</div>
                </div>
              ))
            ) : undefined}
          </div>
        </div>
      </section>

      <section className="section section-restaurants">
        <div className="container">
          <h5 className="mb-4">All Restaurants</h5>
          <ul className="flex">
            {!sellersLoading ? (
              sellers.results.map((seller, index) => (
                <RestaurantItem key={seller.id} seller={seller} sellers={sellers} index={index} sellersLoading={sellersLoading} />
              ))
            ) : undefined}
          </ul>
          {moreSellersLoading || sellersLoading ? (
            <div className="flex-col center relative preloader-wrapper">
              <Preloader color="green" size="small" adds=""/>
            </div>
          ) : undefined}
        </div>
      </section>
    </Fragment>
  )
}

Restaurants.propTypes = {
  getSellers: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  setCuisine: PropTypes.func.isRequired,
  clearCuisine: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getSellers, getCategories, setCuisine, clearCuisine })(Restaurants);