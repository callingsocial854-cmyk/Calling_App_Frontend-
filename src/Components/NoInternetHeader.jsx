import React from "react";
import { MdWifiOff } from "react-icons/md";

const NoInternetHeader = () => {
  return (
    <div className="no-internet-header">
      <MdWifiOff size={20} />
      <span>You are currently offline. Some features may not work.</span>
    </div>
  );
};

export default NoInternetHeader;
