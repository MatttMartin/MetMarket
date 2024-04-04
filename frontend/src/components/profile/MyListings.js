import React from 'react';
import AdContainer from '../ads/adContainer';
import Sidebar from '../sidebar/sideBar';
import classes from "./MyListings.module.css"
const MyListings = () => {
  return (
    <div className={classes.listingsContainer}>
        <div className="col-sm-12 col-md-12 ad-container">
            <AdContainer />
        </div>
    </div>
  );
}

export default MyListings;
