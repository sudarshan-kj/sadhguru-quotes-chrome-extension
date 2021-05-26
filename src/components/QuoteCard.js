import React, { useState } from "react";
import { ReactComponent as SGSignature } from "assets/icons/sadhguruSignature.svg";
import SadhguruDefaultImage from "assets/sadhguru.jpg";
import "./QuoteCard.css";
import classNames from "classnames";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const QuoteCard = ({ publishedDate, quoteImage, children }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <div className="quoteCard">
      <div className="imageContainer">
        <img
          src={quoteImage}
          className={classNames("sg-image", { hidden: isImageLoading })}
          alt="Sadhguru"
          onLoad={() => setIsImageLoading(false)}
          onError={(e) => {
            e.target.src = SadhguruDefaultImage;
          }}
        />
        <div
          className={classNames("loadingImageSpinner", {
            imageSpinnerHidden: !isImageLoading,
          })}
        >
          <Loader
            type="Circles"
            color="#7e756d"
            height={30}
            width={30}
            timeout={10000}
          />
        </div>
      </div>
      <p className="quoteDate">{publishedDate}</p>
      <div className="quoteTextContainer">
        <p className="quoteText">{children}</p>
      </div>
      <div className="signatureContainer">
        <SGSignature className="signature" />
      </div>
    </div>
  );
};

export default QuoteCard;
