import React from "react";
export const ScrollAnimation = React.forwardRef(
  (props: {}, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className="scroll-nav">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    );
  }
);
