import dayjs from "dayjs";
import { LtnDTO, LtnsProps } from "../components/LtnTable";

/** 推荐做题时间 = 上次完成时间 + 间隔天数 */
export function getSuggestTime(ltn: LtnDTO) {
    return dayjs(ltn.solveTime || "2025-01-20").add(ltn.customDuration, "day");
}

export function flattenLtns(ltns: LtnsProps): LtnDTO[] {
    if (!ltns) return [];
    return Object.values(ltns).flat().filter(Boolean);
}

/**
 * 做题跳转顺序：推荐做题时间升序，相同时按 BOX（LTN）升序，再按题目 id。
 * 与后端 copy 导出的「按推荐做题时间 → LTN/BOX」分组一致。
 */
export function sortLtnsForPractice(list: LtnDTO[]): LtnDTO[] {
    return [...list].sort((a, b) => {
        const timeDiff = getSuggestTime(a).valueOf() - getSuggestTime(b).valueOf();
        if (timeDiff !== 0) return timeDiff;
        const boxDiff = (a.boxId ?? 0) - (b.boxId ?? 0);
        if (boxDiff !== 0) return boxDiff;
        return a.id - b.id;
    });
}

export function buildAnswerPath(
    ltn: LtnDTO,
    extra?: { lastStatus?: boolean; returnModal?: string | null; title?: string }
) {
    const sp = new URLSearchParams();
    sp.set("title", extra?.title ?? `【BOX${ltn.boxId}】${ltn.title}`);
    sp.set("placeholder", "请输入正确答案");
    if (extra?.lastStatus) sp.set("lastStatus", "1");
    if (extra?.returnModal) sp.set("returnModal", extra.returnModal);
    return `/answer/${ltn.id}?${sp.toString()}`;
}
