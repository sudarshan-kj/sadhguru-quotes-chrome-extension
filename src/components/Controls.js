import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Random } from "assets/icons/randomIcon.svg";
import { ReactComponent as Today } from "assets/icons/todayIcon.svg";
import classNames from "classnames";
import "./Controls.css";

const Controls = ({
  onRandomClick,
  onTodaysQuoteClick,
  disableTodaysButtonInit = true,
}) => {
  const [disableTodaysQuoteButton, setDisableTodaysQuoteButton] = useState(
    disableTodaysButtonInit
  );
  return (
    <div className="controlsContainer">
      <div
        className="randomButton"
        onClick={() => {
          setDisableTodaysQuoteButton(false);
          onRandomClick();
        }}
      >
        <Random className="randomIcon" />
        <span>Random quote</span>
      </div>
      <div
        className={classNames("todayButton", {
          disabledColor: disableTodaysQuoteButton,
        })}
        onClick={() => {
          setDisableTodaysQuoteButton(true);
          onTodaysQuoteClick();
        }}
      >
        <Today className="todayIcon" />
        <span>Today's quote</span>
      </div>
    </div>
  );
};

export default Controls;
