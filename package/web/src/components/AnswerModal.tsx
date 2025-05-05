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

export default function AnswerModal({ title, type, topicId }: { title: string, type: Type, topicId: number }) {
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
        <Modal
            title={title}
            width={'75%'}
            open={isAnswerModalOpen}
            footer={null}
            onCancel={handleCancel}
            destroyOnClose
            maskClosable={false}
        >
            {type === 'answer' && <Answer topicId={topicId} placeholder="请输入正确答案" closeModal={handleCancel} />}
            {type === 'rightAnswer' && <RightAnswer placeholder="修改答案" topicId={topicId} title={title} closeModal={handleCancel} />}
        </Modal>
    </>
}