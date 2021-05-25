import React from "react";
import styles from "./Settings.module.css";
import { ReactComponent as SettingsIcon } from "assets/icons/settingsIcon.svg";
import ToggleSwitch from "./ToggleSwitch";

const Settings = ({
  onToggleRandomQuoteOnNewTab,
  onToggleTheme,
  initState,
}) => (
  <div className={styles.dropup}>
    <button className={styles.dropbtn}>
      <SettingsIcon />
    </button>
    <div className={styles.dropupContent}>
      <div className={styles.menuContentWrapper}>
        <ToggleSwitch
          variant="plusandminus"
          callback={onToggleRandomQuoteOnNewTab}
          initState={initState.showRandomQuote}
          updateState={false}
        />
        <span>Random Quote on New Tab</span>
      </div>
      <div className={styles.menuContentWrapper}>
        <ToggleSwitch
          variant="darkandlight"
          callback={onToggleTheme}
          initState={initState.theme === "dark" ? true : false}
          updateState={initState.theme !== ""}
        />
        <span>Dark Mode</span>
      </div>
    </div>
  </div>
);

export default Settings;
