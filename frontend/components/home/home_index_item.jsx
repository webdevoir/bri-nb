import React from 'react';


const HomeIndexItem = ({home}) => {
    return (
        <div className="home-index-item">
            <div className="home-index-photo">
            </div>
            <div className="home-index-details">
                <div className="home-index-rooms">
                    {home.num_rooms} ROOMS
                </div>
                <div className="home-index-name">
                    <h1>{home.name} </h1>
                </div>
                <div className="home-index-price">
                    ${home.price} per night
                </div>
                <div className="stars">
                    <i className="fas fa-star fa-xs"></i>
                    <i className="fas fa-star fa-xs"></i>
                    <i className="fas fa-star fa-xs"></i>
                    <i className="fas fa-star fa-xs"></i>
                    <i className="fas fa-star fa-xs"></i>
                </div>
            </div>
        </div>
    );
};

export default HomeIndexItem;