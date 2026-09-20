import React from "react";

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <g opacity={0.5}>
        <path d="M4 6L8 10L12 6" stroke="#F5F4F0" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default ChevronDownIcon;
