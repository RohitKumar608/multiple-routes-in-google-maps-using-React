import React from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import LocationSearchInput from "./component/location-search";
import uuid from "uuid";
class App extends React.Component {
  state = {
    wayPoints: [
      {
        id: uuid.v4(),
        fromAddress: "",
        toAddress: "",
        fromLat: 0,
        fromLng: 0,
        toLat: 0,
        toLng: 0,
        geoCodedWayPoints: []
      }
    ]
  };

  handleFromChange = (address, wayPointId) => {
    let wayPoints = [...this.state.wayPoints];
    let wayPoint = wayPoints.find(point => point.id === wayPointId);
    wayPoint.fromAddress = address;
    this.setState({
      wayPoints
    });
  };

  handleToChange = (address, wayPointId) => {
    let wayPoints = [...this.state.wayPoints];
    let wayPoint = wayPoints.find(point => point.id === wayPointId);
    wayPoint.toAddress = address;
    this.setState({
      wayPoints
    });
  };

  handleFromSelect = (address, wayPointId) => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        let wayPoints = [...this.state.wayPoints];
        let wayPoint = wayPoints.find(point => point.id === wayPointId);
        wayPoint.fromAddress = address;
        wayPoint.fromLat = latLng.lat;
        wayPoint.fromLng = latLng.lng;
        this.setState({
          wayPoints
        });
        if (
          wayPoint.toAddress !== undefined &&
          wayPoint.toAddress !== "" &&
          wayPoint.toAddress !== null &&
          address
        ) {
          // this.getAllRoutes(address, wayPoint.toAddress, wayPointId);
          this.getAllRoutes(
            `${latLng.lat},${latLng.lng}`,
            `${wayPoint.toLat},${wayPoint.toLat}`,
            wayPointId
          );
        }
      })
      .catch(error => console.error("Error", error));
  };

  handleToSelect = (address, wayPointId) => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        let wayPoints = [...this.state.wayPoints];
        let wayPoint = wayPoints.find(point => point.id === wayPointId);
        wayPoint.toAddress = address;
        wayPoint.toLat = latLng.lat;
        wayPoint.toLng = latLng.lng;
        this.setState({
          wayPoints
        });
        if (
          wayPoint.fromAddress !== undefined &&
          wayPoint.fromAddress !== "" &&
          wayPoint.fromAddress !== null &&
          address
        ) {
          this.getAllRoutes(
            `${wayPoint.fromLat},${wayPoint.fromLng}`,
            `${latLng.lat},${latLng.lng}`,
            wayPointId
          );
        }
      })
      .catch(error => console.error("Error", error));
  };

  handleAddLocation = () => {
    let wayPoints = [...this.state.wayPoints];
    const wayPoint = {
      id: uuid.v4(),
      fromAddress: "",
        toAddress: "",
        fromLat: 0,
        fromLng: 0,
        toLat: 0,
        toLng: 0,
        geoCodedWayPoints: []
    };
    wayPoints.push(wayPoint);
    this.setState({ wayPoints: wayPoints });
  };

  handleDeleteLocation = locationId => {
    let wayPoints = [...this.state.wayPoints];
    wayPoints = wayPoints.filter(point => point.id !== locationId);
    let totalDistance = 0;
    wayPoints.forEach(point => {
      totalDistance = totalDistance + point.distance;
    });

    this.setState({
      wayPoints: wayPoints,
      totalDistanceInKM: totalDistance
    });
  };

  getAllRoutes = async (from, to, wayPointId) => {
    let data = "";
    try {
      data = await fetch(
        `http://localhost:3001/getRoute?source=${from}&destination=${to}`
      );
    } catch (error) {
      console.log(error);
    }
    data = await data.text().then(data => JSON.parse(data));
    if (data.status === "OK" && data.routes.length) {
      let wayPoints = [...this.state.wayPoints];
      let wayPoint = wayPoints.find(point => point.id === wayPointId);
      wayPoints.geoCodedWayPoints = [];
      wayPoint.geoCodedWayPoints = data.routes || [];
      this.setState({
        wayPoints
      });
    }
  };

  handleSelectRoute = (wayPointId, index, distance) => {
    let wayPoints = [...this.state.wayPoints];
    let wayPoint = wayPoints.find(point => point.id === wayPointId);
    wayPoint.distance = distance / 1000;
    const via = wayPoint.geoCodedWayPoints.find(
      (point, pointIndex) => pointIndex === index
    );
    wayPoint.via = via.summary;
    let totalDistance = 0;
    for (let index = 0; index < wayPoints.length; index++) {
      totalDistance += wayPoints[index].distance;
    }
    this.setState({
      totalDistanceInKM: totalDistance,
      wayPoints: wayPoints
    });
  };

  render() {
    const { wayPoints } = this.state;
    return (
      <div class="container">
        <div class="row">
          <LocationSearchInput
            handleFromChange={this.handleFromChange}
            handleFromSelect={this.handleFromSelect}
            handleToChange={this.handleToChange}
            handleToSelect={this.handleToSelect}
            handleAddLocation={this.handleAddLocation}
            handleDeleteLocation={this.handleDeleteLocation}
            getAllRoutes={this.getAllRoutes}
            handleSelectRoute={this.handleSelectRoute}
            wayPoints={wayPoints}
          />
        </div>
      </div>
    );
  }
}

export default App;
