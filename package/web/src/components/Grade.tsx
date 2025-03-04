import { Button, message, Popconfirm } from "antd"
import { LtnApi } from "../apis/ltn";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import dayjs from "dayjs";

const description = {
    update: {
        desc: '升一级',
        icon: <CaretUpFilled />,
        className: 'ltn-grade-up'
    },
    degrade: {
        desc: '降到 box1',
        icon: <CaretDownFilled />,
        className: 'ltn-grade-down'
    },
    fresh: {
        desc: '刷新做题时间',
        icon: <>○</>,
        className: 'ltn-grade-fresh'
    }
}


interface GradeProps {
    boxId: number,
    fresh: () => void,
    ltnId: number
}

export default function Grade({ boxId, fresh, ltnId }: GradeProps) {
    const confirm = (key: number, type: string) => {
        LtnApi.update(key, type, dayjs().subtract(0, 'day').toDate()).then(res => {
            message.success(`更新 ${res.title} 到 box${res.boxId} 成功`);
            fresh();
        })
    };

    const cancel = () => {
        message.info('无事发生');
    };
    return <div className="ltn-grade-box">
        {(+boxId === 1 ? (['update', 'fresh'] as const) : (['update', 'degrade'] as const)).map((item) => <Popconfirm
            key={item}
            title={`确认${description[item].desc}吗？`}
            onConfirm={() => {
                confirm(ltnId, item)
            }}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
        >
            <Button className={`${description[item].className} ltn-grade`} type="primary">
                {description[item].icon}
            </Button>
        </Popconfirm>
        )}
    </div>
}