import React from "react";
import { ReactComponent as RateUsIcon } from "assets/icons/rateUsIcon.svg";
import config from "../config";
import "./RateUs.css";
import classNames from "classnames";

const RateUs = ({ visible = false, showOnBottom = false, onClick }) => {
  return (
    <a
      className="rateUsLink"
      href={config.CHROME_EXT_URL}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
    >
      <div
        className={classNames("rateUsContainer", {
          hidden: !visible,
          rateUsBackground: showOnBottom,
          fixed: showOnBottom,
        })}
      >
        <RateUsIcon />
        <h2 className="rateUsText">Rate Us</h2>
      </div>
    </a>
  );
};

export default RateUs;
