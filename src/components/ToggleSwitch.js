import React, { useEffect, useRef, useState } from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = React.memo(
  ({ variant, callback, initState, updateState }) => {
    const [checked, setChecked] = useState(initState);
    const handleChecked = (e) => {
      setChecked(e.target.checked);
    };
    const switchRef = useRef(true);

    useEffect(() => {
      /*This effect is to be run only when the init state changes ( ideally when the user installs for the first time, and the init value is "".
    In that case we check what the user preference for the theme is, and then set the state )*/
      setChecked(initState);
    }, [updateState]);

    useEffect(() => {
      if (switchRef.current) {
        switchRef.current = false;
        return;
      }
      callback(checked);
    }, [checked, callback]);

    return (
      <div className={`toggle ${variant}`}>
        <input
          id={variant}
          onChange={handleChecked}
          checked={checked}
          type="checkbox"
        />
        <label className="toggle-item" htmlFor={variant}>
          <div className="check" />
        </label>
      </div>
    );
  }
);

export default ToggleSwitch;
