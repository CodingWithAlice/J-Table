import { CheckSquareOutlined, FontColorsOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Radio } from "antd";
import { useEffect, useState } from "react";
import { RecordApi, type RecordDTO } from "../apis/record";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function Answer({ placeholder, topicId, closeModal }: { placeholder: string, topicId: number, closeModal: () => void }) {
    const [form] = Form.useForm();
    const [record, setRecord] = useState<RecordDTO>();
    const [showRightAnswer, setShowRightAnswer] = useState(false);
    // 检验、提交
    const handleCheck = (needAI: boolean) => {
        setTimeout(() => {
            const newData = form.getFieldsValue();
            RecordApi.update({
                ...record,
                ...newData,
                submitTime: dayjs().format('YYYY-MM-DD'),
            }).then(res => {
                message.success(needAI ? '查询成功' : '提交成功');
                setShowRightAnswer(true);
            }).catch(e => {
                if (e instanceof Error) {
                    message.error(e.message);
                }
            });
            if (needAI) {
                console.log('AI')
            } else {
                closeModal();
            }
        }, 250)
    };

    // 初始化
    useEffect(() => {
        RecordApi.list(topicId).then((res) => {
            setShowRightAnswer(res?.showRightAnswer);
            form.setFieldsValue(res?.record); // 动态填充表单
            setRecord(res?.record);
        })
    }, [topicId])

    return <Form form={form}>
        {/* 填写答案 */}
        <Form.Item name="recentAnswer" label="填写答案">
            <TextArea
                key="answer"
                placeholder={placeholder}
                style={{
                    resize: 'both',
                }}
                autoSize={{ minRows: 1 }}
            />
        </Form.Item>
        {showRightAnswer && (<>
            <Form.Item name="rightAnswer" label="正确答案">
                <TextArea
                    key="answer"
                    placeholder={placeholder}
                    style={{
                        resize: 'both',
                    }}
                    disabled
                    autoSize={{ minRows: 1 }}
                />
            </Form.Item>
            <Form.Item name="AI_suggest" label="AI 判定">
                <Input disabled></Input>
            </Form.Item>
            <Form.Item name="wrongNotes" label="历史错误信息">
                <TextArea
                    style={{
                        resize: 'both',
                    }}
                    autoSize={{ minRows: 1, maxRows: 12 }}
                ></TextArea>
            </Form.Item>
            <Form.Item name="durationSec" label="做题时长" rules={[{ required: true }]}>
                <Input placeholder="单位：分钟"></Input>
            </Form.Item>
            <Form.Item name="isCorrect" label="是否正确" rules={[{ required: true }]}>
                <Radio.Group
                    options={[
                        { value: true, label: '正确' },
                        { value: false, label: '需重做' },
                    ]}
                />
            </Form.Item>
        </>)}
        {/* 按钮 */}
        <Form.Item name="isCorrect" label={null} className='check-btn-wrap'>
            <Button onClick={() => handleCheck(true)} icon={<FontColorsOutlined />} className="check-button">
                校验
            </Button>
            {showRightAnswer && <Button type="primary" onClick={() => handleCheck(false)} icon={<CheckSquareOutlined />} className="check-button">
                提交
            </Button>}
        </Form.Item>
    </Form>
}