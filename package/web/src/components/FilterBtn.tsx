import { BgColorsOutlined } from "@ant-design/icons";
import { FloatButton, Modal } from "antd";
import { useEffect, useState } from "react";
import { LtnApi } from "../apis/ltn";
import { LtnsProps, LtnDTO } from "./LtnTable";
import LtnList from "./LtnList";

type LtnsType = keyof LtnsProps

export default function FilterBtn() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ltns, setLtns] = useState<LtnsProps>({});
    const [minDate, setMinDate] = useState<string>('');

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取最小日期当天的数据
    const initMinDateData = () => {
        // 传递 useMinDate 标识，后端会返回最小日期当天的数据
        LtnApi.list({ useMinDate: true }).then((data) => {
            setLtns(data);
            // 从所有数据中计算最小日期
            let minDateValue: Date | null = null;
            Object.keys(data).forEach((boxId) => {
                const boxData = data[boxId as LtnsType];
                if (Array.isArray(boxData)) {
                    boxData.forEach((ltn: LtnDTO) => {
                        if (ltn.solveTime) {
                            const nextTime = new Date(
                                new Date(ltn.solveTime).getTime() +
                                ltn.customDuration * 24 * 60 * 60 * 1000
                            );
                            if (!minDateValue || nextTime < minDateValue) {
                                minDateValue = nextTime;
                            }
                        }
                    });
                }
            });
            if (minDateValue !== null) {
                const dateStr = (minDateValue as Date).toISOString().split('T')[0];
                setMinDate(dateStr);
            }
        });
    };

    useEffect(() => {
        if (isModalOpen) {
            initMinDateData();
        }
    }, [isModalOpen]);

    return <>
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd: 24,
            }}
            description="过滤"
            icon={<BgColorsOutlined />}
            onClick={showModal}
        />
        <Modal
            title={`过滤当前最小日期题目列表${minDate ? ` - ${minDate}` : ''}`}
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
            width={'75%'}
        >
            <div className="ltn-wrapper">
                {Object.keys(ltns).map((ltnType: LtnsType) => <div key={ltnType}>
                    {!!ltns[ltnType].length && <div key={ltnType}>
                        <h2 className="ltn-box">BOX{ltnType}</h2>
                        <LtnList list={ltns[ltnType]} boxId={+ltnType} fresh={initMinDateData} />
                    </div>}
                </div>)}
            </div>
        </Modal>
    </>
}