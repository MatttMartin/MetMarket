import React, { useState, useEffect } from 'react';
import { useUser } from "../../userContext";
import axios from 'axios';
import './adContainer.css';
import ItemBlock from './itemBlock.js';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import SideBar from '../sidebar/sideBar.js';


function AdContainer() {
    const { userId, setUserId } = useUser();

    // Stuff for filtering, categories, etc.
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedCategory = searchParams.get('selectedCategory');
    const categoryName = searchParams.get('categoryName');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const searchQuery = searchParams.get('searchQuery');
    const sortBy = searchParams.get('sortby');
    const priceRange = searchParams.get('priceRange');
    const locationFilter = searchParams.get('location');

    const [adData, setAdData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [reportedAdData, setReportedAdData] = useState([]);
    const [loading, setLoading] = useState(true);

    const isMyListings = location.pathname.includes('/MyListings');
    const isReportedAds = location.pathname.includes('/AdminPanel/ReportedAds');

    useEffect(() => {
        const fetchAdData = async () => {
            try {
                let apiUrl = process.env.REACT_APP_APIURL + '/ads/products';

                if (searchQuery) {
                    apiUrl += `/search?&searchQuery=${searchQuery}`;
                }
                const response = await axios.get(apiUrl);
                setAdData(response.data.rows);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ad data:', error);
                setLoading(false);
            }
        };

        const fetchReportedAdData = async () => {
            try {
                let apiUrl = process.env.REACT_APP_APIURL + '/admin/reported-ads';
                const response = await axios.get(apiUrl);
                setReportedAdData(response.data.rows);
            } catch (error) {
                console.error('Error fetching ad data:', error);
            }
        };

        fetchAdData();
        fetchReportedAdData();
    }, [searchQuery]);

    useEffect(() => {
        let filteredItems = adData;
        if (selectedCategory) {
            filteredItems = filteredItems.filter(item => item.category_id == selectedCategory);
            setSelectedCategoryName(categoryName);
        } else if (searchQuery) {
            setFilteredData(adData);
            setSelectedCategoryName(`Results for: ${searchQuery}`);
        } else if (location.pathname == "/") {
            filteredItems = filteredItems.filter(item => item.is_available == 1);
            setSelectedCategoryName('Today\'s Picks');
        } else if (location.pathname.includes('/MyListings')) {
            filteredItems = filteredItems.filter(item => item.user_id == jwtDecode(sessionStorage.getItem("token")).id);
            setSelectedCategoryName('My Listings');
        } else {
            setFilteredData(adData);
        }

        if (locationFilter) {
            switch(locationFilter) {
                case 0:
                    filteredItems = filteredItems.filter(item => item.meet_on_campus == 1);
                    break;
                default:
                    filteredItems = filteredItems.filter(item => item.location_id == locationFilter);
                    break;
            }
        }

        if (priceRange) {
            console.log(priceRange);
            switch (priceRange) {
                case 'under25':
                    filteredItems = filteredItems.filter(item => item.price < 25.00);
                    break;
                case '25to50':
                    filteredItems = filteredItems.filter(item => item.price >= 25 && item.price <= 50);
                    break;
                case '50to100':
                    filteredItems = filteredItems.filter(item => item.price >= 50 && item.price <= 100);
                    break;
                case '100to200':
                    filteredItems = filteredItems.filter(item => item.price >= 100 && item.price <= 200);
                    break;
                case 'over200':
                    filteredItems = filteredItems.filter(item => item.price >= 200);
                    break;
                default:
                    console.log('Error sorting');
            }
        }

        if (sortBy) {
            switch (sortBy) {
                case 'priceASC':
                    filteredItems = filteredItems.slice().sort((a, b) => a.price - b.price);
                    break;
                case 'priceDESC':
                    filteredItems = filteredItems.slice().sort((a, b) => b.price - a.price);
                    break;
                case 'alphaASC':
                    filteredItems = filteredItems.slice().sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'alphaDESC':
                    filteredItems = filteredItems.slice().sort((a, b) => b.title.localeCompare(a.title));
                    break;
                default:
                    console.log('Error sorting');
            }
        }

        if (isReportedAds) {
            filteredItems = filteredItems.filter(item => reportedAdData.some(ad => ad.ad_id === item.product_id));
            filteredItems = filteredItems.map(item => ({ ...item, reason: reportedAdData.find(ad => ad.ad_id === item.product_id).reason }));
        }

    setFilteredData(filteredItems);

    }, [isReportedAds, selectedCategory, locationFilter, priceRange, sortBy, adData, location.pathname, userId]);

    return (
        <div>
            <h2 className="container-title-category">{selectedCategoryName}</h2>
            <div className="item-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <ItemBlock key={index} item={item} isMyListings={isMyListings} />
                        ))
                    ) : (
                        <p>No ad data available for the selected category</p>
                    )
                )}
            </div>
        </div>
    );
}

export default AdContainer;