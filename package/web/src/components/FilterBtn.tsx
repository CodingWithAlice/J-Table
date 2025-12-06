import { BgColorsOutlined } from "@ant-design/icons";
import { FloatButton, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { TimeProps } from "./LtnTable";

interface FilterProps {
    fresh: (params: TimeProps) => void,
    initValue: TimeProps
}

export default function FilterBtn({ fresh, initValue }: FilterProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [start, setStart] = useState(initValue.start);
    const [end, setEnd] = useState(initValue.end);

    const showModal = () => {
        setStart(initValue?.start || dayjs().format('YYYY-MM-DD'));
        setEnd(initValue?.end || dayjs().add(10, 'day').format('YYYY-MM-DD'));
        setIsModalOpen(true);
    };
    const handleOk = () => {
        fresh({ start, end });
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
                insetInlineEnd: 24,
            }}
            description="过滤"
            icon={<BgColorsOutlined />}
            onClick={showModal}
        />
        <Modal title="过滤当前周期题目列表" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div className="filter-form">
                <Input placeholder="周期开始时间" value={start} onChange={(e) => { setStart(e.target.value) }} allowClear />
                <Input placeholder="周期结束时间" value={end} onChange={(e) => { setEnd(e.target.value) }} />
            </div>
        </Modal>
    </>
}