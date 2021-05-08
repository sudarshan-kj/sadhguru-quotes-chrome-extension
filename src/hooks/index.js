import { useState, useEffect } from "react";
import { getFromLocalCache, setToLocalCache } from "../utils/localstorage";

export const useSemiPersistentState = (key, initState) => {
  const [value, setValue] = useState(getFromLocalCache(key) || initState);
  useEffect(() => {
    setToLocalCache(key, value);
  }, [key, value]);

  return [value, setValue];
};
