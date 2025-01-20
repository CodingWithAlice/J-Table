import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";
import Filter from "./Filter";
import { message } from "antd";

export default function LtnTable() {
    let [ltns, setLtns] = useState([]);
    const init = (params) => {
        LtnApi.list(params).then((data) => {
            setLtns(data);
            message.success('数据加载成功');
        });
    }
    useEffect(() => {
        init();
    }, [])
    return <div className="ltn-wrapper">
        {Object.keys(ltns).map(ltnType => <div key={ltnType}>
            <h2 className="ltn-box">BOX{ltnType}</h2>
            <LtnList list={ltns[ltnType]} boxId={ltnType} fresh={init} />
        </div>)}
        <Filter fresh={init} />
    </div>
}