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

export default Locate;
