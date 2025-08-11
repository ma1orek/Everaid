import svgPaths from "./svg-4binxeigtk";

export default function Send() {
  return (
    <div className="relative size-full" data-name="send">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g clipPath="url(#clip0_23_277)" id="send">
          <mask
            height="24"
            id="mask0_23_277"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="24"
            x="0"
            y="0"
          >
            <rect
              fill="var(--fill-0, #D9D9D9)"
              height="24"
              id="Bounding box"
              width="24"
            />
          </mask>
          <g mask="url(#mask0_23_277)">
            <path
              d={svgPaths.pa41fe00}
              fill="var(--fill-0, white)"
              id="send_2"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_23_277">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}