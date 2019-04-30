import React, { Component } from 'react';
import axios from 'axios';
import L from 'leaflet';
import Noty from 'noty';
import '../../node_modules/noty/lib/noty.css';
import '../../node_modules/noty/lib/themes/sunset.css';
import { css } from '@emotion/core';
import { PropagateLoader } from 'react-spinners';
import config from '../config';
import keys from '../keys';
import MapComp from './tracking/MapComp';
import SatDataComp from './tracking/SatDataComp';
import SatDescripComp from './tracking/SatDescripComp';
import geoData from './tracking/geoData';
import sat from '../satellites';
import 'leaflet/dist/leaflet.css';
import './tracking/trackerSat.css';
import Title from './title';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

// Initializing library TLE.js
const TLEJS = require('tle.js');

const tlejs = new TLEJS();

// TrackSat component
class TrackSat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: null,
      jsonSatList: sat,
      lat: 43.604,
      lng: 1.444,
      zoom: 3,
      isLoading: true,
      error: null,
      satNameVal: sat[0].name,
      satId: [25544],
      satDescrip: [sat[0].description],
      satLaunchDate: [sat[0].launch],
      mapCenter: [43.604, 1.444],
      tle: '1 25544U 98067A   19120.40833581  .00001450  00000-0  30616-4 0  9995\r\n2 25544  51.6410 238.6747 0000873 256.1238 216.5201 15.52607716167833',
      coords: { latitude: '', longitude: '' }
    };
    // Binding methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 30000);
  }

  // Stopping the time interval
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Getting data from the API with axios
  getData() {
    const { satId } = this.state;
    const url = `${config.N2YO_POS_URL}${satId}/43.604/1.444/0/1/&apiKey=${keys.N2YO_API_KEY}`;

    axios.get(url)
      .then(resp => this.setState({
        hits: resp.data,
        isLoading: false,
        lat: resp.data.positions[0].satlatitude,
        lng: resp.data.positions[0].satlongitude,
      }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  // Getting data from the API with axios
  getTLE() {
    const { satId } = this.state;
    const id = satId;
    const url = `${config.N2YO_TLE_URL}${id}&apiKey=${config.N2YO_API_KEY}`;
    axios.get(url)
      .then(resp => this.setState({
        hits: resp.data,
        tle: resp.data.tle,
        isLoading: false,
      }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getMarkerChange() {
    const { satId } = this.state;
    const issMarker = L.icon({
      // eslint-disable-next-line global-require
      iconUrl: require('./images/iss.png'),
      iconSize: [80, 80],
    });
    const satMarker = L.icon({
      // eslint-disable-next-line global-require
      iconUrl: require('./images/satellite.png'),
      iconSize: [60, 60],
    });
    const marker = (satId[0] === 25544) ? issMarker : satMarker;
    return marker;
  }

  // Building a geoJSON like object (identical object structure)
  buildGeoJson() {
    const { tle } = this.state;
    const threeOrbitsArr = tlejs.getGroundTrackLngLat(tle);
    const currentOrbitArr = threeOrbitsArr[1];
    const geometry = { ...geoData.features[0].geometry, type: 'LineString', coordinates: currentOrbitArr };
    const typePropsGeometry = [{ ...geoData.features[0], geometry: geometry }];
    const features = { ...geoData, features: typePropsGeometry };
    return features;
  }

  updateMapCenter() {
    const { lat, lng } = this.state;
    this.getData();
    this.setState({ mapCenter: [lat, lng] });
  }

  // Handling change of select input form
  handleChange(event) {
    this.setState({ satNameVal: event.target.value });
  }

  // Submitting the form input change
  handleSubmit(event) {
    const { satNameVal, jsonSatList } = this.state;
    event.preventDefault();
    // text: `You choose to track : ${value}`,
    new Noty({
      theme: 'sunset',
      type: 'info',
      text: `You're tracking ${satNameVal}`,
      timeout: 2000
    }).show();
    // Extracting the satellite id from the name value store in the state
    const idMatched = jsonSatList
      .filter(item => (item.name === satNameVal))
      .map(singleItem => (singleItem.id));
    // Extracting the satellite description from the name value store in the state
    const descriptionMatched = jsonSatList
      .filter(item => (item.name === satNameVal))
      .map(singleItem => (singleItem.description));
    // Extracting the satellite launch date from the name value store in the state
    const dateMatched = jsonSatList
      .filter(item => (item.name === satNameVal))
      .map(singleItem => (singleItem.launch));
    // Updating State with satellite id, description and launch date
    this.setState(
      {
        satId: idMatched,
        satDescrip: descriptionMatched,
        satLaunchDate: dateMatched
      },
      this.updateMapCenter
    );
  }

  render() {
    // Destructuring & variable assignation
    const {
      hits,
      jsonSatList,
      isLoading,
      error,
      lat,
      lng,
      zoom,
      satNameVal,
      satDescrip,
      satLaunchDate,
      mapCenter
    } = this.state;
    const position = [(lat).toFixed(2), (lng).toFixed(2)];

    // Console logging of the number of transcations with the API
    if (hits) {
      console.log(`Count of transactions performed in last 60 min : ${hits.info.transactionscount}`);
    }

    // Displaying error message if any
    if (error) {
      return <p>{error.message}</p>;
    }
    // Displaying loading
    if (isLoading) {
      return (
        <div className="container minPageSizeBlue">
          <div className="row">
            <div className="text-center mx-auto m-5">
              <PropagateLoader
                css={override}
                sizeUnit="px"
                size={25}
                color="#43a2d0"
                loading={this.loading}
              />
            </div>
          </div>
        </div>
      );
    }

    // Making the option tag list for form select input
    const satList = jsonSatList
      .map(item => <option key={item.id} value={item.name}>{item.name}</option>);

    return (
      <div className="container-fluid text-center tracker-page">
        <Title title="Space &amp; Earth science satellites tracking" idStyle="titlelight" />
        <div className="containerStyle">
          <div className="mapLoc">
            <MapComp
              position={position}
              mapCenter={mapCenter}
              zoom={zoom}
              marker={this.getMarkerChange()}
              satName={satNameVal}
            />
            <SatDataComp
              launchDate={satLaunchDate}
              lat={position[0]}
              lng={position[1]}
              hits={hits}
              time={hits ? hits.positions[0].timestamp : 0}
            />
          </div>
          <SatDescripComp
            submitSatSelect={this.handleSubmit}
            satName={satNameVal}
            onChange={this.handleChange}
            hits={hits}
            satList={satList}
            satDescrip={satDescrip}
          />
        </div>
      </div>
    );
  }
}

export default TrackSat;
