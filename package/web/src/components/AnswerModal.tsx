import { HighlightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import Answer from "./Answer";

export default function AnswerModal({ title }: { title: string }) {
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const handleCancel = () => {
        setIsAnswerModalOpen(false);
    };
    const showModal = () => {
        setIsAnswerModalOpen(true);
    };

    return <>
        <HighlightOutlined onClick={showModal} />
        <Modal title={title} open={isAnswerModalOpen} footer={null} onCancel={handleCancel} >
            <Answer />
        </Modal>
    </>
}