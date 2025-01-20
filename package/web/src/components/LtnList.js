import { Avatar, Button, message, Popconfirm, Tooltip } from "antd";
import { LtnApi } from "../apis/ltn";

export default function LtnList({ list, boxId }) {
    const confirm = (key, type) => {
        LtnApi.update(key, type, new Date()).then(res=> {
            message.success(`更新题${res.id}成功`);
        })
    };

    const cancel = () => {
        message.info('无事发生');
    };

    return <div className="ltn-list">
        {list.map((it, index) => <div key={it.id} className="ltn-list-item">
            {/* 序号 */}
            <Avatar className="avatar" size='small'>{index + 1}</Avatar>
            {/* 默认单行展示 - 过长通过悬浮展示 */}
            {
                it.title.length > 70 ? <Tooltip title={it.title}>
                    <p className="ltn-title">{it.title}{console.log(it.title.length)}</p>
                </Tooltip> : <p className="ltn-title">{it.title}</p>
            }
            {/* 升降 */}
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
                    title="做题后调整归属盒子"
                    description={`确认${item.key === 'update' ? '升一级' : '降到 box1 '}吗？`}
                    onConfirm={() => {
                        console.log(111111, it.id, item.key);
                        
                        confirm(it.id, item.key)
                    }}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button>{item.desc}</Button>
                </Popconfirm>
            </>)}
            {/* 下次做题时间 */}
            {/* <p>{it.solveTime}</p> */}

        </div>)}
    </div>
}