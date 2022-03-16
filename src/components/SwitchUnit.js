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

export default SwitchUnit;
