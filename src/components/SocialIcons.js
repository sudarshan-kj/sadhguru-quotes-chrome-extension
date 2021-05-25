import React from "react";
import "./SocialIcons.css";
import { ReactComponent as WhatsappIcon } from "assets/icons/whatsappIcon.svg";
import { ReactComponent as FacebookIcon } from "assets/icons/facebookIcon.svg";
import { ReactComponent as InstagramIcon } from "assets/icons/instagramIcon.svg";
import { ReactComponent as TwitterIcon } from "assets/icons/twitterIcon.svg";
import { ReactComponent as YoutubeIcon } from "assets/icons/youtubeIcon.svg";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
import config from "../config";

const QUOTE =
  "Install this free Chrome Extension to get a daily quote from Sadhguru on every new tab in your Chrome browser.";
const HASHTAGS = ["SadhguruQuotes", "SGQChromeExtension"];

export const FollowUsSocialIcons = () => (
  <div className="socialIcons">
    <a href="https://twitter.com/SadhguruJV" target="_blank" rel="noreferrer">
      <TwitterIcon className="iconDimensions" />
    </a>
    <a
      href="https://www.facebook.com/sadhguru/"
      target="_blank"
      rel="noreferrer"
    >
      <FacebookIcon className="iconDimensions" />
    </a>
    <a
      href="https://www.youtube.com/user/sadhguru"
      target="_blank"
      rel="noreferrer"
    >
      <YoutubeIcon className="iconDimensions" />
    </a>
    <a
      href="https://www.instagram.com/sadhguru"
      target="_blank"
      rel="noreferrer"
    >
      <InstagramIcon className="iconDimensions" />
    </a>
  </div>
);

export const ShareWithSocialIcons = () => {
  return (
    <div className="socialIcons justifySpaceEvenly">
      <TwitterShareButton
        url={config.CHROME_EXT_URL}
        title={QUOTE}
        hashtags={HASHTAGS}
      >
        <TwitterIcon className="iconDimensions" />
      </TwitterShareButton>
      <FacebookShareButton
        url={config.CHROME_EXT_URL}
        quote={QUOTE}
        hashtag={`#${HASHTAGS[0]}`}
      >
        <FacebookIcon className="iconDimensions" />
      </FacebookShareButton>
      <WhatsappShareButton url={config.CHROME_EXT_URL} title={QUOTE}>
        <WhatsappIcon className="iconDimensions" />
      </WhatsappShareButton>
    </div>
  );
};
