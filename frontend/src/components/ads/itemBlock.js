import imageExample from './blacktshirt.png';
import React from 'react';
import AvailabilityStatus from "../../components/general/availabilityStatus";
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import DeleteConfirmationModal from "../../components/adForm/deleteConfirmationModal";

function ItemBlock({ item, isMyListings }) {
    const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
    const location = useLocation();
    const isReportedAds = location.pathname.includes("/AdminPanel/ReportedAds");

    const handleClick = () => {
        window.location.href = `/adDetails/${item.product_id}`;
    };

    const handleEditClick = () => {
        window.location.href = `/EditAd/${item.product_id}`;
    };

    const handleDeleteClick = () => {

    };

    return (
        <div className='item-block-container' style={{ width: '300px', fontFamily: 'Poppins', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            { item.reason ? (
                <>
                <div className='reason'>
                    <span style={{color: '#004C9B', fontWeight: 'bold'}}>Reported for:</span> {item.reason}
                </div>
                </>
            ) : (
                <>
                </>
            )}
            <div className='imageHolder' style={{ width: '300px', height: '300px', maxWidth: '100%', maxHeight: '100%', backgroundImage: `url(${imageExample})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#F5F5F5', cursor: 'pointer', position: 'relative' }}>
                <img src={Array.isArray(item.image_links) ? item.image_links[0] : imageExample} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover'}} onClick={handleClick}/>
                {isMyListings || isReportedAds ? (
                    <div className="button-container" style={{ position: 'absolute', top: '10px', right: '5px' }}>
                        { isMyListings ? (
                            <button className="edit-button" onClick={handleEditClick} style={{ backgroundColor: '#004c9b', marginRight: '10px', padding: '5px 15px', borderRadius: '5px', color: 'white' }}>Edit</button>
                        ) : (<></>)}
                        <button className="btn btn-yellow rounded border-0 p-2 px-2 mx-1"
            onClick={($event) => {$event.preventDefault(); setIsDeleteModalShown(!isDeleteModalShown)}}
            >
              Delete Ad
            </button>
                    </div>
                ): (<></>)}
            </div>
            <div className='item-details' style={{ padding: '10px 0px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h6 style={{ color: '#004C9B', fontWeight: 'bold', margin: '0' }}>${item.price}</h6>
                    </div>
                    <div style={{ float: 'right', margin: '0'}}>
                        {isMyListings && <AvailabilityStatus available={item.is_available === "1"} />}
                    </div>
                </div>
                <a href="#" className="item-title" style={{ textDecoration: 'none' }}><h5 style={{ color: 'black', fontWeight: 'bold' }} onClick={handleClick}>{item.title}</h5></a>
                <h6 style={{ color: '#80A5CD' }}>{item.city ? `${item.city}, ${item.province_name}` : "Meet on Campus"}</h6>
            </div>
            <DeleteConfirmationModal show={isDeleteModalShown} 
            id={item.product_id}
            onHide={() => setIsDeleteModalShown(false)}
            />
        </div>
    );
}

export default ItemBlock;