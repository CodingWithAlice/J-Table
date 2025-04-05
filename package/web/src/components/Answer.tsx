import { FontColorsOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function Answer() {
    const [answer, setAnswer] = useState<string>();
    const handleSave = () => { };
    return <>
        <TextArea
            key="answer"
            value={answer}
            onChange={(e) => setAnswer((e.target as HTMLTextAreaElement).value)}
            placeholder="请输入你的答案"
            style={{
                resize: 'both',
            }}
            autoSize={{ minRows: 1 }}
        />
        <Button onClick={handleSave} icon={<FontColorsOutlined />}>
            校验
        </Button>
    </>
}