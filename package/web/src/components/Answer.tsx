import { FontColorsOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function Answer({ placeholder }: { placeholder: string }) {
    const [answer, setAnswer] = useState<string>();
    const handleCheck = () => {
        message.info('功能开发中...');
        if(!answer) {
            return;
        }

        console.log(1111,answer);
        
     };
    return <>
        <TextArea
            key="answer"
            value={answer}
            onChange={(e) => setAnswer((e.target as HTMLTextAreaElement).value)}
            placeholder={placeholder}
            style={{
                resize: 'both',
            }}
            autoSize={{ minRows: 1 }}
        />
        <Button onClick={handleCheck} icon={<FontColorsOutlined />} className="check-button">
            校验
        </Button>
    </>
}