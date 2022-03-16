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

export default MapButton;
