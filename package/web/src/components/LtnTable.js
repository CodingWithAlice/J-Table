import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";
import Filter from "./Filter";
import TimeModal from "./TimeModal";
import AddLtn from "./AddLtn";
import { message } from "antd";
import dayjs from "dayjs";

function getDataByLtns(data) {
    return Object.keys(data).map(it => {
        const ltns = data[it];
        const idDesc = ltns.length ? `
LTN${it} 【推荐做题时间 ${ltns[0].suggestTime} - ${ltns.length}题 实际做题时间： ？】
` : '';
        return idDesc + ltns.map(ltn => `${ltn.title}
`).join('');
    }).join('');
}

function getDataByDate(data) {
    let classifyByDate = {};
    Object.keys(data).forEach((it) => {
        const ltnData = data[it];
        ltnData.forEach(ltn => {
            // 添加推荐做题时间
            const suggestTime = dayjs(ltn.solveTime).add(ltn.boxId * 7, 'Day').format('MM-DD');
            const newOne = {
                ...ltn,
                suggestTime,
            }
            if(!classifyByDate[newOne.suggestTime]) {
                classifyByDate[newOne.suggestTime] = [];
            }
            // 按照推荐做题时间分类
            classifyByDate[newOne.suggestTime].push(newOne);
        })
    });
    let res = '';
    // 按照推荐做题时间排序
    const sortDate = Object.keys(classifyByDate).sort((a, b) => {
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1;
    })

    // 按照推荐做题时间分类
    sortDate.forEach(it => {
        let ltns = classifyByDate[it];
        let ltnsByBox = {};
        ltns.forEach(ltn => {
            let boxId = ltn.boxId;
            if(!ltnsByBox[boxId]) {
                ltnsByBox[boxId] = [];
            }
            // 按照BOX分类
            ltnsByBox[boxId].push(ltn);
        })
        res += getDataByLtns(ltnsByBox);
    });
    return res
}

const easyCopy = (data) => {
    const totalArr = Object.keys(data).reduce((pre, cur) => {
        const count = data[cur].length;
        pre.push(count);
        return pre;
    }, []);

    const dataByDate = getDataByDate(data);

    console.log('过滤后的数据data 按时间和 LTN 分类', totalArr, dataByDate);
}

export default function LtnTable() {
    let [ltns, setLtns] = useState([]);
    const [tempParams, setTempParams] = useState({
        start: undefined,
        end: undefined
    });

    const init = (params) => {
        setTempParams({
            start: params?.start,
            end: params?.end
        });
        let options = { ...tempParams, ...params }
        LtnApi.list(options).then((data) => {
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
        <Filter fresh={init} initValue={tempParams} />
        <TimeModal />
        <AddLtn fresh={init} />
    </div>
}