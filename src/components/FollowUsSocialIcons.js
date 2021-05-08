import React from "react";
import "./FollowUsSocialIcons.css";
import { ReactComponent as FacebookIcon } from "../assets/icons/facebookIcon.svg";
import { ReactComponent as InstagramIcon } from "../assets/icons/instagramIcon.svg";
import { ReactComponent as TwitterIcon } from "../assets/icons/twitterIcon.svg";
import { ReactComponent as YoutubeIcon } from "../assets/icons/youtubeIcon.svg";

const FollowUsSocialIcons = () => (
  <div className="socialIcons">
    <a href="https://twitter.com/SadhguruJV" target="_blank" rel="noreferrer">
      <TwitterIcon />
    </a>
    <a
      href="https://www.facebook.com/sadhguru/"
      target="_blank"
      rel="noreferrer"
    >
      <FacebookIcon />
    </a>
    <a
      href="https://www.youtube.com/user/sadhguru"
      target="_blank"
      rel="noreferrer"
    >
      <YoutubeIcon />
    </a>
    <a
      href="https://www.instagram.com/sadhguru"
      target="_blank"
      rel="noreferrer"
    >
      <InstagramIcon />
    </a>
  </div>
);

export default FollowUsSocialIcons;
