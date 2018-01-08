import React from 'react';
import axios from 'axios';
import  { Map, TileLayer, Popup, Marker, LayerGroup, LayersControl, Overlay }  from 'react-leaflet-wrapper';
import './App.css'
import leaflet from 'leaflet';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './react-bootstrap-table-all.min.css';

// Component: App
// Execution: App is the only component of this program,
//      providing the entire functionality.  See README 
//      for deatails about overall function
 
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            search: 'Type City Here',    // the text in the input 
            latitude: 38.0293,           // latitude returned from google maps geocode
            longitude: 78.4767,          // longitude returned from google maps geocode
            restaurantLocations: [],     // array of [lat, lng] arrays of nearby restaurants
            restaurantInformation: []    // array of resaurant info 

        }
    }

    // funtion: makes a call to google place search api and 
    // returns restaurants within 1000 meters of the lat and long
    // saved in the state of this component
    getRestaurantInfo(inputLat, inputLong) {
        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${inputLat},${inputLong}&radius=1000&type=restaurant&key=AIzaSyAqQCim-mREU61fR4Seo8jnuOTQvhfjaGs`)
        .then(response => {
                //console.log(response);
                // temporary array to be filled with info from the 
                // results
                var tempArrayLocation = [];
                var tempArrayInfo = [{
                    marker: "",
                    name: "Name",
                    open: "Open Now?(T/F)", 
                    price_level: "Price Level", 
                    address: "Address"}];
                //console.log(this.state.exampleInfo)
                //the response from google place search is looped through 
                // and useful information is extracted
                response.data.results.forEach(function(item, index, array) {
                    //tempArray.push([item.geometry.location.lat, item.geometry.location.lng,])
                    var subTempArrayLocation = [item.geometry.location.lat,item.geometry.location.lng]
                    var subTempArrayInfo = {
                        marker: index,
                        name: item.name,
                        open: item.opening_hours.open_now, 
                        price_level: item.price_level, 
                        address: item.vicinity}
                    //console.log(subTempArray);
                    tempArrayLocation.push(subTempArrayLocation);
                    tempArrayInfo.push(subTempArrayInfo);
                })
                //console.log(tempArray);
                //console.log(tempArrayInfo);
                //the state of this component is updated with the info
                //from google place search
                this.setState({
                    restaurantLocations: tempArrayLocation
                })
                this.setState({
                    restaurantInformation: tempArrayInfo
                })
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error)
            });
        //console.log(this.state.restaurantLocations);
        //console.log(this.state.estaurantInformation);
    }

    // function called when there is a user input
    updateSearch(event) {
        this.setState({search: event.target.value})
    }

    // function that both updates the map and calls getRestaurant info
    // google maps geocode is used to give a latitude and longitude of
    // the user input
    updateMap(inputLocation) {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${inputLocation}&key=AIzaSyCc0FM2Zu2BmJOHtO4_xJEwaOniPyjTMDw`)
        .then(response => { 
                this.setState({
                    latitude: response.data.results[0].geometry.location.lat,
                    longitude: response.data.results[0].geometry.location.lng   
                });
                //console.log('the buttom was clicked' + " " + this.state.latitude + " " + this.state.longitude);
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
            // the next funtion is called in order to find info about 
            // nearby restaurants
        this.getRestaurantInfo(this.state.latitude, this.state.longitude); 
    }
    //includes some links for leaflet-react-wrapper that I do not beleive are
    //necessary
    render() {
        return (
            <div id="background">
            <div id="application">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
                integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
                crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"
                integrity="sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log=="
                crossorigin="">
                </script>
                <h1 id="title">Need some grub?</h1>
                <h2 id="directions">Just type in your city and click the button twice for results to display</h2>
                <input  id="searchBar" 
                        type="text"
                        value={this.state.search} 
                        onChange={this.updateSearch.bind(this)}/>
                <button id="button"onClick={ (e) => { this.updateMap(this.state.search);} }>
                    click for establishments
                </button>
                <div id="map">
                    <Map
                        center={[this.state.latitude, this.state.longitude]}
                        zoom={14}
                        scrollWheelZoom={false}
                        >
                        <TileLayer/>                             
                    </Map>       
                    
                <div id="table">
                    <BootstrapTable data={this.state.restaurantInformation} options={ { noDataText: 'Restaurant info will appear here' } }>
                        <TableHeaderColumn id="col1" dataField='marker' isKey={ true } dataAlign='center'></TableHeaderColumn>
                        <TableHeaderColumn dataField='name' headerAlign='center' width='280'></TableHeaderColumn>
                        <TableHeaderColumn dataField='open'widt='200' headerAlign='left'></TableHeaderColumn>
                        <TableHeaderColumn dataField='price_level'width='100'></TableHeaderColumn>
                        <TableHeaderColumn dataField='address'width='400'></TableHeaderColumn>
                    </BootstrapTable>
                 </div>   
                </div>
                <footer id="footer">
                </footer>                           
            </div> 
            </div>
            
            
        )   
    }
}