import React from "react";
import "../css/ToggleSwitch.css";

const ToggleSwitch = ({ label }) => {
  return (
    <div className="container">
      {label} <br />
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" name={label} id={label} />
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;

{
  /* <React.Fragment>
          <ToggleSwitch label="Pause at the end of a chapter" />
          <br />
          <ToggleSwitch label="Save progress" />
        </React.Fragment> */
}

{
  /* <div className="toggle-switch">
  <input
    type="checkbox"
    className="checkbox"
    name="stop"
    id="stop"
    value={stop}
    onChange={this.setState({ stop: !stop })}
  />
  <label className="label" htmlFor="stop">
    <span className="inner" />
    <span className="switch" />
  </label>
</div>; */
}
