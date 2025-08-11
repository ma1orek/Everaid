import svgPaths from "./svg-w4xzugruwz";

function Cardiology() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="cardiology">
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

function Frame() {
  return (
    <div
      className="absolute left-1/2 overflow-clip size-6 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Frame"
    >
      <Cardiology />
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="absolute bg-[#131314] left-[11px] overflow-clip rounded-[30px] size-10 top-[154px]"
      data-name="Frame"
    >
      <Frame />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ff6265] text-[10px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">EMERGENCY</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#8f8f8f] text-[10px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">~10 MIN</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute box-border content-stretch flex flex-row gap-[5px] items-center justify-start left-[11px] p-0 top-[95px]">
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#131314] box-border content-stretch flex flex-row gap-1.5 h-10 items-center justify-center left-[58px] px-3.5 py-3 rounded-[20px] top-[154px] w-[122px]">
      <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Stop Bleeding
        </p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div
      className="bg-[#1e1f20] h-[214px] overflow-clip relative rounded-[20px] shrink-0 w-[190px]"
      data-name="Frame"
    >
      <div className="absolute font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] left-[11px] text-[#ffffff] text-[16px] text-left top-[19px] w-[207px]">
        <p className="block leading-[normal]">Bleeding Control</p>
      </div>
      <div className="absolute font-['REM:Light',_sans-serif] font-light leading-[0] left-[11px] text-[#dcdcdc] text-[13px] text-left top-[51px] w-[175px]">
        <p className="block leading-[normal]">
          Stop heavy bleeding fast until help arrives.
        </p>
      </div>
      <Frame1 />
      <Frame11 />
      <Frame5 />
    </div>
  );
}

function AutoLayoutHorizontal() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Auto Layout Horizontal"
    >
      <Frame2 />
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

function Frame3() {
  return (
    <div
      className="absolute left-1/2 overflow-clip size-6 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Frame"
    >
      <Explore />
    </div>
  );
}

function Frame14() {
  return (
    <div
      className="absolute bg-[#131314] left-[11px] overflow-clip rounded-[30px] size-10 top-[154px]"
      data-name="Frame"
    >
      <Frame3 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffb162] text-[10px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">WARNING</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#8f8f8f] text-[10px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">~15 MIN</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute box-border content-stretch flex flex-row gap-[5px] items-center justify-start left-[11px] p-0 top-[95px]">
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute bg-[#131314] box-border content-stretch flex flex-row gap-1.5 h-10 items-center justify-center left-[58px] px-3.5 py-3 rounded-[20px] top-[154px] w-[122px]">
      <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Build Shelter
        </p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div
      className="bg-[#1e1f20] h-[214px] overflow-clip relative rounded-[20px] shrink-0 w-[190px]"
      data-name="Frame"
    >
      <div className="absolute font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] left-[11px] text-[#ffffff] text-[16px] text-left text-nowrap top-[19px]">
        <p className="block leading-[normal] whitespace-pre">
          Wind Shelter Basics
        </p>
      </div>
      <div className="absolute font-['REM:Light',_sans-serif] font-light leading-[0] left-[11px] text-[#dcdcdc] text-[13px] text-left top-[51px] w-[169px]">
        <p className="block leading-[normal]">
          A-frame tarp shelter when the wind rips your tent.
        </p>
      </div>
      <Frame14 />
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function AutoLayoutHorizontal1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Auto Layout Horizontal"
    >
      <Frame19 />
    </div>
  );
}

function Build() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="build">
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

function Frame20() {
  return (
    <div
      className="absolute left-1/2 overflow-clip size-6 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Frame"
    >
      <Build />
    </div>
  );
}

function Frame21() {
  return (
    <div
      className="absolute bg-[#131314] left-[11px] overflow-clip rounded-[30px] size-10 top-[154px]"
      data-name="Frame"
    >
      <Frame20 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#8f8f8f] text-[10px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">INFO</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#8f8f8f] text-[10px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">~12 MIN</p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute box-border content-stretch flex flex-row gap-[5px] items-center justify-start left-[11px] p-0 top-[95px]">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute bg-[#131314] box-border content-stretch flex flex-row gap-1.5 h-10 items-center justify-center left-[58px] px-3.5 py-3 rounded-[20px] top-[154px] w-[122px]">
      <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Change Wheel
        </p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div
      className="bg-[#1e1f20] h-[214px] overflow-clip relative rounded-[20px] shrink-0 w-[190px]"
      data-name="Frame"
    >
      <div className="absolute font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] left-[11px] text-[#ffffff] text-[16px] text-left text-nowrap top-[19px]">
        <p className="block leading-[normal] whitespace-pre">Flat Tire Kit</p>
      </div>
      <div className="absolute font-['REM:Light',_sans-serif] font-light leading-[0] left-[11px] text-[#dcdcdc] text-[13px] text-left top-[51px] w-[158px]">
        <p className="block leading-[normal]">Safe roadside wheel change.</p>
      </div>
      <Frame21 />
      <Frame24 />
      <Frame25 />
    </div>
  );
}

function AutoLayoutHorizontal2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Auto Layout Horizontal"
    >
      <Frame26 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="[flex-flow:wrap] absolute box-border content-start flex gap-4 items-start justify-start left-4 p-0 top-[333px] w-[396px]">
      <AutoLayoutHorizontal />
      <AutoLayoutHorizontal1 />
      <AutoLayoutHorizontal2 />
      <AutoLayoutHorizontal1 />
      <AutoLayoutHorizontal1 />
      <AutoLayoutHorizontal2 />
    </div>
  );
}

