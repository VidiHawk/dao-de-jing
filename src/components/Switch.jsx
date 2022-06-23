import React from "react";
import "../css/Switch.css";

const Switch = ({ isOn, handleToggle, name }) => {
  return (
    <>
      <input
        name={name}
        checked={isOn}
        onChange={handleToggle}
        className="switch-checkbox"
        id={name}
        type="checkbox"
      />
      <label
        style={{ background: isOn && "#06D6A0" }}
        className="switch-label"
        htmlFor={name}
      >
        <span className={`switch-button`} />
      </label>
    </>
  );
};

export default Switch;
