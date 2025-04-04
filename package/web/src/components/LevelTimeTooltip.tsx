import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default function LevelTimeTooltip() {
    const levelData = {
        1: { basic: 7, max: 28 },
        2: { basic: 8, max: 32 },
        3: { basic: 9, max: 38 },
        4: { basic: 11, max: 42 },
        5: { basic: 13, max: 54 }
    };
    const tooltipContent = (<div>
        {Object.entries(levelData).map(([level, times]) => (
            <div key={level}>
                层级 {level}: 基本间隔 {times.basic}天, 最大 {times.max}天
            </div>
        ))}
    </div>);

    return <Tooltip title={tooltipContent} placement="topLeft">
        <QuestionCircleOutlined />
    </Tooltip>
}