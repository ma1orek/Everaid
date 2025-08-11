import svgPaths from "./svg-m6k9b6aftp";

function Build() {
  return (
    <div className="absolute left-0 size-6 top-[38px]" data-name="build">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="build">
          <mask
            height="24"
            id="mask0_1_235"
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
          <g mask="url(#mask0_1_235)">
            <path
              d={svgPaths.p15a55000}
              fill="var(--fill-0, #0A84FF)"
              id="build_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ChatBubble() {
  return (
    <div className="absolute left-0 size-6 top-[114px]" data-name="chat_bubble">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chat_bubble">
          <mask
            height="24"
            id="mask0_20_366"
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
          <g mask="url(#mask0_20_366)">
            <path
              d={svgPaths.p38662800}
              fill="var(--fill-0, #00C7BE)"
              id="chat_bubble_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Cardiology() {
  return (
    <div className="absolute left-0 size-6 top-[76px]" data-name="cardiology">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="cardiology">
          <mask
            height="24"
            id="mask0_14_1297"
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
          <g mask="url(#mask0_14_1297)">
            <path
              d={svgPaths.p3e47f400}
              fill="var(--fill-0, #34C759)"
              id="cardiology_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Explore() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="explore">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="explore">
          <mask
            height="24"
            id="mask0_1_239"
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
          <g mask="url(#mask0_1_239)">
            <path
              d={svgPaths.p2ada3880}
              fill="var(--fill-0, #FF9F0A)"
              id="explore_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Frame14() {
  return (
    <div className="relative size-full">
      <Build />
      <ChatBubble />
      <Cardiology />
      <Explore />
    </div>
  );
}