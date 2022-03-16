import SwitchUnit from "./SwitchUnit";
import GetTime from "./GetTime";
import HourlyForecast from "./HourlyForecast";
import classNames from "classnames";

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
                key={i}
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

export default ShowWeather;
