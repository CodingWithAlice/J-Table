import { Modal, Tooltip } from "antd";
import React, { useState } from "react";
import { EditTwoTone, FormOutlined } from "@ant-design/icons";
import RightAnswer from "./RightAnswer";
import { useNavigate } from "react-router-dom";

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
type ReturnModalType = 'redoNextDay' | 'minDateFilter';

export default function AnswerModal({
    title,
    type,
    topicId,
    lastStatus,
    fresh,
    returnModal,
}: {
    title: string;
    type: Type;
    topicId: number;
    lastStatus?: boolean;
    fresh?: () => void;
    returnModal?: ReturnModalType;
}) {
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleCancel = () => {
        setIsAnswerModalOpen(false);
    };
    const showModal = () => {
        if (type === 'answer') {
            const sp = new URLSearchParams();
            sp.set('title', title);
            sp.set('placeholder', '请输入正确答案');
            if (lastStatus) sp.set('lastStatus', '1');
            if (returnModal) sp.set('returnModal', returnModal);
            navigate(`/answer/${topicId}?${sp.toString()}`);
            return;
        }
        setIsAnswerModalOpen(true);
    };

    return <>
        <span onClick={showModal}>
            <Tooltip title={ModalContent[type].toolTip}>{ModalContent[type].icon}</Tooltip>
        </span>
        {type !== 'answer' && <Modal
            title={
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {title}
                </div>
            }
            width={'75%'}
            open={isAnswerModalOpen}
            footer={null}
            onCancel={handleCancel}
            destroyOnClose
            maskClosable={false}
        >
            {type === 'rightAnswer' && <RightAnswer placeholder="修改答案" topicId={topicId} title={title} closeModal={handleCancel} />}
        </Modal>}
    </>
}