import { useState, useEffect } from "react";
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

const Locate = ({ getLocation, getWeather }) => {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            getLocation({ lat, lng });
            getWeather({ lat, lng });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
};

const ShowWeather = ({ weather, location }) => {
  const weatherDescription = weather.current.weather[0].description.replace(
    /(^\w{1})|(\s+\w{1})/g,
    (letter) => letter.toUpperCase()
  );

  return (
    <main>
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
          <div className="temp">{Math.round(weather.current.temp)}°C</div>
        </div>
        <div className="feels-like">
          Feels like {Math.round(weather.current.feels_like)}°C
        </div>
      </div>
    </main>
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

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState([]);

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
    <div className="app">
      <Title />
      <Search getWeather={getWeather} setLocation={setLocation} />
      <Locate getLocation={getLocation} getWeather={getWeather} />
      {weather.current ? (
        <ShowWeather weather={weather} location={location} />
      ) : null}
    </div>
  );
};

export default App;
