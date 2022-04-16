import React from 'react';
import ReactDOM from 'react-dom';
import {google,service,map} from "google-maps-react";
const mapStyles = {
  map: {
    position: 'absolute',
    width: '70%',
    height: '80%'
  }
};
function getSchools(props){
    var pyrmont=new google.maps.LatLng(props.currentLocation.lat,props.currentLocation.lng);
    var request={
        location:pyrmont,
        radius:"2000",
        type:["school"]
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);
}
function callback(results, status){
    if(status==google.maps.places.PlacesServiceStatus.ok){
        for(var i=0;i<results.length;i++){
            var place =results[i];
            var marker=new google.maps.marker({
                position:place.geometry.location,
                map:map,
                title:place.name
            });
            function bindInfoWindow(marker,map,infowindow,html){
                marker.addListner("click",function(){
                    infowindow.setContent(html);
                    infowindow.open(map,this);
                })
            }
        }
    }
}
export class CurrentLocation extends React.Component {
    constructor(props) {
        super(props);
    
        const { lat, lng } = this.props.initialCenter;
    
        this.state = {
          currentLocation: {
            lat: lat,
            lng: lng
          }
          
        }; 
      }
      
      componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
          this.recenterMap();
        }
      }
      
      recenterMap() {
        const map = this.map;
        const current = this.state.currentLocation;
        const google = this.props.google;
        const maps = google.maps;
    
        if (map) {
          let center = new maps.LatLng(current.lat, current.lng);
          map.panTo(center);
        }
      }
      componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
          if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
              this.setState({
                currentLocation: {
                  lat: coords.latitude,
                  lng: coords.longitude
                }
              });
            });
          }
        }
        this.loadMap();
      }
      
      loadMap() {
       
        if (this.props && this.props.google) {
          // checks if google is available
          const { google } = this.props;
          const maps = google.maps;
          
    
          const mapRef = this.refs.map;
    
          // reference to the actual DOM element
          const node = ReactDOM.findDOMNode(mapRef);
    
          let { zoom } = this.props;
          const { lat, lng } = this.state.currentLocation;
          const center = new maps.LatLng(lat, lng);
         
         
    
          const mapConfig = Object.assign(
            {},
            {
              center: center,
              zoom:16,
              disableDefaultUI:true,
              clickableIcons:false,
              mapId:"86c6586560da7aab"
            }
          );
    
          // maps.Map() is constructor that instantiates the map
          this.map = new maps.Map(node, mapConfig);
        }
      }
      renderChildren() {
        const { children } = this.props;
    
        if (!children) return;
    
        return React.Children.map(children, c => {
          if (!c) return;
    
          return React.cloneElement(c, {
            map: this.map,
            google: this.props.google,
            mapCenter: this.state.currentLocation
          });
        });
      }
      render() {
        const style = Object.assign({}, mapStyles.map);
    
        return (
          <div>
            <div style={style} ref="map">
              Loading map...
            </div>
            {this.renderChildren()}
          </div>
        );
      }
      
}

export default CurrentLocation;
CurrentLocation.defaultProps = {
    zoom: 20,
    initialCenter: {
      lat: -1.2884,
      lng: 36.8233
    },
    centerAroundCurrentLocation: false,
    visible: true
  };
  