import { useCallback, useRef, useState } from "react";
import MapButton from "./components/MapButton";
import Search from "./components/Search";
import Locate from "./components/Locate";
import ShowWeather from "./components/ShowWeather";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import mapStyles from "./mapStyles";

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
