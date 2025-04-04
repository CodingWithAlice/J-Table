import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { LevelApi } from "../apis/level";

export default function LevelTimeTooltip() {
    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>();

    useEffect(() => {
        LevelApi.list().then(res => {
            setTooltipContent((<div>
                {res.map(({ id, desc, basicDuration, maxDuration }: { id: number, basicDuration: number, maxDuration: number, desc: string }) => (
                    <div key={id}>
                        {desc}: 基本间隔 {basicDuration}天
                        {/* 最大 {maxDuration}天 */}
                    </div>
                ))}
            </div>))
        })
    }, [])

    return <Tooltip title={tooltipContent} placement="topLeft">
        <QuestionCircleOutlined />
    </Tooltip>
}