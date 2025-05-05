import { AppstoreAddOutlined } from "@ant-design/icons";
import { FloatButton, Input, message, Modal, Radio, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { LtnApi } from "../apis/ltn";
import LevelTimeTooltip from "./LevelTimeTooltip";

const { Title } = Typography;

export default function AddLtnBtn({ fresh }: { fresh: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [source, setSource] = useState(0);
    const [boxId, setBoxId] = useState(1);
    const [levelId, setLevelId] = useState(3);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const data = {
            title,
            source,
            boxId,
            levelId,
            solveTime: dayjs().format('YYYY-MM-DD')
        }
        if(!title) {
            message.error('请输入题目！');
            return
        }
        LtnApi.add(data).then(() => {
            fresh();
        }).catch(e => {
            if (e instanceof Error) {
                message.error(e.message);
            }
        });
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleLevelChange = (level: number) => {
        if(level > 5 || level < 1) {
            message.error('请设置正确优先级，可以查看提示');
            return
        }
        setLevelId(level);
    }

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
                    { value: 1, desc: '博客' }
                ].map(it => (
                    <Radio.Button key={it.value} value={it.value}>{it.desc}</Radio.Button>
                ))}
            </Radio.Group>
            <Input addonBefore={'LTN盒子'} placeholder="BOX ID" disabled value={boxId} onChange={(e) => { setBoxId(+e.target.value) }} type="number" />
            <Title level={5}>优先级划定 <LevelTimeTooltip /></Title>
            <Input placeholder="Level ID" value={levelId} onChange={(e) => { handleLevelChange(+e.target.value) }} type="number" />
        </Modal>
    </>
}