import React from "react";

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M3.39186 6.7046L15.7996 2.56869C16.8119 2.23123 17.7751 3.19439 17.4377 4.20679L13.3018 16.6145C12.9166 17.7699 11.2943 17.8031 10.8623 16.6643L9.00092 11.7569C8.8695 11.4104 8.59592 11.1368 8.2494 11.0054L3.34209 9.144C2.20329 8.71209 2.23639 7.08975 3.39186 6.7046Z"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.4233 9.58325L12.9233 7.08325" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default SendIcon;
