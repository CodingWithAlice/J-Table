import { LeftOutlined, MenuUnfoldOutlined, RightOutlined } from "@ant-design/icons";
import { Button, FloatButton, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { RecordApi, RecordDTO } from "../apis/record";

const DATE_FMT = 'YYYY-MM-DD';

const getYesterday = () => dayjs().subtract(1, 'day').format(DATE_FMT);
const getToday = () => dayjs().format(DATE_FMT);

function getRecordTitle(date: string) {
    const today = getToday();
    const yesterday = getYesterday();
    if (date === today) return '今日做题记录';
    if (date === yesterday) return '昨日做题记录';
    return `${dayjs(date).format('M月D日')}做题记录`;
}

export default function TodayRecordBtn({ insetInlineEnd = 234 }: { insetInlineEnd?: number }) {
    const [modalShow, setModalShow] = useState(false);
    const [list, setList] = useState<RecordDTO[]>([]);
    const [currentDate, setCurrentDate] = useState(getYesterday);

    const changeModalShow = (status: boolean) => {
        setModalShow(status);
        if (status) {
            setCurrentDate(getYesterday());
        }
    };

    useEffect(() => {
        if (!modalShow) return;
        RecordApi.listByDate(currentDate).then(res => {
            setList(res || []);
        });
    }, [modalShow, currentDate]);

    const isToday = currentDate === getToday();

    const titleNode = (
        <div className="record-date-title">
            <Button
                type="text"
                size="small"
                icon={<LeftOutlined />}
                onClick={() => setCurrentDate(dayjs(currentDate).subtract(1, 'day').format(DATE_FMT))}
            />
            <span>{getRecordTitle(currentDate)}</span>
            <Button
                type="text"
                size="small"
                icon={<RightOutlined />}
                disabled={isToday}
                onClick={() => {
                    if (isToday) return;
                    setCurrentDate(dayjs(currentDate).add(1, 'day').format(DATE_FMT));
                }}
            />
        </div>
    );

    return <>
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd,
            }}
            description="日报"
            icon={<MenuUnfoldOutlined />}
            onClick={() => changeModalShow(true)}
        />
        <Modal
            title={titleNode}
            open={modalShow}
            onOk={() => changeModalShow(false)}
            onCancel={() => changeModalShow(false)}
        >
            {list.length > 0
                ? list.map((item, index) => (
                    <div key={item.topicId}>
                        {index + 1}、{item?.topicTitle || item?.topicId} {item?.isCorrect ? '✅' : '❌'} 耗时{item?.durationSec}m
                    </div>
                ))
                : <div className="record-date-empty">暂无做题记录</div>}
        </Modal>
    </>
}