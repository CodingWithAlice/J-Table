import { AppstoreAddOutlined } from "@ant-design/icons";
import { FloatButton, Input, Modal, Radio } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { LtnApi } from "../apis/ltn";

export default function AddLtn({fresh}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [source, setSource] = useState(0);
    const [boxId, setBoxId] = useState(1);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const data = {
            title,
            source,
            boxId,
            solveTime: dayjs().format('YYYY-MM-DD')
        }
        LtnApi.add(data).then(() => {
            fresh();
        });
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <>
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd: 164,
            }}
            description="添加"
            icon={<AppstoreAddOutlined />}
            onClick={showModal}
        />
        <Modal title="添加BOX题目" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Input placeholder="BOX题目" value={title} onChange={(e) => { setTitle(e.target.value) }} allowClear />
            <Radio.Group
                onChange={(e) => setSource(e.target.value)}
                defaultValue={source}
                className="radio-group"
            >
                {[
                    { value: 0, desc: '印象笔记' },
                    { value: 1, desc: '播客' }
                ].map(it => (
                    <Radio.Button key={it.value} value={it.value}>{it.desc}</Radio.Button>
                ))}
            </Radio.Group>
            <Input placeholder="BOX ID" value={boxId} onChange={(e) => { setBoxId(e.target.value) }} type="number" />
        </Modal>
    </>
}