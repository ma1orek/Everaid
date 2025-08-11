import svgPaths from "./svg-5e8cyo2buz";

function Favorite() {
  return (
    <div
      className="absolute h-6 left-0 top-[3px] w-[11px]"
      data-name="favorite"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 24"
      >
        <g id="favorite">
          <mask
            height="24"
            id="mask0_1_311"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="11"
            x="0"
            y="0"
          >
            <rect
              fill="var(--fill-0, #D9D9D9)"
              height="24"
              id="Bounding box"
              width="11"
            />
          </mask>
          <g mask="url(#mask0_1_311)">
            <path
              d={svgPaths.p1973f3f0}
              fill="var(--fill-0, #FF6265)"
              id="favorite_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function AutoLayoutHorizontal() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-[11px] p-0 top-0"
      data-name="Auto Layout Horizontal"
    >
      <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[24px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">EverAid</p>
      </div>
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <Favorite />
      <AutoLayoutHorizontal />
    </div>
  );
}