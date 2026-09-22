import { LeftOutlined, MenuUnfoldOutlined, RightOutlined } from "@ant-design/icons";
import { Button, FloatButton, Modal, Statistic, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { RecordApi, RecordDTO } from "../apis/record";
import { parseQuestionTitle } from "../utils/formatQuestionTitle";

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

function toMinutes(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
}

/** durationSec 实际单位是分钟 */
function formatDuration(minutes: number): string {
    if (minutes <= 0) return '0 分钟';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h <= 0) return `${m} 分钟`;
    if (m <= 0) return `${h} 小时`;
    return `${h} 小时 ${m} 分钟`;
}

function getRecordLabel(item: RecordDTO): string {
    const raw = String(item?.topicTitle || item?.topicId || '');
    return parseQuestionTitle(raw).shortTitle || raw;
}

function formatItemDuration(value: unknown): string {
    if (value === undefined || value === null || value === '') return '—';
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return '—';
    return `${n}m`;
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
    const totalDuration = useMemo(
        () => list.reduce((sum, item) => sum + toMinutes(item.durationSec), 0),
        [list],
    );
    const correctCount = useMemo(
        () => list.filter((item) => item.isCorrect === true).length,
        [list],
    );

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
                ? <>
                    <div className="record-date-summary">
                        <Statistic
                            title="数量"
                            value={list.length}
                            suffix="题"
                            valueStyle={{ fontSize: 22, fontWeight: 600 }}
                        />
                        <Statistic
                            title="总时长"
                            value={formatDuration(totalDuration)}
                            valueStyle={{ fontSize: 22, fontWeight: 600 }}
                        />
                        <Statistic
                            title="正确"
                            value={correctCount}
                            suffix={`/ ${list.length}`}
                            valueStyle={{ fontSize: 22, fontWeight: 600 }}
                        />
                    </div>
                    <div className="record-date-list">
                        {list.map((item, index) => {
                            const label = getRecordLabel(item);
                            const fullTitle = String(item?.topicTitle || item?.topicId || '');
                            return (
                                <div key={item.topicId} className="record-date-item">
                                    <span className="record-date-item__index">{index + 1}.</span>
                                    <div className="record-date-item__title-wrap">
                                        <Tooltip title={fullTitle} placement="topLeft">
                                            <span className="record-date-item__title">{label}</span>
                                        </Tooltip>
                                    </div>
                                    <span className="record-date-item__meta">
                                        {item?.isCorrect ? '✅' : '❌'} {formatItemDuration(item.durationSec)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
                : <div className="record-date-empty">暂无做题记录</div>}
        </Modal>
    </>
}