import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom"; 
import "./sideBar.css";
import Filters from './filters';
import { useLocation } from 'react-router-dom';


function SideBar() {
  const [activeLink, setActiveLink] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const isAdminPanel = location.pathname.includes("/AdminPanel");
  const isMyListings = location.pathname.includes("/MyListings"); 

  useEffect(() => {
    fetch(process.env.REACT_APP_APIURL + "/categories/sections")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_APIURL + "/categories/sections/subcategories")
      .then((response) => response.json())
      .then((data) => {
        setSubCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const checkSubCategory = (category) => {
    return subCategories.some(subCategory => subCategory.category_id === category.category_id);
  };

  const refreshPage = () => {
    window.location.reload();
  }

  return (
    <div className="container d-flex justify-content-center side-bar">
      <ul className="list-unstyled">
      { !isAdminPanel && !isMyListings ? (
        <div className="categories-container-title">
          Categories
        </div>
      ) : (<></>)}
        <div className="categories-container">
        { isAdminPanel ? (
          <>
          <Link
            className={`btn align-items-center category ${activeLink === '/AdminPanel/ReportedAds' ? 'active-link' : ''}`}
            to="/AdminPanel/ReportedAds" onClick={() => setActiveLink('/AdminPanel/ReportedAds')}>
              Reported Ads
          </Link>
          <Link
            className={`btn align-items-center category ${activeLink === '/AdminPanel/ReportedUsers' ? 'active-link' : ''}`}
            to="/AdminPanel/ReportedUsers" onClick={() => setActiveLink('/AdminPanel/ReportedUsers')}>
              Reported Users
          </Link>
          <Link
            className={`btn align-items-center category ${activeLink === '/AdminPanel/ManageUsers' ? 'active-link' : ''}`}
            to="/AdminPanel/ManageUsers" onClick={() => setActiveLink('/AdminPanel/ManageUsers')}>
              Manage Users
          </Link>
          </>
        ) : ( isMyListings ? (
          <>
          <Link
            className={`btn align-items-center category ${activeLink === '/MyListings' ? 'active-link' : ''}`}
              to="/MyListings" onClick={() => setActiveLink('/MyListings')}>
              My Listings
          </Link>
          <Link
            className={`btn align-items-center category ${activeLink === '/MyListings' ? 'active-link' : ''}`}
            to="/MyAccount">
              Account Settings
          </Link>
          </>
        ) : (
          <>
          {categories.map((category, index) => (
          <li key={index}>
            {checkSubCategory(category) ? (
                 <React.Fragment>
                 <button className="collapsible-button" onClick={toggleCollapse}>
                   {category.category_name}
                 </button>
                 {subCategories
                   .filter(subCategory => subCategory.category_id === category.category_id)
                   .map((subCategory, subIndex) => (
                     <div className={`collapsible-content d-${isCollapsed ? 'none' : 'block'}`} key={subIndex} onClick={refreshPage}>
                      <Link
                        className="btn align-items-center subcategory"
                        to={{search: `?searchQuery=${subCategory.subcategory_name}`}}>
                        <span> {'>'} </span>{subCategory.subcategory_name}
                      </Link>
                     </div>
                   ))}
               </React.Fragment>
            ) : (
              <Link
                className="btn align-items-center category"
                to={{
                  search: `selectedCategory=${category.category_id}&categoryName=${category.category_name}`,
                }}>
               {category.category_name}
              </Link>
              )}
            </li>
            ))}
          </>
        ))}  
        </div>
        { !isAdminPanel && !isMyListings ? (<Filters />) : (<></>)} 
      </ul>
    </div>
  );
}

export default SideBar;