function Frame48() {
  return (
    <div
      className="absolute bg-[#1e1f20] box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-4 overflow-clip px-5 py-[19px] rounded-[40px] top-[838px] w-[396px]"
      data-name="Frame"
    >
      <div className="font-['REM:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#dcdcdc] text-[16px] text-left text-nowrap tracking-[1px]">
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Ask EverAid
        </p>
      </div>
    </div>
  );
}

function Favorite() {
  return (
    <div
      className="[grid-area:1_/_1] h-6 ml-0 mt-[3px] relative w-[11px]"
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

function AutoLayoutHorizontal6() {
  return (
    <div
      className="[grid-area:1_/_1] box-border content-stretch flex flex-row gap-2.5 items-center justify-start ml-[11px] mt-0 p-0 relative"
      data-name="Auto Layout Horizontal"
    >
      <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[24px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">EverAid</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Favorite />
      <AutoLayoutHorizontal6 />
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-6" data-name="settings">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="settings">
          <mask
            height="24"
            id="mask0_14_1293"
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
          <g mask="url(#mask0_14_1293)">
            <path
              d={svgPaths.p25a1e100}
              fill="var(--fill-0, #8F8F8F)"
              id="settings_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Add2() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="add_2">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="add_2">
          <mask
            height="24"
            id="mask0_14_1289"
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
          <g mask="url(#mask0_14_1289)">
            <path
              d={svgPaths.p3ad56700}
              fill="var(--fill-0, white)"
              id="add_2_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame49() {
  return (
    <div
      className="absolute left-1/2 overflow-clip size-6 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Frame"
    >
      <Add2 />
    </div>
  );
}

function Frame50() {
  return (
    <div
      className="bg-[#1e1f20] overflow-clip relative rounded-[30px] shrink-0 size-10"
      data-name="Frame"
    >
      <Frame49 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="box-border content-stretch flex flex-row gap-3 items-center justify-end p-0 relative shrink-0 w-24">
      <Settings />
      <Frame50 />
    </div>
  );
}

function AutoLayoutHorizontal7() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-[394px]"
      data-name="Auto Layout Horizontal"
    >
      <Group1 />
      <Frame13 />
    </div>
  );
}

function AutoLayoutHorizontal8() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-4 p-0 top-[60px] w-[394px]"
      data-name="Auto Layout Horizontal"
    >
      <AutoLayoutHorizontal7 />
    </div>
  );
}

function Network() {
  return (
    <div
      className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[16.18%] place-items-start relative"
      data-name="Network"
    >
      <div className="[grid-area:1_/_1] bg-[#dcdcdc] h-[3.916px] ml-0 mt-[5.874px] w-[2.639px]" />
      <div className="[grid-area:1_/_1] bg-[#dcdcdc] h-[5.875px] ml-[4.398px] mt-[3.915px] w-[2.639px]" />
      <div className="[grid-area:1_/_1] bg-[#dcdcdc] h-[7.833px] ml-[8.796px] mt-[1.959px] w-[2.639px]" />
      <div className="[grid-area:1_/_1] bg-[#dcdcdc] h-[9.791px] ml-[13.195px] mt-0 opacity-30 w-[2.639px]" />
    </div>
  );
}

function BatteryNormal() {
  return (
    <div
      className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[16.18%] place-items-start relative"
      data-name="Battery Normal"
    >
      <div className="[grid-area:1_/_1] h-[9.791px] ml-0 mt-0 relative rounded-[2.5px] w-[20.833px]">
        <div
          aria-hidden="true"
          className="absolute border-[#dcdcdc] border-[0.833px] border-solid inset-0 pointer-events-none rounded-[2.5px]"
        />
      </div>
      <div className="[grid-area:1_/_1] bg-[#dcdcdc] h-[6.778px] ml-[1.667px] mt-[1.506px] rounded-[0.833px] w-2.5" />
      <div className="[grid-area:1_/_1] bg-[#dcdcdc] h-[3.766px] ml-[21.667px] mt-[3.012px] rounded-[3.333px] w-[1.667px]" />
    </div>
  );
}

function Group() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Group"
    >
      <div className="[grid-area:1_/_1] font-['Work_Sans:SemiBold',_sans-serif] font-semibold h-[14.385px] ml-[20.828px] mt-0 relative text-[#dcdcdc] text-[12.5px] text-left w-[21.097px]">
        <p className="block leading-[normal]">5G</p>
      </div>
      <Network />
      <BatteryNormal />
    </div>
  );
}

