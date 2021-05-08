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
    <>
      <label data-for="toggleSwitch" className="switch">
        <input type="checkbox" checked={checked} onChange={handleChecked} />
        <span className="slider round"></span>
      </label>
    </>
  );
});

export default ToggleSwitch;
