import ip from "ip";

const config =
  process.env.NODE_ENV === "development"
    ? {
        API_ENDPOINT:
          "https://khu95sfrxj.execute-api.ap-south-1.amazonaws.com/dev",
        SG_PRIVATE_KEY: "$@dhGuRu",
        //24hr = 1440 + 15min(buffer)
        //Tweets are posted exactly at 2:45 GMT everyday, so we triggger an api call only after 3:00GMT the next day
        ADD_MINS_TO_TRIGGER: 1455,
      }
    : {
        API_ENDPOINT:
          "https://r8lrg0egw7.execute-api.ap-south-1.amazonaws.com/prod",
        SG_PRIVATE_KEY: "$@dhGuRu",
        //24hr = 1440 + 15min(buffer)
        //Tweets are posted exactly at 2:45 GMT everyday, so we triggger an api call only after 3:00GMT the next day
        ADD_MINS_TO_TRIGGER: 1455,
      };

export default config;
