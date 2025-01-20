import { Tooltip } from "antd";

export default function LongPage({ page }) {
    return page.length > 70 ?
        <Tooltip title={page}>
            <p className="ltn-title">{page}</p>
        </Tooltip>
        : <p className="ltn-title">{page}</p>
}