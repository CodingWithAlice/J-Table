import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";

export default function LtnTable() {
    let [data, setData] = useState([]);
    useEffect(() => {
        LtnApi.list().then((data) => {
            console.log(data);
            setData(data);
        });
    }, [])
    return <div>Table</div>
}