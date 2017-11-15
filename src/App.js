import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingLatlng: false,
      hasLatLng: false,
      latlng: {},
      temp: 0,
      weather: {},
      hasCity: false,
      city: "",
      apiCity: ""
      //latlng: { lat: 77, lng: 77 }
    };
    this.getLatLng = this.getLatLng.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.handleSearchCity = this.handleSearchCity.bind(this);
    this.handleSearchCityChange = this.handleSearchCityChange.bind(this);
  }

  getWeather(result) {
    console.log(result);
    //http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=72af66db614bf9fd03583352142dd7a7
    return fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${result.lat}&lon=${result.lng}&APPID=72af66db614bf9fd03583352142dd7a7`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data.main.temp);
        console.log(data.weather[0]);
        this.setState({
          temp: Math.round(data.main.temp - 273.15),
          weather: data.weather[0]
        });
      });
  }

  getLatLng(city) {
    this.setState({ loadingLatlng: true });

    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${city}`
    )
      .then(response => response.json())
      .then(data => {
        if (data.status !== "OK") {
          console.log(data);
          this.setState({
            loadingLatlng: false,
            hasLatlng: false
            //console.log(data)
          });
          throw new Error("didnt work");
        } else {
          console.log("address: ", data.results[0].formatted_address);

          this.setState({
            loadingLatlng: false,
            hasLatLng: true,
            latlng: data.results[0].geometry.location,
            apiCity: data.results[0].formatted_address
          });

          return data.results[0].geometry.location;
        }
        //console.log(data.results[0].geometry.location);
      });
  }

  componentDidMount() {
    //for when the page loads
    //run once component is on the page
    // this.getLatLng("Sydney")
    //   .then(result => {
    //     this.getWeather(result);
    //   })
    //   .catch(error => console.log(error));
    //lifecycle hoot
  }

  handleSearchCity() {
    this.setState({ hasCity: true });

    this.getLatLng(this.state.city)
      .then(result => {
        this.getWeather(result);
      })
      .catch(error => console.log(error));
  }

  handleSearchCityChange(event) {
    this.setState({ city: event.target.value });
  }

  renderMsg() {
    if (this.state.loadingLatlng) {
      return <div>Loading...</div>;
    }
    if (!this.state.hasCity) {
      return (
        <div>
          <form id="searchCityForm" onSubmit={this.handleSearchCity}>
            Enter location:
            <input
              id="searchCity"
              type="text"
              value={this.state.searchCity}
              onChange={this.handleSearchCityChange}
            />
            <button>Submit</button>
          </form>
        </div>
      );
    }
    if (!this.state.loadingLatlng && this.state.hasLatLng) {
      return (
        <div>
          <form id="searchCityForm" onSubmit={this.handleSearchCity}>
            Enter location:{" "}
            <input
              id="searchCity"
              type="text"
              value={this.state.searchCity} // works somehow with wrong name?
              onChange={this.handleSearchCityChange}
            />
            <button>Submit</button>
          </form>
          {this.state.apiCity}
          <br />
          <div>Lat: {this.state.latlng.lat}</div>
          <div>Lng: {this.state.latlng.lng}</div>
          <br />
          The temperature is: {this.state.temp} &#8451;
          <br />
          The weather is: {this.state.weather.description}
          {/* http://openweathermap.org/img/w/10d.png
          {id: 801, main: "Clouds", description: "few clouds", icon: "02n"}
          {this.state.weather.icon} */}
          {/* <img className="image" src={`images/${this.props.image}`} /> */}
          <br />
          <img
            src={`http://openweathermap.org/img/w/${this.state.weather
              .icon}.png`}
            alt="Weather icon"
          />
          {/* `http://openweathermap.org/img/w/
          `http://openweathermap.org/img/w/+ ${this.state.weather.icon} + `.png" /> */}
          {/* //var html = '<img src="http://openweathermap.org/img/w/' + code + '.png" alt="Weather Icon">' + '<p> ' + Math.round(temp) + ' ' + tempUnit + ', ' + description + '<br> Wind Speed: ' + wspeed + windUnit + '</p><p>' + city + ', ' + state + '</p>' */}
        </div>
      );
    }
    return <div>something went wrong</div>;
  }

  render() {
    //run ever time state is changed
    return (
      <div className="App">
        <h1>Weather App</h1>
        {this.renderMsg()}
      </div>
    );
  }
}

export default App;
