import './Navbar.css'
import axios from 'axios';
import { ReactComponent as SearchIcon } from '../../Other/icons8-search.svg';
import React, { useState, useEffect } from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import isAdmin from '../../util/isAdmin';
import SideBar from '../sidebar/sideBar';
import isLoggedIn from '../../util/isLoggedIn';

function Navbar() {
  const [showDiv, setShowDiv] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminStatus, setIsAdminStatus] = useState(false);
  const navigate = useNavigate();

  const toggleDiv = () => {
    setShowDiv(!showDiv)
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      navigate(`/search?searchQuery=${searchQuery}`);
      window.location.reload();
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      setTimeout(() => {
    }, 1000);
      const adminStatus = await isAdmin();
      setIsAdminStatus(adminStatus); 
    };

    checkAdminStatus();
  }, [sessionStorage.getItem("token")]);

    return (
      <nav className="navbar navbar-expand-lg mb-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">MetMarket</a>
          <button className="navbar-toggler navbar-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleDiv}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              { isLoggedIn() ? (
                <>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-account" className="my-account-dropdown d-flex align-items-center border-style-none">
                  <li className="nav-item">
                    <a className="nav-link">My Account</a>
                  </li>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="my-account-dropdown-menu">
                    <Dropdown.Item href="/MyListings" className="my-account-mylistings">
                      <li className="nav-item">
                        <a className="nav-link" href="/MyListings">My Listings</a>
                      </li>
                    </Dropdown.Item>
                    <Dropdown.Item href="/MyAccount" className="my-account-settings">
                      <li className="nav-item">
                        <a className="nav-link" href="/MyAccount">Account Settings</a>
                      </li>
                    </Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
                <li className="nav-item">
                  <a className="nav-link" href="/NewAd">Create New Ad</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Messages">Messages</a>
                </li>
                </>
                ) : (
                <>
                <li className="nav-item">
                  <a className="nav-link" href="/NewAd">Create New Ad</a>
                </li>
                <li className="nav-item">
                  <div className="nav-link-group">
                    <a className="nav-link" href="/signup">Sign Up</a>
                    <span>/</span>
                    <a className="nav-link" href="/login">Log In</a>
                  </div>
                </li>
                </>
                )}
            <Dropdown style={{ display: showDiv ? 'block' : 'none' }}>
                <Dropdown.Toggle className="categories-title" variant="success" id="dropdown-basic">
                  Options
                </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-categories">
                <SideBar />
              </Dropdown.Menu>
            </Dropdown>

            { sessionStorage.getItem("token") && isAdminStatus ? (
              <>
              <li className="nav-item">
                  <a className="nav-link" href="/AdminPanel/ReportedAds">Admin Panel</a>
                </li>
              </>
            ) : (<></>)  }
              
            </ul>
            <form className="d-flex search-form" role="search" onSubmit={handleSearch}>
              <div className="search-bar-container">
                <input className="form-control me-2" id = "search"type="search" placeholder="What are you looking for?" aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button className="btn btn-outline-light search-icon" type="button" onClick={handleSearch}>
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;