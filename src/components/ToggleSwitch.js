import React, { useEffect, useRef, useState } from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = React.memo(({ callback, initState }) => {
  const [checked, setChecked] = useState(initState);
  const handleChecked = (e) => {
    setChecked(e.target.checked);
  };
  const switchRef = useRef(true);

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current = false;
      return;
    }
    callback(checked);
  }, [checked, callback]);

  return (
    <div className="toggle checkcross">
      <input
        id="checkcross"
        checked={checked}
        onChange={handleChecked}
        type="checkbox"
      />
      <label className="toggle-item" htmlFor="checkcross">
        <div className="check" />
      </label>
    </div>
  );
});

export default ToggleSwitch;
