import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";
import Filter from "./Filter";
import TimeModal from "./TimeModal";
import AddLtn from "./AddLtn";
import { message } from "antd";

const easyCopy = (data) => {
    const totalArr = Object.keys(data).reduce((pre, cur) => {
        const count = data[cur].length;
        pre.push(count);
        return pre;
    }, [])
    console.log('过滤后的数据data', totalArr, Object.keys(data).map(it => {
        const ltns = data[it];
        const idDesc = ltns.length ? `LTN${it}
` : '';
        return idDesc + ltns.map(ltn => `${ltn.title}
`).join('');
    }).join(''));
}

export default function LtnTable() {
    let [ltns, setLtns] = useState([]);
    const init = (params) => {
        LtnApi.list(params).then((data) => {
            setLtns(data);
            easyCopy(data);
            message.success('刷新成功');
        });
    }
    useEffect(() => {
        init();
    }, [])
    return <div className="ltn-wrapper">
        {Object.keys(ltns).map(ltnType => <>
            {!!ltns[ltnType].length && <div key={ltnType}>
                <h2 className="ltn-box">BOX{ltnType}</h2>
                <LtnList list={ltns[ltnType]} boxId={ltnType} fresh={init} />
            </div>}
        </>)}
        <Filter fresh={init} />
        <TimeModal />
        <AddLtn fresh={init} />
    </div>
}