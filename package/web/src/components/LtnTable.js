import { useEffect } from "react";
import { LtnApi } from "../apis/ltn";

export default function LtnTable() {
    useEffect(() => {
        LtnApi.list().then((data) => {
            console.log(data);
        });
    }, [])
    return <div>Table</div>
}