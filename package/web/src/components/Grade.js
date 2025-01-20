import { Button, message, Popconfirm } from "antd"
import { LtnApi } from "../apis/ltn";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";

export default function Grade({ boxId, fresh }) {
    const confirm = (key, type) => {
        LtnApi.update(key, type, new Date()).then(res => {
            message.success(`更新 ${res.title} 到 box${res.boxId} 成功`);
            fresh();
        })
    };

    const cancel = () => {
        message.info('无事发生');
    };
    return <div className="ltn-grade-box">
        {(+boxId === 1 ? [{
            key: 'update',
            desc: '升'
        }] : [{
            key: 'update',
            desc: '升'
        }, {
            key: 'degrade',
            desc: '降'
        }]).map(item => <Popconfirm
                key={item.key}
                title={`确认${item.key === 'update' ? '升一级' : '降到 box1 '}吗？`}
                // description={item.desc}
                onConfirm={() => {
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
        )}
    </div>
}