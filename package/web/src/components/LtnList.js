import { Avatar, Button, message, Popconfirm, Tooltip } from "antd";
import { LtnApi } from "../apis/ltn";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import dayjs from "dayjs";

export default function LtnList({ list, boxId, fresh }) {
    const confirm = (key, type) => {
        LtnApi.update(key, type, new Date()).then(res => {
            message.success(`更新 ${res.title} 到 box${res.boxId} 成功`);
            fresh();
        })
    };

    const cancel = () => {
        message.info('无事发生');
    };

    return <div className="ltn-list">
        {list.map((it, index) => <div key={it.id} className="ltn-item">
            {/* 序号 */}
            <Avatar className="ltn-avatar" size='small'>{index + 1}</Avatar>
            {/* 默认单行展示 - 过长通过悬浮展示 */}
            {
                it.title.length > 70 ? <Tooltip title={it.title}>
                    <p className="ltn-title">{it.title}{console.log(it.title.length)}</p>
                </Tooltip> : <p className="ltn-title">{it.title}</p>
            }
            {/* 升降 */}
            <div className="ltn-grade-box">
                {(+boxId === 1 ? [{
                    key: 'update',
                    desc: '升'
                }] : [{
                    key: 'update',
                    desc: '升'
                }, {
                    key: 'degrade',
                    desc: '降'
                }]).map(item => <>
                    <Popconfirm
                        title={`确认${item.key === 'update' ? '升一级' : '降到 box1 '}吗？`}
                        // description={item.desc}
                        onConfirm={() => {
                            console.log(111111, it.id, item.key);

                            confirm(it.id, item.key)
                        }}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className={[item.key === 'update' ? 'ltn-grade-up' : 'ltn-grade-down', 'ltn-grade']} type="primary">
                            {item.key === 'update' ? <CaretUpFilled /> : <CaretDownFilled />}
                        </Button>
                    </Popconfirm>
                </>)}
            </div>
            {/* 下次做题时间 */}
            {it.solveTime && <span className="ltn-time">{dayjs(it.solveTime || '2025-01-20').add(boxId * 7, 'day').format('YYYY-MM-DD')}</span>}
        </div>)}
    </div>
}