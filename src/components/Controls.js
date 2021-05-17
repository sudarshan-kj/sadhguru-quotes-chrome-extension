import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Random } from "../assets/icons/randomIcon.svg";
import { ReactComponent as Today } from "../assets/icons/todayIcon.svg";
import classNames from "classnames";
import "./Controls.css";
import { useTheme } from "styled-components";

const Controls = ({ randomQuoteDate, onRandomClick, onTodaysQuoteClick }) => {
  const [disableTodaysQuoteButton, setDisableTodaysQuoteButton] =
    useState(false);
  const theme = useTheme();

  const checkIfTodaysQuote = useCallback(() => {
    const today = new Date();
    const nextTriggerDate = new Date(randomQuoteDate);
    nextTriggerDate.setHours(nextTriggerDate.getHours() + 24);
    return today < nextTriggerDate;
  }, [randomQuoteDate]);

  useEffect(() => {
    checkIfTodaysQuote()
      ? setDisableTodaysQuoteButton(true)
      : setDisableTodaysQuoteButton(false);
  }, [checkIfTodaysQuote]);

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
          disableTodaysQuoteButton,
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
