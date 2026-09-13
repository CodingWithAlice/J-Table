export const FLOAT_BTN_START = 24;
export const FLOAT_BTN_GAP = 70;

const DESKTOP_ORDER = ["filter", "timeline", "add", "today", "redo", "start", "coin"] as const;
const MOBILE_ORDER = ["filter", "add", "today", "start", "coin"] as const;

export type FloatBtnKey = (typeof DESKTOP_ORDER)[number];

export function getFloatBtnOffsets(isMobile: boolean): Record<FloatBtnKey, number> {
    const order = isMobile ? MOBILE_ORDER : DESKTOP_ORDER;
    const map = {} as Record<FloatBtnKey, number>;
    DESKTOP_ORDER.forEach((key) => {
        map[key] = FLOAT_BTN_START;
    });
    order.forEach((key, i) => {
        map[key] = FLOAT_BTN_START + i * FLOAT_BTN_GAP;
    });
    return map;
}
