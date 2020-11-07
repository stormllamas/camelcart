import React from 'react'
import { connect } from 'react-redux'

const Preloader = ({ color, size, adds }) => {
  return (
    <div className={`loader ${adds} preloader-wrapper ${size} active`}>
      <div className={`spinner-layer spinner-${color}-only`}>
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  )
}

export default connect()(Preloader);