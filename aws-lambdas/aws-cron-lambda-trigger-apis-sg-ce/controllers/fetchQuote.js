const logger = require("log4js").getLogger();
logger.level = "debug";
const { twitterSearchApi } = require("../utils/authAxios");

async function getQuotesFromTwitter() {
  const today = new Date();
  const startDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
  startDateTime.setMinutes(
    startDateTime.getMinutes() - startDateTime.getTimezoneOffset()
  );
  console.log("[ Start date search for twitter is ] => ", startDateTime);

  try {
    const response = await twitterSearchApi.get("", {
      params: {
        start_time: startDateTime,
        "tweet.fields": "author_id,created_at,public_metrics,source",
        expansions: "attachments.media_keys",
        "media.fields": "url,height,width",
      },
    });
    const mainData = response.data.data;
    const includes = response.data.includes.media;
    return mainData.map((element) => {
      const found = includes.find(
        (ele) => element.attachments.media_keys[0] === ele.media_key
      );

      const quoteText = element.text;
      const split = quoteText.replace(/\n/g, "").split("#SadhguruQuotes");
      const text = split[0].trim().replace(/#/g, "");
      const link = split[1].trim();

      const quoteObj = {
        quote: text,
        twitterLink: link,
        imageLink: found.url || "Not found",
        publishedDate: element.created_at,
      };
      return quoteObj;
    });
  } catch (error) {
    logger.error("Error occurred while contacting twitter api.", error);
  }
}

const checkIfValidFieldsExist = (quote) => {
  if (!quote.quote) {
    throw new Error("Quote data does not contian today's quote");
  }
  if (!quote.publishedDate || !Date.parse(quote.publishedDate)) {
    throw new Error(
      "Quote data does not contain published date / contains invalid date"
    );
  }
  if (!quote.imageLink) {
    throw new Error("Quote data does not contain image link");
  }
};

exports.fetchQuote = async () => {
  try {
    const quotes = await getQuotesFromTwitter();
    if (quotes) {
      let latestQuote = quotes[0];
      checkIfValidFieldsExist(latestQuote);
      logger.info(" [ Latest quote retrieved ] => ", latestQuote);
      return latestQuote;
    } else {
      logger.error("[ *** NO quotes could be fetched from twitter *** ]");
    }
  } catch (e) {
    logger.error("Something went wrong while fetching quotes from Twitter", e);
  }
};
