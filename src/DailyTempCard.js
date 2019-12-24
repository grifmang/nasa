import React from "react";

const DailyTempCard = (props) => {

    return (
        <div className='daily-card'>
            <h4>Sol {props.sol} </h4>
            <p>Day</p>
            <p>{props.season}</p>
            <hr />
            <p>Air Temp: {props.at}</p>
            <p>Wind Speed: {props.hws}</p>
            <p>Pressure: {props.pre}</p>
        </div>
    )
}

export default DailyTempCard;