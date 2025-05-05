import { MenuUnfoldOutlined } from "@ant-design/icons";
import { FloatButton, Modal } from "antd";
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
            setList(res || [])
        })
    }

    // 初始化查询今日做题记录
    useEffect(() => {
        initTodayRecord();
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
            {list.length > 0 && list.map((item, index) => <div> {index + 1}、{item?.topicTitle} {item?.isCorrect ? '✅' : '❌'}</div>)}
        </Modal>
    </>
}