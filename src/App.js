import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import classNames from "classnames";
import { add } from "date-fns";

const libraries = ["places"];

const mapContainerStyle = {
  height: "100vh",
  width: "100wh",
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 42.37703458185478,
  lng: -71.11662791545155,
};

const MapButton = ({ toggleMap }) => {
  return (
    <button
      className="toggle-map"
      title="Show/hide map"
      onClick={() => {
        toggleMap();
      }}
    >
      <img src="/map.png" alt="map icon" />
    </button>
  );
};

const Search = ({ getWeather, setLocation, map, toggleMap }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue("", false);
    clearSuggestions();
    setLocation(address);
    if (map) toggleMap();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      getWeather({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

const Locate = ({ getLocation, getWeather, map, toggleMap }) => {
  return (
    <button
      className="locate"
      title="Get current Location"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            getLocation({ lat, lng });
            getWeather({ lat, lng });
            if (map) toggleMap();
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
};

const ShowWeather = ({ weather, location, unit, toggleUnit }) => {
  const weatherDescription = weather.current.weather[0].description.replace(
    /(^\w{1})|(\s+\w{1})/g,
    (letter) => letter.toUpperCase()
  );

  const getUnit = () => (unit ? "°F" : "°C");

  const convertToFahrenheit = (temp) => Math.round((temp * 9) / 5) + 32;

  return (
    <main
      className={classNames("app", {
        rain: weather.current.weather[0].main === "Rain",
        snow: weather.current.weather[0].main === "Snow",
        clouds: weather.current.weather[0].main === "Clouds",
        fewclouds: weather.current.weather[0].description === "few clouds",
        clear: weather.current.weather[0].main === "Clear",
        haze: weather.current.weather[0].main === "Haze",
        mist: weather.current.weather[0].main === "Mist",
      })}
    >
      <div className="main-container">
        <div className="weather-box">
          <div className="location">{location}</div>
          <GetTime timezone={weather.timezone} />
          <div className="description">{weatherDescription}</div>
          <div className="icon-temp">
            <div className="icon">
              <img
                alt="weather icon"
                src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png`}
              />
            </div>
            <div className="temp">
              {unit
                ? convertToFahrenheit(Math.round(weather.current.temp))
                : Math.round(weather.current.temp)}
              {getUnit()}
            </div>
            <SwitchUnit unit={unit} toggleUnit={() => toggleUnit()} />
          </div>
          <div className="feels-like">
            Feels like{" "}
            {unit
              ? convertToFahrenheit(Math.round(weather.current.feels_like))
              : Math.round(weather.current.feels_like)}
            {getUnit()}
          </div>
          <div className="hourly-forecast">
            {[...Array(6).keys()].map((i) => (
              <HourlyForecast
                index={i}
                weather={weather}
                unit={unit}
                convertToFahrenheit={convertToFahrenheit}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const SwitchUnit = ({ unit, toggleUnit }) => {
  return (
    <div className="switch-button">
      <label className="switch">
        <input
          onChange={() => toggleUnit()}
          checked={unit}
          type="checkbox"
        ></input>
        <span className="slider round">
          <div>
            <span>C</span>
            <span>F</span>
          </div>
        </span>
      </label>
    </div>
  );
};

const GetTime = ({ timezone }) => {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div className="datetime">
      <div className="date">
        {new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          weekday: "long",
          month: "long",
          day: "2-digit",
        }).format(dateState)}
      </div>
      <div className="time">
        {new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(dateState)}
      </div>
    </div>
  );
};

const HourlyForecast = ({ index, weather, unit, convertToFahrenheit }) => {
  const addHour = (hour) => {
    const date = add(new Date(), { hours: hour });
    return new Intl.DateTimeFormat("en-US", {
      timeZone: weather.timezone,
      hour: "2-digit",
    }).format(date);
  };

  return (
    <div className="hour-forecast">
      <div>{addHour(index + 1)}</div>
      <div className="weather-icon-hour">
        <img
          alt="weather icon"
          src={`http://openweathermap.org/img/wn/${weather.hourly[index].weather[0].icon}@2x.png`}
        />
      </div>
      <div>
        {unit
          ? convertToFahrenheit(Math.round(weather.hourly[index].temp))
          : Math.round(weather.hourly[index].temp)}
        °
      </div>
      <div className="pop">
        <div className="rain-icon">
          <img alt="rain icon" src="/drop.svg" />
        </div>
        <div>{Math.round(weather.hourly[index].pop * 100)}%</div>
      </div>
    </div>
  );
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const [markers, setMarkers] = useState([]);
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState([]);
  const [unit, setUnit] = useState(false);
  const [map, setMap] = useState(true);

  const toggleUnit = () => setUnit(!unit);

  const toggleMap = () => {
    map ? setMap(false) : setMap(true);
  };

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkers(() => [{ lat, lng }]);
    getWeather({ lat, lng });
    getLocation({ lat, lng });
    if (map) toggleMap();
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getWeather = ({ lat, lng }) => {
    const weather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=alerts,minutely&units=metric&appid=${OPENWEATHER_API_KEY}`;
    fetch(weather)
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error:", error));
  };

  const getLocation = ({ lat, lng }) => {
    const reverseGeocoding = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    fetch(reverseGeocoding)
      .then((res) => res.json())
      .then((data) => setLocation(`${data[0].name}, ${data[0].country}`))
      .catch((error) => console.error("Error:", error));
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <>
      <MapButton toggleMap={toggleMap} />
      <Search
        getWeather={getWeather}
        setLocation={setLocation}
        map={map}
        toggleMap={toggleMap}
      />
      <Locate
        getLocation={getLocation}
        getWeather={getWeather}
        map={map}
        toggleMap={toggleMap}
      />
      {!map && weather.current ? (
        <ShowWeather
          weather={weather}
          location={location}
          unit={unit}
          toggleUnit={toggleUnit}
        />
      ) : (
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={5}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {markers.map((marker) => (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </GoogleMap>
      )}
    </>
  );
};

export default App;
