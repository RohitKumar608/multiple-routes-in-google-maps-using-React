import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  DirectionsRenderer
} from "react-google-maps";
import { Polyline } from "react-google-maps";
import { compose, withProps } from "recompose";
import PropTypes from "prop-types";

class MapDirectionsRenderer extends Component {
  static propTypes = {
    waypoints: PropTypes.array,
    places: PropTypes.array
  };

  state = {
    directions: null,
    error: null
  };

  componentDidMount() {
    const { places } = this.props;
    const waypoints = places.map(p => ({
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: waypoints,
        provideRouteAlternatives: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            markers: true
          });
        } else {
          //   this.setState({ error: result });
        }
      }
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { places } = nextProps;
    const waypoints = places.map(p => ({
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: waypoints
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            multiDirection:nextProps.geocodedWaypoints && nextProps.geocodedWaypoints.length
              ? nextProps.geocodedWaypoints
              : []
          });
        } else {
          //   this.setState({ error: result });
        }
      }
    );
  }

  render() {
    if (this.state.error) {
      return <h1>{this.state.error}</h1>;
    }
    return (
      this.state.directions && (
        <DirectionsRenderer
          directions={this.state.directions}
          routeIndex={this.props.index}
          options={{
            polylineOptions: {
              strokeOpacity: 1,
              strokeWeight: 2,
              strokeColor: this.props.colors
            }
          }}
        />
      )
    );
  }
}

const getRandomColor = ["#4F33FF", "#334681", "#9B59B6", "#D63031"];

const MileageMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBWyyK5gkujBpxYNim55MUoSfo6cDWJM6w&v=3.exp",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div key="klj" style={{ height: `400px`,width:'1100px',marginBottom:"50px;" }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    key={props.travelMode}
    defaultZoom={8}
    center={{ lat: 20.5937, lng: 78.9629 }}
  >
    {props.wayPoints.map((wayPoint, wayIndex) => {
        wayPoint = JSON.parse(JSON.stringify(wayPoint));
      const markerPoints = [
        { latitude: wayPoint.fromLat, longitude: wayPoint.fromLng },
        { latitude: wayPoint.toLat, longitude: wayPoint.toLng }
      ];
      const multiDirectionArray = [];
      wayPoint.geoCodedWayPoints &&
        wayPoint.geoCodedWayPoints.length &&
        wayPoint.geoCodedWayPoints.forEach((multiPoints, index) => {
          multiDirectionArray[index] = [];
          multiPoints.legs[0].steps.forEach((LatLng, idx) => {
            multiDirectionArray[index][idx] = [
              {
                lat: LatLng.start_location.lat,
                lng: LatLng.start_location.lng
              },
              {
                lat: LatLng.end_location.lat,
                lng: LatLng.end_location.lng
              }
            ];
          });
        });
      const decode = encoded => {
        var points = [];
        var index = 0,
          len = encoded.length;
        var lat = 0,
          lng = 0;
        while (index < len) {
          var b,
            shift = 0,
            result = 0;
          do {
            b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          var dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lat += dlat;
          shift = 0;
          result = 0;
          do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          var dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lng += dlng;

          points.push({ lat: lat / 1e5, lng: lng / 1e5 });
        }
        return points;
      };
     
      let multiDirectionPolygonArray = [];
      wayPoint.geoCodedWayPoints &&
        wayPoint.geoCodedWayPoints.length &&
        wayPoint.geoCodedWayPoints.forEach((multiPoints, index) => {
          multiDirectionPolygonArray[index] = [];
          multiPoints.legs[0].steps.forEach((LatLng, idx) => {
            let polygonLatLng = decode(LatLng.polyline.points);
            multiDirectionPolygonArray[index][idx] = polygonLatLng;
          });
        });

      return (
        <React.Fragment key={wayPoint.id}>
          {markerPoints &&
            markerPoints.map((marker, index) => {
              const position = { lat: marker.latitude, lng: marker.longitude };
              return (
                <React.Fragment key={wayPoint.id + index}>
                  <Marker
                    key={index}
                    draggable={true}
                    options={{ draggable: true }}
                    position={position}
                    label={props.labels[wayIndex][index]}
                    labelStyle={{ background: "#fff", color: "#FFF" }}
                  />
                </React.Fragment>
              );
            })}
          {multiDirectionPolygonArray &&
            multiDirectionPolygonArray.map((marker, index) =>
              marker.map(mrk => (
                <Polyline
                  path={mrk}
                  geodesic={true}
                  options={{
                    strokeColor: getRandomColor[index + 1],
                    strokeOpacity: 1,
                    strokeWeight: 4
                  }}
                />
              ))
            )}
          <MapDirectionsRenderer
            places={markerPoints}
            routeIndex={wayPoint.id}
            colors={getRandomColor[wayIndex]}
            geocodedWaypoints={wayPoint.geoCodedWayPoints}
          />
        </React.Fragment>
      );
    })}
  </GoogleMap>
));

export default MileageMap;
