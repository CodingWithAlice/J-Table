import { SnippetsOutlined } from "@ant-design/icons";
import { FloatButton, Modal } from "antd";
import { useEffect, useState } from "react";
import { RecordApi } from "../apis/record";
import LtnList from "./LtnList";
import { LtnDTO } from "./LtnTable";

export default function DoitSecondBtn({
    open,
    onOpenChange,
    refreshKey,
    insetInlineEnd = 304,
    hidden,
}: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    refreshKey?: string;
    insetInlineEnd?: number;
    hidden?: boolean;
}) {
    const [modalShow, setModalShow] = useState(false);
    const [list, setList] = useState<LtnDTO[]>([]);
    const realOpen = open ?? modalShow;

    // 切换弹窗状态
    const changeModalShow = (status: boolean) => {
        if (onOpenChange) onOpenChange(status);
        else setModalShow(status);
    };

    const initTodayRecord = () => {
        RecordApi.lastList().then(res => {
            setList(res || [])
        })
    }

    // 初始化查询今日做题记录
    useEffect(() => {
        if (realOpen) {
            initTodayRecord();
        }
    }, [realOpen, refreshKey])

    return <>
        {!hidden && (
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd,
            }}
            description="重做"
            icon={<SnippetsOutlined />}
            onClick={() => changeModalShow(true)}
        />
        )}
        <Modal
            title="隔天重做"
            open={realOpen}
            onOk={() => changeModalShow(false)}
            onCancel={() => changeModalShow(false)}
        >
            <p className="redo-window-hint">仅显示最近 7 天仍需重做的题目，更早的错题会从列表中摘掉。</p>
            <LtnList list={list} boxId={0} lastStatus={true} fresh={initTodayRecord} returnModal="redoNextDay" />
        </Modal>
    </>
}