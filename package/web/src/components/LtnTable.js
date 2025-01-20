import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";

export default function LtnTable() {
    let [ltns, setLtns] = useState([]);
    const init = () => {
        LtnApi.list().then((data) => {
            setLtns(data);
        });
    }
    useEffect(() => {
        init();
    }, [])
    return <div className="ltn-wrapper">
        {Object.keys(ltns).map(ltnType => <>
            <h2 className="ltn-box">BOX{ltnType}</h2>
            <LtnList list={ltns[ltnType]} boxId={ltnType} fresh={init} />
        </>)}
    </div>
}