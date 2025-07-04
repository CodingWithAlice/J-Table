import { FieldTimeOutlined } from "@ant-design/icons";
import { FloatButton, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import Time from "./Time";
import { TimeApi } from "../apis/time";

export default function TimeModalBtn() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeLineType, setTimeLineType] = useState<'LTN' | 'all'>('LTN');
    const [timeData, setTimeData] = useState([]);

    const timeLineParams: { [key in 'LTN' | 'all']: { params: { type?: string, count?: number }, text: string } } = {
        LTN: {
            params: { type: 'LTN', count: 15 },
            text: '展示全部',
        },
        all: {
            params: {},
            text: '展示LTN周期',
        }
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const alterShow = () => {
        setTimeLineType(timeLineType === 'LTN' ? 'all' : 'LTN');
    }
    const titleNode = <div className="time-title">
        LTN周期
        <Tag className="show-all" onClick={alterShow}>
            {timeLineParams[timeLineType].text}
        </Tag>
    </div>;

    useEffect(() => {
        TimeApi.list().then(data => {
            setTimeData(data);
        })
    }, []);

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
        <Modal 
            title={titleNode} 
            open={isModalOpen} 
            footer={null} 
            onCancel={handleCancel}
            width={'75%'} 
        >
            <Time params={timeLineParams[timeLineType].params} timeData={timeData} />
        </Modal>
    </>
}