import { Avatar } from "antd";

export default function LtnList({ list }) {
    console.log(list);

    return <div className="ltn-list">
        {list.map((it, index) => <div key={it.id} className="ltn-list-item">
            <Avatar className="avatar" size='small'>{index + 1}</Avatar>
            <p className="ltn-title">{it.title}</p>
        </div>)}
    </div>
}