function ColorBlack() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row h-[46px] items-center justify-between leading-[0] left-1/2 px-4 py-[15px] top-0 translate-x-[-50%] w-[428px]"
      data-name="Color=Black"
    >
      <div className="font-['Work_Sans:SemiBold',_sans-serif] font-semibold h-[16.303px] relative shrink-0 text-[#dcdcdc] text-[14.525px] text-left w-[41.236px]">
        <p className="block leading-[normal]">08:34</p>
      </div>
      <Group />
    </div>
  );
}

function Cardiology1() {
  return (
    <div className="relative shrink-0 size-4" data-name="cardiology">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="cardiology">
          <mask
            height="16"
            id="mask0_1_243"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="16"
            x="0"
            y="0"
          >
            <rect
              fill="var(--fill-0, #D9D9D9)"
              height="16"
              id="Bounding box"
              width="16"
            />
          </mask>
          <g mask="url(#mask0_1_243)">
            <path
              d={svgPaths.p7928780}
              fill="var(--fill-0, #34C759)"
              id="cardiology_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#1e1f20] box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3.5 py-3 relative rounded-[20px] shrink-0">
      <Cardiology1 />
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Health
        </p>
      </div>
    </div>
  );
}

function Explore3() {
  return (
    <div className="relative shrink-0 size-4" data-name="explore">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="explore">
          <mask
            height="16"
            id="mask0_1_223"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="16"
            x="0"
            y="0"
          >
            <rect
              fill="var(--fill-0, #D9D9D9)"
              height="16"
              id="Bounding box"
              width="16"
            />
          </mask>
          <g mask="url(#mask0_1_223)">
            <path
              d={svgPaths.p1fcb4b80}
              fill="var(--fill-0, #FF9F0A)"
              id="explore_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame51() {
  return (
    <div className="bg-[#1e1f20] box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3.5 py-3 relative rounded-[20px] shrink-0">
      <Explore3 />
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Survive
        </p>
      </div>
    </div>
  );
}

function Build2() {
  return (
    <div className="relative shrink-0 size-4" data-name="build">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="build">
          <mask
            height="16"
            id="mask0_1_215"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="16"
            x="0"
            y="0"
          >
            <rect
              fill="var(--fill-0, #D9D9D9)"
              height="16"
              id="Bounding box"
              width="16"
            />
          </mask>
          <g mask="url(#mask0_1_215)">
            <path
              d={svgPaths.p3072b700}
              fill="var(--fill-0, #0A84FF)"
              id="build_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#1e1f20] box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3.5 py-3 relative rounded-[20px] shrink-0">
      <Build2 />
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Fix
        </p>
      </div>
    </div>
  );
}

function ChatBubble() {
  return (
    <div className="relative shrink-0 size-4" data-name="chat_bubble">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="chat_bubble">
          <mask
            height="16"
            id="mask0_1_219"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="16"
            x="0"
            y="0"
          >
            <rect
              fill="var(--fill-0, #D9D9D9)"
              height="16"
              id="Bounding box"
              width="16"
            />
          </mask>
          <g mask="url(#mask0_1_219)">
            <path
              d={svgPaths.p32cee580}
              fill="var(--fill-0, #8F8F8F)"
              id="chat_bubble_2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#1e1f20] box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3.5 py-3 relative rounded-[20px] shrink-0">
      <ChatBubble />
      <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#8f8f8f] text-[16px] text-center text-nowrap tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
          Speak
        </p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute box-border content-stretch flex flex-row gap-2 items-center justify-start left-[15px] p-0 top-[269px]">
      <Frame4 />
      <Frame51 />
      <Frame6 />
      <Frame7 />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#131314] relative size-full" data-name="Dashboard">
      <Frame12 />
      <div className="absolute bg-gradient-to-b from-[#13131400] from-[3.049%] h-[191px] left-[-4px] to-[#131314] to-[73.819%] top-[732px] w-[434px]" />
      <Frame48 />
      <div className="absolute font-['Product_Sans:Bold',_sans-serif] leading-[0] left-[15px] not-italic text-[#ffffff] text-[0px] text-left top-[114px] tracking-[-1px] w-[373px]">
        <p className="font-['REM:Bold',_sans-serif] font-bold text-[36px]">
          <span className="leading-[51px]">{`How can I help `}</span>
          <span className="adjustLetterSpacing leading-[42px]">you today?</span>
        </p>
      </div>
      <div className="absolute font-['REM:Regular',_sans-serif] font-normal leading-[0] left-[15px] text-[#b5b6ba] text-[16px] text-left text-nowrap top-[217px] tracking-[-1px]">
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Pick a pack or tap “Ask EverAid”
        </p>
      </div>
      <AutoLayoutHorizontal8 />
      <ColorBlack />
      <Frame8 />
    </div>
  );
}