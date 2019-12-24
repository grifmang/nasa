import React, { useState, useEffect } from 'react';
import './App.css';
import DailyTempCard from "./DailyTempCard";
import axios from "axios";

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
          return element.includes('large') ? setBackground(element) : console.log('No Large')
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
        eachSol =  {
          id: index,
          sol: element[0],
          at: '',
          hws: '',
          pre: '',
          season: ''
        }
        if (element[0].length === 3) {
          Object.entries(element[1]).forEach(e => {
            console.log(e)
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
              let newArray = [];
              eachSol = {
                ...eachSol,
                season: e[1][0].toUpperCase() + e[1].slice(1, e[1].length)
              }
            }
            setSolData([...solData, eachSol]);
          })
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
      {console.log(solData)}
      <h2>Latest Temps from Elysium Planitia on Mars</h2>
      <p>Daily weather measurements (temperature, wind, pressure) on the surface of Mars at Elysium Panitia. A flat, smooth plain near Mars' equator.</p>
      <div className='current-day'>
        <div className='day'></div>
        <div className='temp'></div>
      </div>
      <div className='card'>
        {solData.map(element => {
          return <DailyTempCard key={element.id} sol={element.sol} at={element.at} hws={element.hws} pre={element.pre} season={element.season} />
        })}
      </div>
    </div>
  );
}

export default App;
