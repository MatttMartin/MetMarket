import Carousel from "../../components/carousel/carousel";
import CustomButton from "../../components/general/customButton";
import AvailabilityStatus from "../../components/general/availabilityStatus";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import axios from "axios";
import isLoggedIn from '../../util/isLoggedIn';

import { useParams, useNavigate} from "react-router-dom";

function AdDetails() {
  const { id } = useParams();
  const [adData, setAdData] = useState();
	const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
		const fetchAdData = async () => {
			try {
				const response = await axios.get(process.env.REACT_APP_APIURL + `/ads/adDetails/${id}`, {
          params: {
            id: id
          }
        });
        if (response.data.rows.length === 0) {
          navigate("/404");
        }
        else {
          setAdData(response.data.rows[0]);
          //setInitialUserData(response.data[0])
          console.log(response.data.rows[0]);
          setLoading(false);
        }
			} catch (error) {
				console.error("Error fetching user data:", error);
				setLoading(false);
			}
		};
	
		fetchAdData();
	}, [id]);

  useEffect(() => {
		if (isLoggedIn()) {
      const userId = jwtDecode(sessionStorage.getItem("token")).id;
      if (adData && parseInt(adData.user_id) == userId) {
        setIsOwner(true);
      }
    }
    
	}, [adData]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
			{loading ? (
				<div>Loading...</div>
			) : (
    <div className="mx-5 pb-5">
      <div className="row align-items-around my-5">
        <span className="col"> 
          <span className={adData.subcategory_name ? "text-muted" : "fw-bolder"}>{adData.category_name}</span>
          {adData.subcategory_name ? (<span className="fw-bolder">  / {adData.subcategory_name}</span>) : ""}
        </span>
        <button className="btn col text-end" onClick={goBack}>Back</button>
      </div>
      <div className="container text-center mt-5">
        <div className="row align-items-around">
          <div className="col col-12 col-sm-6">
          <Carousel items={adData.image_links.length > 0 && adData.image_links[0] != null ? adData.image_links : ['https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg']}/>
          </div>
          <div className="col col-12 col-sm-6 text-start">
            <h2 className="col col-12 col-sm-6 inline-block">
              {adData.title}
              <AvailabilityStatus available={adData.is_available === "1"}/>

            </h2>
            <h6 className="text-blue">
              {adData.meet_on_campus === "1"? 'Meet on Campus' : 
                adData.city + ', ' + adData.province_name
              }
            </h6>
            <h4 className="fw-normal">{adData.price}</h4>
            <p>{adData.description}</p>
            {
              isLoggedIn() ? 
                (isOwner 
                  ?<CustomButton href={`/EditAd/${id}`} text="Edit Ad" isBlue="false"/>
                  :<CustomButton href={`/Messages/${id}`} text="Message Seller"/>
                )
              :
              <CustomButton href={`/Login`} text="Login To Message Seller"/>
            }
            
            
          </div>
        </div>
      </div>
    </div>
    )}
		</>
  );
}

export default AdDetails;