import { MenuUnfoldOutlined } from "@ant-design/icons";
import { FloatButton, message, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { RecordApi, RecordDTO } from "../apis/record";
import { useSearchParams } from "react-router-dom";

export default function TodayRecordBtn() {
    const [modalShow, setModalShow] = useState(false);
    const [urlParams, setUrlParams] = useSearchParams();
    const [list, setList] = useState<RecordDTO[]>([]);

    // 切换弹窗状态
    const changeModalShow = (status: boolean) => {
        setModalShow(status);
    };

    const initTodayRecord = () => {
        const date = urlParams.get('date') || dayjs().format('YYYY-MM-DD');
        RecordApi.listByDate(date).then(res => {
            if (res?.length === 0) {
                changeModalShow(false);
                message.warning('暂无做题记录');
                return
            }
            setList(res || [])
        })
    }

    // 初始化查询今日做题记录
    useEffect(() => {
        if (modalShow) {
            initTodayRecord();
        }
    }, [modalShow])

    return <>
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd: 234,
            }}
            description="日报"
            icon={<MenuUnfoldOutlined />}
            onClick={() => changeModalShow(true)}
        />
        <Modal
            title="今日做题记录"
            open={modalShow}
            onOk={() => changeModalShow(false)}
            onCancel={() => changeModalShow(false)}
        >
            {list.length > 0 && list.map((item, index) => <div key={item.topicId}> {index + 1}、{item?.topicTitle || item?.topicId} {item?.isCorrect ? '✅' : '❌'} 耗时{item?.durationSec}m</div>)}
        </Modal>
    </>
}