import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import LtnList from "./LtnList";

export default function LtnTable() {
    let [ltns, setLtns] = useState([]);
    useEffect(() => {
        LtnApi.list().then((data) => {
            setLtns(data);
        });
    }, [])
    return <div className="ltn-table">
        {Object.keys(ltns).map(ltnType => <>
            <h2 className="box-id">BOX{ltnType}</h2>
            <LtnList list={ltns[ltnType]} boxId={ltnType} />
        </>)}
    </div>
}