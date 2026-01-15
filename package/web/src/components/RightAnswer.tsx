import { HeartTwoTone } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { AnswerApi } from "../apis/answer";
import { coinEventEmitter, COIN_CHANGED_EVENT } from "../utils/coinEvent";

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
            wrongNotes: ''
        }
        AnswerApi.update(data).then(res => {
            // 合并提示信息
            if (res?.coinAdded) {
                message.success(isNew ? '添加成功，金币 +1 👏🏻' : '修改成功，金币 +1 👏🏻');
                // 触发金币变更事件
                coinEventEmitter.emit(COIN_CHANGED_EVENT);
            } else {
                message.success(isNew ? '添加成功' : '修改成功');
            }
            isNew && setIsNew(false);
            closeModal();
        }).catch(e => {
            if (e instanceof Error) {
                message.error(e.message);
            }
        });
    };

    useEffect(() => {
        AnswerApi.list(topicId).then(res => {
            if (!res || res.length === 0) { setIsNew(true) }
            setAnswer(res?.rightAnswer);
        })
    }, [topicId])

    return <Form>
        <Form.Item label="答案">
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
        </Form.Item>
        <Form.Item className="check-btn-wrap">
            <Button onClick={handleSave} icon={<HeartTwoTone twoToneColor="#eb2f96" />} className="check-button">
                修改答案
            </Button>
        </Form.Item>
    </Form>
}