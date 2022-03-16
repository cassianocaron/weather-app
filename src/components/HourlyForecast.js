import { add } from "date-fns";

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

export default HourlyForecast;
