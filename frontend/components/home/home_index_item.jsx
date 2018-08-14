import React from 'react';


const HomeIndexItem = ({home}) => {
    return (
        <div className="home-index-item">
            <div className="home-index-photo">
            </div>
            <div className="home-index-details">
                <div className="rooms">
                    {home.num_rooms} Rooms
                </div>
                <div><h1>{home.name} </h1></div>
                <div className="price">
                    ${home.price} per night
                </div>
            </div>
        </div>
    );
};

export default HomeIndexItem;