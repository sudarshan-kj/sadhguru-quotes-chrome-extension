import keys from "../utils/keys";
import { getFromLocalCache } from "../utils/localstorage";

export const clearCache = () => {
  const metaData = getFromLocalCache(keys.SG_QUOTES_METADATA_KEY);
  function clear() {
    console.log("< Clearing cache of old keys >");
    localStorage.removeItem(keys.QUOTE_KEY);
    localStorage.removeItem(keys.QUOTES_ARRAY_KEY);
    localStorage.removeItem(keys.TIMES_CLICKED_CACHE_KEY);
    localStorage.removeItem(keys.FETCH_RANDOM_QUOTE_KEY);
  }
  if (!metaData) {
    clear();
  }
};
