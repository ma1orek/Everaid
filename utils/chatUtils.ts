import centeredSvg from "../imports/svg-centered";

export const getUmbrellaIcon = (umbrella?: string) => {
  switch (umbrella) {
    case 'HEALTH': return { path: centeredSvg.p7928780, color: '#34C759' };
    case 'SURVIVE': return { path: centeredSvg.p1fcb4b80, color: '#FF9F0A' };
    case 'FIX': return { path: centeredSvg.p3072b700, color: '#0A84FF' };
    case 'SPEAK': return { path: centeredSvg.p32cee580, color: '#00C7BE' };
    default: return { path: centeredSvg.p7928780, color: '#34C759' };
  }
};

export const getUrgencyColor = (urgency?: string) => {
  switch (urgency) {
    case 'emergency': return '#FF6265';
    case 'warning': return '#FFB162';
    case 'info': return '#8F8F8F';
    default: return '#8F8F8F';
  }
};