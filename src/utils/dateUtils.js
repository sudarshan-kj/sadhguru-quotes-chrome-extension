export const getCurrentTimeZoneAbbrevation = () => {
  const now = new Date();
  let tzString = now.toString().split("(")[1].split(")")[0];
  if (tzString.length > 5) {
    tzString = tzString
      .split(/\s/)
      .reduce((response, word) => (response += word.slice(0, 1)), "");
  }
  return tzString;
};

export const formatTo12Hour = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours %= 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  const strTime = `${hours}:${minutes} ${ampm}`;

  return strTime;
};
