import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
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

const libraries = ["places"];

const Title = () => {
  return (
    <h1 className="title">
      Weather{" "}
      <span role="img" aria-label="weather">
        🌤️
      </span>
    </h1>
  );
};

const Search = ({ getWeather, setLocation }) => {
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

const ShowWeather = ({ weather, location }) => {
  return (
    <main>
      <div className="weather-box">
        <div className="location">{location}</div>
        <div className="weather-condition">
          {weather.current.weather[0].description}
        </div>
        <div className="temp">{Math.round(weather.current.temp)}°C</div>
        <div className="feels-like">
          Feels like {Math.round(weather.current.feels_like)}°C
        </div>
      </div>
    </main>
  );
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState([]);
  console.log(weather);
  console.log(location);

  const getWeather = ({ lat, lng }) => {
    const weather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=alerts,minutely&units=metric&appid=${OPENWEATHER_API_KEY}`;
    fetch(weather)
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error:", error));
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <div className="app">
      <Title />
      <Search getWeather={getWeather} setLocation={setLocation} />
      {weather.current ? (
        <ShowWeather weather={weather} location={location} />
      ) : null}
    </div>
  );
};

export default App;
