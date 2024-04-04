import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './filters.css';

function Filters() {
  const [isSortByCollapsed, setIsSortByCollapsed] = useState(true);
  const [isPriceCollapsed, setIsPriceCollapsed] = useState(true);
  const [isLocationCollapsed, setIsLocationCollapsed] = useState(true);
  const [selectedSortBy, setSelectedSortBy] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSortByToggle = () => {
    setIsSortByCollapsed(!isSortByCollapsed);
  };

  const handlePriceToggle = () => {
    setIsPriceCollapsed(!isPriceCollapsed);
  };

  const handleLocationToggle = () => {
    setIsLocationCollapsed(!isLocationCollapsed);
  };

  const applyFilter = (e) => {
    e.preventDefault();
    console.log(location.pathname);
    try {
      window.location.href =`${window.location.href}&filters?${selectedLocation ? `&location=${selectedLocation}` : ""}${selectedPriceRange ? `&priceRange=${selectedPriceRange}` : ""}${selectedSortBy ? `&sortby=${selectedSortBy}` : ""}`;
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  return (
    <div className="collapsible-container">
      <p className="filters-heading">Filters <button className="filter-submit" onClick={applyFilter}>Apply</button></p>
      <div className="filters-container">
      <div className="filter-sortby">
        <button className="collapsible-button-filter" onClick={handleSortByToggle}>
          Sort by
        </button>
        <div className={`collapsible-content d-${isSortByCollapsed ? 'none' : 'block'}`}>
          <div className="form-check">
            <div>
              <input className="form-check-input" type="radio" name="sortBy" id="sortby-lowest-first" value="priceASC"  onChange={(e) => setSelectedSortBy(e.target.value) }  />
              <label className="form-check-label">
                Price: lowest first
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="sortBy" id="sortby-highest-first" value="priceDESC"  onChange={(e) => setSelectedSortBy(e.target.value)}/> 
              <label className="form-check-label">
                Price: highest first
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="sortBy" id="sortby-ascending" value="alphaASC"  onChange={(e) => setSelectedSortBy(e.target.value)}/> 
              <label className="form-check-label">
                Order: A-Z
              </label>
            </div>
            <div> 
              <input className="form-check-input" type="radio" name="sortBy" id="sortby-descending" value="alphaDESC"  onChange={(e) => setSelectedSortBy(e.target.value)}/> 
              <label className="form-check-label">
                Order: Z-A
              </label>
            </div>
        </div>
      </div>
      </div>
      <div className="filter-price">
        <button className="collapsible-button-filter" onClick={handlePriceToggle}>
          Price
        </button>
        <div className={`collapsible-content d-${isPriceCollapsed ? 'none' : 'block'}`}>
          <div className="form-check">
            <div>
              <input className="form-check-input" type="radio" name="price" id="price-under25" value="under25"  onChange={(e) => setSelectedPriceRange(e.target.value)} />
              <label className="form-check-label">
                Under $25
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="price" id="price-25to50" value="25to50"  onChange={(e) => setSelectedPriceRange(e.target.value)} /> 
              <label className="form-check-label">
                $25 to $50
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="price" id="price-50to100" value="50to100"  onChange={(e) => setSelectedPriceRange(e.target.value)} /> 
              <label className="form-check-label">
                $50 to $100
              </label>
            </div>
            <div>
            <input className="form-check-input" type="radio" name="price" id="price-100to200" value="100to200"  onChange={(e) => setSelectedPriceRange(e.target.value)} /> 
            <label className="form-check-label">
              $100 to $200
            </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="price" id="price-above200" value="over200"  onChange={(e) => setSelectedPriceRange(e.target.value)} /> 
              <label className="form-check-label">
                $200 & Above
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="filter-location">
        <button className="collapsible-button-filter" onClick={handleLocationToggle}>
          Location
        </button>
        <div className={`collapsible-content d-${isLocationCollapsed ? 'none' : 'block'}`}>
          <div className="form-check">
            <div>
              <input className="form-check-input" type="radio" name="location" id="meet-on-campus" value="0"  onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Meet on Campus
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="toronto" value="1" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Toronto
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="montreal" value="2" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Montreal
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="halifax" value="3" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Halifax
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="moncton" value="4" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Moncton
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="winnipeg" value="5" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Winnipeg
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="ottawa" value="6" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Ottawa
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="hamilton" value="7" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Hamilton
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="guelph" value="8" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Guelph
              </label>
            </div>
            <div>
              <input className="form-check-input" type="radio" name="location" id="custom-location" value="custom-location" onChange={(e) => setSelectedLocation(e.target.value)}/> 
              <label className="form-check-label">
                Custom/TBD
              </label>
            </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Filters;
