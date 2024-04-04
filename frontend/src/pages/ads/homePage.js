import React from 'react';
import Sidebar from '../../components/sidebar/sideBar.js';
import AdContainer from '../../components/ads/adContainer.js';
import './homePage.css';

function HomePage() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 sidebar">
            <Sidebar />
        </div>
        <div className="col-sm-12 col-md-10 ad-container">
            <AdContainer />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
