/*global chrome*/
import React, { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import QuoteCard from "./components/QuoteCard";
import ordinal from "date-and-time/plugin/ordinal";
import date from "date-and-time";
import authAxios from "./utils/auth";
import Controls from "./components/Controls";
import SideDrawer from "./components/SideDrawer";
import classNames from "classnames";
import ToggleSwitch from "./components/ToggleSwitch";
import { useSemiPersistentState } from "./hooks";
import keys from "./utils/keys";
import CryptoJS from "crypto-js";
import config from "./config";
import ErrorCodes from "./utils/errorCodes";
import {
  Toast,
  notifySuccess,
  notifyError,
  notifyWarn,
} from "./components/Toast";
import "react-toastify/dist/ReactToastify.css";
import { quoteReducer } from "./reducers";
import {
  quoteInitSeedData,
  quotesDataSeedData,
  quotesMetaDataSeedData,
} from "./utils/seedData";
import { getVersion } from "./utils/chromeUtils";
import Settings from "./components/Settings";
import SkewedDiagonal from "./components/SkewedDiagonal";

date.plugin(ordinal);
const datePattern = date.compile("MMMM DDD, YYYY");
// window.matchMedia("(prefers-color-scheme: dark)");
//The following variable is used to remove the transition fromt the .app div when the theme is being changed
let changingTheme = false;

function App() {
  const [quote, dispatchQuotes] = useReducer(quoteReducer, quoteInitSeedData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quotesData, setQuotesData] = useSemiPersistentState(
    keys.SG_QUOTES_DATA_KEY,
    quotesDataSeedData
  );
  const [quotesMetaData, setQuotesMetaData] = useSemiPersistentState(
    keys.SG_QUOTES_METADATA_KEY,
    quotesMetaDataSeedData
  );

  useEffect(() => {
    if (quotesMetaData.theme) {
      document.documentElement.setAttribute("data-theme", quotesMetaData.theme);
    } else {
      console.log("< Reading User Theme Preference >");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      let theme = prefersDark.matches ? "dark" : "light";
      setQuotesMetaData((prev) => {
        return {
          ...prev,
          theme,
        };
      });
    }
  }, [quotesMetaData.theme]);

  const decryptQuotesList = useCallback((quotesList) => {
    const encryptedQuotes = quotesList;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedQuotes,
        config.SG_PRIVATE_KEY
      );
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      console.log("< Check if a valid key is used >");
      triggerFetchFromServer();
      notifyError(
        `[${ErrorCodes.INVALID_KEY}] Try again in sometime. If issue persists please contact us.`
      );
      throw new Error("< Could not decrypt quotes >");
    }
  }, []);

  const getRandomQuote = (quotesList) => {
    const length = quotesList.length - 1;
    /* -1 because we do not want today's quote to be in the random quote set, and since 
    the latest quote is always the last quote, we discard generating a random number for the last quote*/
    const random = Math.floor(Math.random() * length);
    return quotesList[random];
  };

  const decryptAndDispatchRandomQuote = useCallback(() => {
    try {
      const quotes = decryptQuotesList(quotesData.list);
      const randomQuote = getRandomQuote(quotes);
      dispatchQuotes({ type: "SUCCESS", payload: randomQuote });
    } catch (e) {
      console.error("< Error while triggering disptach -> ", e);
    }
  }, [decryptQuotesList, quotesData.list]);

  const triggerDispatch = useCallback(() => {
    if (quotesMetaData.showRandomQuote) {
      console.log("< Retrieving a random quote from cache >");
      decryptAndDispatchRandomQuote();
    } else {
      console.log("< Retrieving latest quote from cache >");
      dispatchQuotes({ type: "SUCCESS", payload: quotesData.today });
    }
  }, [
    quotesMetaData.showRandomQuote,
    decryptAndDispatchRandomQuote,
    quotesData.today,
  ]);

  const handleToggleTheme = useCallback(
    (value) => {
      changingTheme = true;
      setTimeout(() => (changingTheme = false), 1000);
      const theme = value ? "dark" : "light";
      setQuotesMetaData((prev) => {
        return {
          ...prev,
          theme,
        };
      });
    },
    [setQuotesMetaData]
  );

  const handleToggleShowRandomQuote = useCallback(
    (value) => {
      setQuotesMetaData((prev) => {
        return {
          ...prev,
          showRandomQuote: value,
        };
      });
    },
    [setQuotesMetaData]
  );

  function triggerFetchFromServer() {
    console.log("< Triggering fetch from server >");
    dispatchQuotes({ type: "INIT_FETCH" });
  }

  useEffect(() => {
    const isOnline = navigator.onLine;
    (async () => {
      let { version } = await getVersion();
      setQuotesMetaData((prev) => {
        return { ...prev, version };
      });
    })();
    const today = new Date();
    if (quotesData.today.publishedDate) {
      const nextTriggerDate = new Date(quotesData.today.publishedDate);
      nextTriggerDate.setMinutes(
        nextTriggerDate.getMinutes() + config.ADD_MINS_TO_TRIGGER
      );
      //old quotes exist in local cache, but device is now offline. It caanot retrieve the latest quote, but it can as well show old quotes.
      if (!isOnline) {
        notifyWarn(
          `[${ErrorCodes.CLIENT_OFFLINE}] Unable to fetch a new quote since your device is not connected to the Internet`
        );
      }
      if (today.valueOf() <= nextTriggerDate.valueOf() || !isOnline) {
        //show either today's quote or a random quote.
        triggerDispatch();
        return;
      }
    } else {
      //no data exists in local cache. Here the app will not be able to show any stored data since there isn't any. Hence we dispatch an error.
      if (!isOnline) {
        notifyWarn(
          `[${ErrorCodes.CLIENT_OFFLINE}] Unable to fetch quotes since your device is not connected to the Internet`
        );
        dispatchQuotes({ type: "FAILED" });
        return;
      }
      console.log("< Local cache is empty / has invalid data >");
    }
    triggerFetchFromServer();
  }, []);

  useEffect(() => {
    if (quote.isLoading) {
      async function fetchQuotes() {
        try {
          console.log("< Fetching latest quote and random quotes from db >");
          const response = await authAxios.get("/quotes");
          const quoteData = response.data.data;
          const { fromCache } = response.data;
          if (fromCache === false) {
            console.log("< Triggering cache api >");
            authAxios.post("/cacheQuoteLocally").catch((e) => e);
          }
          const { randomQuotesList, ...today } = quoteData;
          console.log(
            "< Updated local cache with latest quote and random quotes >"
          );
          setQuotesData({
            today,
            list: randomQuotesList,
          });
          dispatchQuotes({ type: "SUCCESS", payload: today });
          notifySuccess("New quote added");
        } catch (e) {
          notifyError(
            `[${ErrorCodes.SERVER_FETCH_ERROR}] Server Error. If issue persists please contact us.`
          );
          console.error("Error is", e);
          dispatchQuotes({ type: "FAILED" });
        }
      }
      fetchQuotes();
    }
  }, [quote.isLoading, setQuotesData]);

  // useEffect(() => {
  //   chrome && chrome.topSites.get((r) => console.log(r));
  // }, []);

  const handleRandomClick = () => {
    setQuotesMetaData((prev) => {
      return {
        ...prev,
        clicks: { today: prev.clicks.today, random: prev.clicks.random + 1 },
      };
    });
    decryptAndDispatchRandomQuote();
  };

  const handleTodaysQuoteClick = () => {
    setQuotesMetaData((prev) => {
      return {
        ...prev,
        clicks: { today: prev.clicks.today + 1, random: prev.clicks.random },
      };
    });
    dispatchQuotes({ type: "SUCCESS", payload: quotesData.today });
  };

  const getPublishdedDate = () => {
    if (quote.isError) return "Infinity";
    if (quote.isLoading || !quote.publishedDate) return "Please wait...";
    const publishedDate = new Date(quote.publishedDate);
    const offset = publishedDate.getTimezoneOffset();
    publishedDate.setMinutes(publishedDate.getMinutes() + offset);
    return `${date.format(publishedDate, datePattern)}`;
  };

  const handleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, [setIsDrawerOpen]);

  return (
    <div>
      <SkewedDiagonal />
      <div className="mainContainer">
        {/* <ToggleSwitch
          callback={handleToggleTheme}
          initState={quotesMetaData.theme === "dark" ? true : false}
          updateState={quotesMetaData.theme !== ""}
        /> */}
        <div
          className={classNames("app", {
            shrink: isDrawerOpen,
            noTransition: changingTheme,
          })}
        >
          <QuoteCard
            key={quote.quote}
            publishedDate={getPublishdedDate()}
            quoteImage={quote.imageLink}
          >
            {(quote.isLoading || !quote.quote) && !quote.isError
              ? "Loading..."
              : quote.quote}
            {quote.isError && !quote.quote && "Something unpleasant occurred."}
          </QuoteCard>
          <Settings
            initState={quotesMetaData}
            onToggleTheme={handleToggleTheme}
            onToggleRandomQuoteOnNewTab={handleToggleShowRandomQuote}
          />
          <Controls
            randomQuoteDate={quote.publishedDate}
            onTodaysQuoteClick={handleTodaysQuoteClick}
            onRandomClick={handleRandomClick}
            metaData={quotesMetaData}
          />
          <SideDrawer
            version={quotesMetaData.version}
            isOpen={isDrawerOpen}
            handleDrawer={handleDrawer}
          />
          <Toast />
        </div>
      </div>
    </div>
  );
}

export default App;
