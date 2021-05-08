import React from "react";
import { ReactComponent as SGSignature } from "../assets/icons/sadhguruSignature.svg";
import SadhguruDefaultImage from "../assets/sadhguru.jpg";
import "./QuoteCard.css";
import { useTheme } from "styled-components";
import classNames from "classnames";

const QuoteCard = ({ publishedDate, quoteImage, children }) => {
  const theme = useTheme();
  return (
    <div className="quoteCard">
      <img
        src={quoteImage}
        className="sg-image"
        alt="Sadhguru"
        onError={(e) => {
          e.target.src = SadhguruDefaultImage;
        }}
      />
      <p className="quoteDate">{publishedDate}</p>
      <div className="quoteTextContainer">
        <p className="quoteText">{children}</p>
      </div>
      <div
        className={classNames(
          theme.isLight ? "signatureContainerLight" : "signatureContainerDark"
        )}
      >
        <SGSignature className="signature" />
      </div>
    </div>
  );
};

export default QuoteCard;
