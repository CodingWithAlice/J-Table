import { useCallback, useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";
import FilterBtn from "./FilterBtn";
import TimeModalBtn from "./TimeModalBtn";
import AddLtnBtn from "./AddLtnBtn";
import { useSearchParams } from "react-router-dom";
import TodayRecordBtn from "./TodayRecordBtn";
import DoitSecondBtn from "./DoitSecondBtn";
import CoinStatsBtn from "./CoinStatsBtn";

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
    const type = params.get('type');
    if (type) localStorage.setItem('type', type);
    let [ltns, setLtns] = useState<LtnsProps>({});
    const modal = params.get('modal'); // redoNextDay | minDateFilter
    const refreshKey = params.get('refresh') || '';

    const init = useCallback((params?: TimeProps) => {
        LtnApi.list(params).then((data) => {
            setLtns(data);
        });
    }, [])

    useEffect(() => {
        init();
    }, [init]);

    // 从做题页返回时带 refresh 参数，刷新首页列表
    useEffect(() => {
        if (refreshKey) {
            init();
        }
    }, [refreshKey, init]);

    const openModal = useCallback((nextModal: 'redoNextDay' | 'minDateFilter') => {
        const sp = new URLSearchParams(params);
        sp.set('modal', nextModal);
        sp.set('refresh', String(Date.now()));
        setParams(sp);
    }, [params, setParams]);

    const closeModal = useCallback(() => {
        const sp = new URLSearchParams(params);
        sp.delete('modal');
        sp.delete('refresh');
        setParams(sp);
    }, [params, setParams]);

    return <div className="ltn-wrapper">
        {Object.keys(ltns).map((ltnType: LtnsType) => <div key={ltnType}>
            {!!ltns[ltnType].length && <div key={ltnType}>
                <h2 className="ltn-box">BOX{ltnType}</h2>
                <LtnList list={ltns[ltnType]} boxId={+ltnType} fresh={init} />
            </div>}
        </div>)}
        {/* 过滤 */}
        <FilterBtn
            open={modal === 'minDateFilter'}
            refreshKey={refreshKey}
            onOpenChange={(open) => open ? openModal('minDateFilter') : closeModal()}
        />
        {/* 线轴 */}
        <TimeModalBtn />
         {/* 添加 */}
        <AddLtnBtn fresh={init} />
        {/* 今日做题记录 */}
        <TodayRecordBtn />
        {/* 隔天重做 */}
        <DoitSecondBtn
            open={modal === 'redoNextDay'}
            refreshKey={refreshKey}
            onOpenChange={(open) => open ? openModal('redoNextDay') : closeModal()}
        />
        {/* 金币统计 */}
        <CoinStatsBtn />
    </div>
}