import React, { useState, useEffect } from 'react';
import './App.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import DailyTempCard from "./DailyTempCard";
import axios from "axios";
import moment from "moment";

const API_KEY = 'oB236oYKvwkyRJACPadQuo1Oi2Lzts7yVImPcnaK'

function App() {

  const [background, setBackground] = useState('');
  const [solData, setSolData] = useState([]);

  useEffect(() => {
    axios.get('https://images-api.nasa.gov/search?keywords=mars')
    .then(response => {
      axios.get(response.data.collection.items[Math.ceil(Math.random() * 100)].href)
      .then(res => {
        res.data.map(element => {
          return element.includes('large') ? setBackground(element) : null
        })
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    let eachSol = {}
    axios.get(`https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`)
    .then(response => {
      Object.entries(response.data).forEach((element, index) => {
        if (element[0].length === 3) {
          eachSol =  {
            id: index,
            sol: element[0],
            at: '',
            date: '',
            hws: '',
            pre: '',
            season: ''
          }
          Object.entries(element[1]).forEach(e => {
              if (e[0] === 'AT') {
                eachSol = {
                  ...eachSol,
                  at: e[1].av
                }
              }
              if (e[0] === 'HWS') {
                eachSol = {
                  ...eachSol,
                  hws: e[1].av
                }
              }
              if (e[0] === 'PRE') {
                eachSol = {
                  ...eachSol,
                  pre: e[1].av
                }
              }
              if (e[0] === 'Season') {
                eachSol = {
                  ...eachSol,
                  season: e[1][0].toUpperCase() + e[1].slice(1, e[1].length)
                }
              }
              if (e[0] === 'First_UTC') {
                let newDate = e[1].split('T')
                newDate = moment(newDate[0]).format('LL')
                newDate = newDate.split(',')
                eachSol = {
                  ...eachSol,
                  date: newDate[0]
                }
              }
          })
          setSolData(sol => [...sol, eachSol])
        }
      })
    })
    .catch(err => console.log(err));
  }, [])

  return (
    <div className='main-container' style={{  
      backgroundImage: `url(${background})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '100vh'
    }}>
      <div className='title-description'>
        <h2>Latest Temps from Elysium Planitia on Mars</h2>
        <p>Daily weather measurements (temperature, wind, pressure) on the surface of Mars at Elysium Panitia. A flat, smooth plain near Mars' equator.</p>
      </div>
      {solData.length > 0 ?
      <>
      <div className='current-day'>
        <div className='day'>
          <h2>Sol: {solData[solData.length - 1].sol}</h2>
          <h3>{solData[solData.length - 1].date}</h3>
        </div>
        <div className='temp'>
          <h2>Avg Air Temp: {solData[solData.length - 1].at}</h2>
          <h3>{solData[solData.length - 1].season}</h3>
        </div>
      </div>
      <div className='cards'>
        {solData.map(element => {
          return <DailyTempCard key={element.id} date={element.date} sol={element.sol} at={element.at} hws={element.hws} pre={element.pre} season={element.season} />
        })}
      </div>
      </>
      : 
      <div className='center-spinner'>
        <Loader type="MutatingDots" color="#FF8C00" height={100} width={100} timeout={3000} />
      </div> }
    </div>
  );
}

export default App;
