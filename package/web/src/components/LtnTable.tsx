import { useCallback, useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";
import FilterBtn from "./FilterBtn";
import TimeModalBtn from "./TimeModalBtn";
import AddLtnBtn from "./AddLtnBtn";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";
import TodayRecordBtn from "./TodayRecordBtn";

export interface TimeProps {
    start?: string,
    end?: string
}

export interface LtnDTO {
    id: number,
    title: string;
    source: number;
    boxId: number;
    solveTime: string;
    customDuration: number;
    levelId: number;
}

export interface LtnsProps {
    [key: string]: LtnDTO[]
}

type LtnsType = keyof LtnsProps

export default function LtnTable() {
    const [params, setParams] = useSearchParams();
    localStorage.setItem('type', params.get('type') || '');
    let [ltns, setLtns] = useState<LtnsProps>({});
    const [tempParams, setTempParams] = useState<TimeProps>({});

    const init = useCallback((params?: TimeProps) => {
        let options = { ...tempParams, ...params }
        if (options?.start !== tempParams.start || options?.end !== tempParams.end) {
            setTempParams({
                start: options?.start,
                end: options?.end
            });
        }

        LtnApi.list(options).then((data) => {
            setLtns(data);
            message.success('刷新成功');
        });
    }, [tempParams])

    useEffect(() => {
        init();
    }, [init])

    return <div className="ltn-wrapper">
        {Object.keys(ltns).map((ltnType: LtnsType) => <div key={ltnType}>
            {!!ltns[ltnType].length && <div key={ltnType}>
                <h2 className="ltn-box">BOX{ltnType}</h2>
                <LtnList list={ltns[ltnType]} boxId={+ltnType} fresh={init} />
            </div>}
        </div>)}
        {/* 过滤 */}
        <FilterBtn fresh={init} initValue={tempParams} />
        {/* 线轴 */}
        <TimeModalBtn />
         {/* 添加 */}
        <AddLtnBtn fresh={init} />
        {/* 今日做题记录 */}
        <TodayRecordBtn />
    </div>
}