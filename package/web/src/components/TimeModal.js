import { FieldTimeOutlined } from "@ant-design/icons";
import { Button, FloatButton, Modal } from "antd";
import { useState } from "react";
import Time from "./Time";

export default function TimeModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState({ type: 'ltn', count: 8 });

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleShow = () => {
        setParams({});
    }
    const titleNode = <> LTN周期 <Button onClick={handleShow}>展示全部</Button></>

    return <>
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd: 94,
            }}
            description="线轴"
            icon={<FieldTimeOutlined />}
            onClick={showModal}
        />
        <Modal title={titleNode} open={isModalOpen} footer={null} onCancel={handleCancel} >
            <Time params={params} />
        </Modal>
    </>
}