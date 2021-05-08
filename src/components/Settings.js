import React from "react";
import styles from "./Settings.module.css";
import { ReactComponent as SettingsIcon } from "../assets/icons/settingsIcon.svg";
import { ReactComponent as RandomIcon } from "../assets/icons/randomIcon.svg";
import { ReactComponent as NightModeIcon } from "../assets/icons/nightModeIcon.svg";

const Settings = ({ onToggleRandomQuoteOnNewTab, onToggleTheme }) => (
  <div className={styles.dropup}>
    <button className={styles.dropbtn}>
      <SettingsIcon />
    </button>
    <div className={styles.dropupContent}>
      <div
        onClick={onToggleRandomQuoteOnNewTab}
        className={styles.menuContentWrapper}
      >
        <RandomIcon className={styles.randomMenuIcon} />
        <span>Random Quote on New Tab</span>
      </div>
      <div onClick={onToggleTheme} className={styles.menuContentWrapper}>
        <NightModeIcon className={styles.darkModeMenuIcon} />
        <span>Dark Mode</span>
      </div>
    </div>
  </div>
);

export default Settings;
