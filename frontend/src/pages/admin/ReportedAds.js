import React, { useEffect, useState } from "react";
import axios from 'axios';
import SideBar from "../../components/sidebar/sideBar";
import "./style.css";
import AdContainer from "../../components/ads/adContainer";

function ReportedAds() {
  const [reportedAds, setReportedAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdData = async () => {
        try {
            let apiUrl = process.env.REACT_APP_APIURL + '/admin/reported-ads';
            const response = await axios.get(apiUrl);
            setReportedAds(response.data.rows);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching ad data:', error);
            setIsLoading(false);
        }
    };

    fetchAdData();
}, []);

  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading reported ads: {error}</p>;
  if (!reportedAds || reportedAds.length === 0) return <p>No reported ads found.</p>; // Add this for empty response

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 sidebar">
            <SideBar />
        </div>
        <div className="col-sm-12 col-md-10 ad-container">
            <AdContainer />
        </div>
      </div>
    </div>
  );
}

export default ReportedAds;


