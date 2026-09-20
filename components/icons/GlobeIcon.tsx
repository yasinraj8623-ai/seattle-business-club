import React from "react";

export const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
        stroke="#5B9CFF"
        strokeOpacity={0.5}
      />
      <path
        d="M5 8.00004C5 12 8 14.6667 8 14.6667C8 14.6667 11 12 11 8.00004C11 4.00004 8 1.33337 8 1.33337C8 1.33337 5 4.00004 5 8.00004Z"
        stroke="#5B9CFF"
        strokeOpacity={0.5}
        strokeLinejoin="round"
      />
      <path d="M14.6668 8H1.3335" stroke="#5B9CFF" strokeOpacity={0.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default GlobeIcon;
