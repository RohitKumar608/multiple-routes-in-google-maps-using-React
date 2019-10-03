import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import PropTypes from "prop-types";
import MileageMap from './MileageMap';
import './map.css';

const labels = [
  ["A", "B"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["I", "J"],
  ["K", "L"],
  ["M", "N"],
  ["O", "P"],
  ["Q", "R"],
  ["S", "T"],
  ["U", "V"],
  ["W", "X"],
  ["Y", "Z"],
  ["AB", "AC"],
  ["AD", "AE"]
];

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log("Success", latLng))
      .catch(error => console.error("Error", error));
  };

  render() {
    const { wayPoints } = this.props;
    return (
      <React.Fragment>
        <div
         className="row text-white col-md-12"
        >
          <button
            onClick={this.props.handleAddLocation}
            className="btn-success"
          >
            Add More
          </button>
        </div>
        {wayPoints &&
          wayPoints.map(point => (
            <div
              key={point.id}
              style={{padding: "4px",
                height: "200px",
                border: "1px dotted #b9a7a7",
                marginTop: "38px"
              }}
              className="col-md-auto"
            >
              
              <div style={{marginBottom:'10px'}} className="col-md-8">
                
              <button
               type="button" className="close" aria-label="Close"
                style={{float:'right'}}
                disabled={wayPoints.length<=1}
                onClick={() => this.props.handleDeleteLocation(point.id)}
                // className="btn-danger"
              >
                <i 
                style={{background: "red",
                  borderRadius: "8px",
                  color: "white"}}
                className="material-icons align-middle">close</i>
                {/* Remove */}
              </button>
                <PlacesAutocomplete
                  value={point.fromAddress}
                  onChange={address =>
                    this.props.handleFromChange(address, point.id)
                  }
                  onSelect={address =>
                    this.props.handleFromSelect(address, point.id)
                  }
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading
                  }) => (
                    <div className="autocomplete-root" >
                      <input
                        {...getInputProps({
                          placeholder: "Search from ...",
                          className: "location-search-input Map-Input"
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              style={{ backgroundColor: "#6855er34" }}
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style
                              })}
                            >
                              <span style={{zIndex:'9999'}}>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              <div  style={{ marginBottom: "10px!important" }} className="col-md-8">
                <PlacesAutocomplete
                  value={point.toAddress}
                  onChange={address =>
                    this.props.handleToChange(address, point.id)
                  }
                  onSelect={address =>
                    this.props.handleToSelect(address, point.id)
                  }
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading
                  }) => (
                    <div className="autocomplete-root">
                      <input
                        {...getInputProps({
                          placeholder: "Search to ...",
                          className: "location-search-input Map-Input"
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              style={{ backgroundColor: "#6855er34" }}
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>

                <div id={`GoogleMapaccordion`} className="col-md-12">
                {point.geoCodedWayPoints &&
                  point.geoCodedWayPoints.length > 0 &&
                  point.geoCodedWayPoints.map((points, index) => (
                    <React.Fragment key={index}>
                      <div id={"GoogleMapOne" + index}>
                        <h5
                          className="heading-h5 collapsed"
                          data-toggle="collapse"
                          data-target={"#GoogleMapcollapse" + index}
                          aria-expanded="true"
                          aria-controls={"collapse" + index}
                        >
                          {`Via ${points.legs && points.summary}
                      (${points.legs[0] &&
                        points.legs[0].distance &&
                        points.legs[0].distance.text})`}
                          <span className="totla-dis">
                            <span>
                              {points.legs[0] &&
                                points.legs[0].duration &&
                                points.legs[0].duration.text}
                            </span>
                          </span>
                        </h5>

                        <div className="clearfix" />
                      </div>
                    </React.Fragment>
                    ))}
                    </div>

              </div>
            </div>
          ))}
            <div className="col-md-6 pl-0">
          <MileageMap
            wayPoints={wayPoints}
            labels={labels}
            travelMode="DRIVING"
          />
        </div>
      </React.Fragment>
    );
  }
}
LocationSearchInput.propTypes = {
  handleFromChange: PropTypes.func,
  handleFromSelect: PropTypes.func,
  handleToChange: PropTypes.func,
  handleToSelect: PropTypes.func,
  handleAddLocation: PropTypes.func,
  handleDeleteLocation: PropTypes.func,
  handleSelectRoute: PropTypes.func,
  wayPoint: PropTypes.array
};
export default LocationSearchInput;
