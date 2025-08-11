import centeredSvg from "../../imports/svg-centered";

export const CATEGORY_OPTIONS = [
  { value: "HEALTH", label: "Health", color: "#34C759", iconPath: centeredSvg.p7928780 },
  { value: "SURVIVE", label: "Survive", color: "#FF9F0A", iconPath: centeredSvg.p1fcb4b80 },
  { value: "FIX", label: "Fix", color: "#0A84FF", iconPath: centeredSvg.p3072b700 },
  { value: "SPEAK", label: "Speak", color: "#00C7BE", iconPath: centeredSvg.p32cee580 }
];

export const URGENCY_OPTIONS = [
  { value: "emergency", label: "Emergency", color: "#FF6265" },
  { value: "warning", label: "Warning", color: "#FFB162" },
  { value: "info", label: "Info", color: "#8F8F8F" }
];