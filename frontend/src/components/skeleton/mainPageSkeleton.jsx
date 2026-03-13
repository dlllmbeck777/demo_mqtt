import React from "react";
import "../../assets/styles/layouts/skeleton.scss";
const mainPageSkeleton = () => {
  return localStorage.getItem("token") ? (
    <div className="skeleton-container">
      <div className="skeleton-container__header">
        <div
          variant="circular"
          className="skeleton-container__header__avatar"
        ></div>
      </div>
    </div>
  ) : (
    <div className="skeleton-container"> </div>
  );
};

export default mainPageSkeleton;
