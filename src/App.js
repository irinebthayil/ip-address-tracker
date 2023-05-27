import { useEffect, useRef, useState } from 'react';
import './App.css';
import arrow from './assets/icon-arrow.svg'
import mapboxgl from 'mapbox-gl'

function App() {

  const [ipdetails, setIPDetails] = useState({ ip: '', region: '', country: '', postalCode: '', timezone: ''})

  const [location, setLocation] = useState([77.69557, 12.7111]);

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
  const map = useRef(null);
  const mapMarker = useRef(null);

  useEffect(() => {
    getIP();
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      zoom: 12, // starting zoom
    });
  }, []);

  useEffect(() => {
    map.current.flyTo({
      center: location,
      essential: true
    });

    if(mapMarker.current)
    {
      mapMarker.current.remove();
    }
    mapMarker.current = new mapboxgl.Marker()
      .setLngLat(location)
      .addTo(map.current);
  }, [location]);

  function getIP(ip=''){
    let url = '';
    if(ip == '')
    {
      url = 'https://geo.ipify.org/api/v2/country,city?apiKey=' + process.env.REACT_APP_IPIFY_API_KEY
    }
    else {
      url = 'https://geo.ipify.org/api/v2/country,city?apiKey=' + process.env.REACT_APP_IPIFY_API_KEY +'&ipAddress='+ip
    }
    
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if(json.code == 422)
        {
          alert(json.messages);
        }
        else{
          let dets = {}
          dets.ip = json.ip;
          if (json.location.region)
          {
            dets.region = json.location.region + ",";
          }
          dets.country = json.location.country;
          dets.postalCode = json.location.postalCode;
          if (json.location.timezone) {
            dets.timezone = "UTC - " + json.location.timezone;
          }
          dets.isp = json.isp;
          setIPDetails(dets);
          let loc = [json.location.lng, json.location.lat];
          setLocation(loc);
        }
        
      })
  }

  function onSearchIP()
  {
    getIP(document.getElementById('searchIpInput').value);
  }

  return (
    <div className="parent-div">
      <div className='header-div'>
      </div>
      <div className='header-content'>
        <h2>IP Address Tracker</h2>
        <div className='searchbar'>
          <input id='searchIpInput' type='text' placeholder='Search for any IP address or domain' />
          <div className='arrow-div' onClick={onSearchIP}>
            <img src={arrow} alt='Search' />
          </div>
        </div>
        <div className='ip-details'>
          <div className='details-maindiv'>
            <p className='details-header'>IP ADDRESS</p>
            <p className='details-content'>{ipdetails.ip}</p>
          </div>
          <div className='details-maindiv'>
            <p className='details-header'>LOCATION</p>
            <p className='details-content'>{ipdetails.region} {ipdetails.country} {ipdetails.postalCode}</p>
          </div>
          <div className='details-maindiv'>
            <p className='details-header'>TIMEZONE</p>
            <p className='details-content'>UTC - {ipdetails.timezone}</p>
          </div>
          <div className='details-maindiv'>
            <p className='details-header'>ISP</p>
            <p className='details-content'>{ipdetails.isp}</p>
          </div>
        </div>
      </div>
      <div id="map"></div>
    </div>
  );
}

export default App;
