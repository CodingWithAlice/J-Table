import { SnippetsOutlined } from "@ant-design/icons";
import { FloatButton, Modal } from "antd";
import { useEffect, useState } from "react";
import { RecordApi } from "../apis/record";
import LtnList from "./LtnList";
import { LtnDTO } from "./LtnTable";

export default function DoitSecondBtn() {
    const [modalShow, setModalShow] = useState(false);
    const [list, setList] = useState<LtnDTO[]>([]);

    // 切换弹窗状态
    const changeModalShow = (status: boolean) => {
        setModalShow(status);
    };

    const initTodayRecord = () => {
        RecordApi.lastList().then(res => {
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
                insetInlineEnd: 304,
            }}
            description="重做"
            icon={<SnippetsOutlined />}
            onClick={() => changeModalShow(true)}
        />
        <Modal
            title="隔天重做"
            open={modalShow}
            onOk={() => changeModalShow(false)}
            onCancel={() => changeModalShow(false)}
        >
            <LtnList list={list} boxId={0} lastStatus={true} />
        </Modal>
    </>
}