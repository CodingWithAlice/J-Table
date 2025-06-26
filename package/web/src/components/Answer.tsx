import { CheckSquareOutlined, FontColorsOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Radio, Flex, Tag } from "antd";
import { useEffect, useState } from "react";
import { RecordApi, type RecordDTO } from "../apis/record";
import dayjs from "dayjs";
import { AIApi } from "../apis/ai";

const { TextArea } = Input;
interface AnswerProps {
    placeholder: string,
    topicId: number,
    closeModal: () => void,
    title: string,
    lastStatus?: boolean
}

export default function Answer({ placeholder, topicId, closeModal, title, lastStatus }: AnswerProps) {
    const [form] = Form.useForm();
    const [record, setRecord] = useState<RecordDTO>();
    const [historyRecords, setHistoryRecords] = useState([]);
    const [showRightAnswer, setShowRightAnswer] = useState(false);
    const [showAILoading, setShowAILoading] = useState(true);
    const colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "purple"];
    // 检验、提交
    const handleCheck = (needAI: boolean) => {
        setTimeout(() => {
            const newData = form.getFieldsValue();
            const data = {
                ...record,
                ...newData,
                submitTime: dayjs().format('YYYY-MM-DD'),
                topicTitle: title,
                lastStatus
            }
            // AI 查询
            if (needAI && showRightAnswer) {
                handleAISuggest(data?.topicTitle, data?.recentAnswer, data?.rightAnswer);
                return;
            }
            // 校验答案 - 做题时长 + 是否正确
            if (showRightAnswer && (data?.isCorrect === undefined || data?.durationSec === undefined)) {
                message.error('请填写必填项');
                return;
            }
            RecordApi.update(data).then(res => {
                message.success(needAI ? '查询成功' : '提交成功');
                setShowRightAnswer(true);
                setShowAILoading(false)
            }).catch(e => {
                if (e instanceof Error) {
                    message.error(e.message);
                }
            });
            // 提交后关闭弹窗
            if (!needAI) {
                closeModal();
            }
        }, 250)
    };

    // AI 查询建议
    const handleAISuggest = (title: string,recent: string, right: string) => {
        setShowAILoading(true)
        AIApi.compare({ recent, right, title }).then(({suggestion}) => {
            setShowAILoading(false)
            form.setFieldsValue({ AI_suggest: suggestion.join('\n') });
        })
    }

    // 初始化
    useEffect(() => {
        RecordApi.list(topicId).then((res) => {
            setShowRightAnswer(res?.showRightAnswer);
            setShowAILoading(!res?.showRightAnswer)
            setHistoryRecords(res?.historyRecords || []);
            form.setFieldsValue(res?.record); // 动态填充表单
            if (res) {
                setRecord({ ...res.record, topicId });
            }
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
                {(showRightAnswer && showAILoading) 
                ?  <LoadingOutlined /> 
                : <TextArea
                    key="AI_suggest"
                    placeholder="点击下方「校验」进行 AI 判题"
                    style={{
                        resize: 'both',
                    }}
                    disabled
                    autoSize={{ minRows: 1 }}
                />}
            </Form.Item>
            {historyRecords?.length > 0 && <Form.Item name="historyRecords" label="历史做题记录">
                <Flex gap="4px 0" wrap>
                    {historyRecords.map((item, index) => <Tag color={colors[index % 10]}>{item}</Tag>)}
                </Flex>
            </Form.Item>}
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