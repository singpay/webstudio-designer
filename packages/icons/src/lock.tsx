import * as React from "react";
import { IconProps } from "./types";

export const LockOpened = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, forwardedRef) => {
    return (
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <g clipPath="url(#clip0_561_9202)">
          <rect width="8" height="9" transform="translate(0 0.5)" fill="none" />
          <path
            d="M4 0.5C3.24224 0.5 2.51551 0.80102 1.97969 1.33684C1.44388 1.87266 1.14286 2.59938 1.14286 3.35714V4.5C0.839753 4.5 0.549062 4.62041 0.334735 4.83474C0.120408 5.04906 0 5.33975 0 5.64286V8.5C0 8.8031 0.120408 9.09379 0.334735 9.30812C0.549062 9.52245 0.839753 9.64286 1.14286 9.64286H6.85714C7.16025 9.64286 7.45094 9.52245 7.66527 9.30812C7.87959 9.09379 8 8.8031 8 8.5V5.64286C8 5.33975 7.87959 5.04906 7.66527 4.83474C7.45094 4.62041 7.16025 4.5 6.85714 4.5H2.28571V3.35714C2.28557 2.9398 2.43768 2.53673 2.71352 2.22353C2.98936 1.91034 3.36998 1.70852 3.784 1.65594C4.19802 1.60335 4.61701 1.70361 4.96239 1.9379C5.30776 2.1722 5.5558 2.52444 5.66 2.92857C5.69789 3.07535 5.79253 3.20107 5.92311 3.27806C5.98777 3.31619 6.0593 3.3412 6.13362 3.35168C6.20795 3.36216 6.28361 3.3579 6.35629 3.33914C6.42896 3.32038 6.49723 3.28749 6.5572 3.24235C6.61717 3.1972 6.66765 3.14069 6.70578 3.07603C6.7439 3.01138 6.76892 2.93984 6.7794 2.86552C6.78988 2.7912 6.78562 2.71553 6.76686 2.64286C6.60831 2.02958 6.25053 1.48634 5.74972 1.09848C5.24891 0.710614 4.63344 0.500099 4 0.5V0.5Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_561_9202">
            <rect
              width="8"
              height="9"
              fill="none"
              transform="translate(0 0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }
);
LockOpened.displayName = "LockOpened";

export const LockClosed = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, forwardedRef) => {
    return (
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <g clipPath="url(#clip0_561_9202)">
          <rect width="8" height="9" transform="translate(0 0.5)" fill="none" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.14286 4.4375V3.3125C1.14286 2.56658 1.44388 1.85121 1.97969 1.32376C2.51551 0.796316 3.24224 0.5 4 0.5C4.75776 0.5 5.48449 0.796316 6.02031 1.32376C6.55612 1.85121 6.85714 2.56658 6.85714 3.3125V4.4375C7.16025 4.4375 7.45094 4.55603 7.66527 4.767C7.87959 4.97798 8 5.26413 8 5.5625V8.375C8 8.67337 7.87959 8.95952 7.66527 9.1705C7.45094 9.38147 7.16025 9.5 6.85714 9.5H1.14286C0.839753 9.5 0.549062 9.38147 0.334735 9.1705C0.120408 8.95952 0 8.67337 0 8.375V5.5625C0 5.26413 0.120408 4.97798 0.334735 4.767C0.549062 4.55603 0.839753 4.4375 1.14286 4.4375ZM5.71429 3.3125V4.4375H2.28571V3.3125C2.28571 2.86495 2.46633 2.43572 2.78782 2.11926C3.10931 1.80279 3.54534 1.625 4 1.625C4.45466 1.625 4.89069 1.80279 5.21218 2.11926C5.53367 2.43572 5.71429 2.86495 5.71429 3.3125Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_561_9202">
            <rect
              width="8"
              height="9"
              fill="none"
              transform="translate(0 0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }
);
LockClosed.displayName = "LockClosed";

export const lock = {
  normal: LockOpened,
  opened: LockOpened,
  closed: LockClosed,
};
