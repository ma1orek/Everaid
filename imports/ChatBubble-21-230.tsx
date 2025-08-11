import svgPaths from "./svg-gdba4730d5";

export default function ChatBubble() {
  return (
    <div className="relative size-full" data-name="chat_bubble">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g clipPath="url(#clip0_20_402)" id="chat_bubble">
          <mask
            height="24"
            id="mask0_20_402"
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
          <g mask="url(#mask0_20_402)">
            <path
              d={svgPaths.p17325200}
              fill="var(--fill-0, #00C7BE)"
              id="chat_bubble_2"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_20_402">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}