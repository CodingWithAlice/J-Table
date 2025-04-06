import { HeartTwoTone } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { AnswerApi } from "../apis/answer";

const { TextArea } = Input;

export default function RightAnswer({ placeholder, questionId, title }: { placeholder: string, questionId: number, title: string }) {
    const [answer, setAnswer] = useState<string>('');
    const [isNew, setIsNew] = useState<boolean>(false);

    const handleSave = () => {
        const data = {
            questionId,
            questionTitle: title,
            answerText: answer,
            wrongNotes: []
        }
        if (isNew) {
            AnswerApi.add(data).then(res => {
                message.success('成功');
                setIsNew(false);
            })
        } else {
            AnswerApi.update(data).then(res => {
                message.success('成功');
            })
        }
    };

    useEffect(() => {
        AnswerApi.list(questionId).then(res => {
            console.log(1111, res);
            if (!res || res.length === 0) { setIsNew(true) }
        })
    }, [questionId])

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
        <Button onClick={handleSave} icon={<HeartTwoTone twoToneColor="#eb2f96" />} className="check-button">
            修改答案
        </Button>
    </>
}