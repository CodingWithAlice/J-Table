import { Tooltip } from "antd";

export default function LongPage({ title }: { title: string }) {
    return title.length > 70 ?
        <Tooltip title={title}>
            <p className="ltn-title">{title}</p>
        </Tooltip>
        : <p className="ltn-title">{title}</p>
}