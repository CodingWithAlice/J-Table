import { Avatar, Tooltip } from "antd";

export default function LtnList({ list }) {
    console.log(list);

    return <div className="ltn-list">
        {list.map((it, index) => <div key={it.id} className="ltn-list-item">
            <Avatar className="avatar" size='small'>{index + 1}</Avatar>
            {
                it.title.length > 70 ? <Tooltip title={it.title}>
                    <p className="ltn-title">{it.title}{console.log(it.title.length)}</p>
                </Tooltip> : <p className="ltn-title">{it.title}</p>
            }

        </div>)}
    </div>
}