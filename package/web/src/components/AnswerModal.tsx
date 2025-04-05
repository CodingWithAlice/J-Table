import { Modal, Tooltip } from "antd";
import React, { useState } from "react";
import Answer from "./Answer";
import { EditTwoTone, FormOutlined } from "@ant-design/icons";
import RightAnswer from "./RightAnswer";

const ModalContent = {
    answer: {
        icon: <EditTwoTone />,
        toolTip: "做题",
    },
    rightAnswer: {
        icon: <FormOutlined />,
        toolTip: "修改题目答案",
    }
}
type Type = keyof typeof ModalContent;

export default function AnswerModal({ title, type, questionId }: { title: string, type: Type, questionId: number }) {
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const handleCancel = () => {
        setIsAnswerModalOpen(false);
    };
    const showModal = () => {
        setIsAnswerModalOpen(true);
    };

    return <>
        <span onClick={showModal}>
            <Tooltip title={ModalContent[type].toolTip}>{ModalContent[type].icon}</Tooltip>
        </span>
        <Modal title={title} open={isAnswerModalOpen} footer={null} onCancel={handleCancel} >
            {type === 'answer' && <Answer placeholder="请输入正确答案" />}
            {type === 'rightAnswer' && <RightAnswer placeholder="修改答案" questionId={questionId} title={title} />}
        </Modal>
    </>
}