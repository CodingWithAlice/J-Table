import { FontColorsOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { RecordApi } from "../apis/record";

const { TextArea } = Input;

export default function Answer({ placeholder, topicId, topicTitle }: { placeholder: string, topicId: number, topicTitle: string }) {
    const [answer, setAnswer] = useState<string>('');
    const [record, serRecord] = useState();
    const [showRightAnswer, setShowRightAnswer] = useState(false);
    const handleCheck = () => {
        // message.info('功能开发中...');
        // if (!answer) {
        //     return;
        // }
        RecordApi.update({ recentAnswer: answer, topicId, topicTitle }).then(res => {
            console.log(1111, res);

        })
    };
    useEffect(() => {
        RecordApi.list(topicId).then((res) => {
            setShowRightAnswer(res?.showRightAnswer);
            serRecord(res?.record);
        })
    }, [topicId])
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