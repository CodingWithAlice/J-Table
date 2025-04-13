import { HeartTwoTone } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { AnswerApi } from "../apis/answer";

const { TextArea } = Input;

export default function RightAnswer({ placeholder, topicId, title, closeModal }: { placeholder: string, topicId: number, title: string, closeModal: () => void }) {
    const [answer, setAnswer] = useState<string>('');
    const [isNew, setIsNew] = useState<boolean>(false);

    const handleSave = () => {
        if (!answer) {
            message.warning('请输入正确答案');
            return
        };
        const data = {
            topicId,
            topicTitle: title,
            rightAnswer: answer,
            wrongNotes: []
        }
        AnswerApi.update(data).then(res => {
            message.success(isNew ? '添加成功' : '修改成功');
            isNew && setIsNew(false);
            isNew && closeModal();
        })
    };

    useEffect(() => {
        AnswerApi.list(topicId).then(res => {
            if (!res || res.length === 0) { setIsNew(true) }
            const data = res[0];
            setAnswer(data?.right_answer);
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
        <Button onClick={handleSave} icon={<HeartTwoTone twoToneColor="#eb2f96" />} className="check-button">
            修改答案
        </Button>
    </>
}