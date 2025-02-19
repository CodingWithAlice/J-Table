import { useCallback, useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";
import Filter from "./Filter";
import TimeModal from "./TimeModal";
import AddLtn from "./AddLtn";
import { message } from "antd";

export default function LtnTable() {
    let [ltns, setLtns] = useState([]);
    const [tempParams, setTempParams] = useState({
        start: undefined,
        end: undefined
    });

    const init = useCallback((params) => {
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
        {Object.keys(ltns).map(ltnType => <>
            {!!ltns[ltnType].length && <div key={ltnType}>
                <h2 className="ltn-box">BOX{ltnType}</h2>
                <LtnList list={ltns[ltnType]} boxId={ltnType} fresh={init} />
            </div>}
        </>)}
        <Filter fresh={init} initValue={tempParams} />
        <TimeModal />
        <AddLtn fresh={init} />
    </div>
}