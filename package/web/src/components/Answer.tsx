import { CheckSquareOutlined, FontColorsOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Radio, Flex, Tag, Switch, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { RecordApi, type RecordDTO } from "../apis/record";
import dayjs from "dayjs";
import { AIApi } from "../apis/ai";
import { coinEventEmitter, COIN_CHANGED_EVENT } from "../utils/coinEvent";
import { renderTextWithLinks } from "../utils/utils";
import React from "react";

const { TextArea } = Input;
interface AnswerProps {
    placeholder: string,
    topicId: number,
    closeModal: () => void,
    title: string,
    lastStatus?: boolean,
    fresh?: () => void
}

type CompareLayout = 'vertical' | 'horizontal';
const ANSWER_COMPARE_LAYOUT_KEY = 'jtable_answer_compare_layout';

function safeReadLayout(): CompareLayout {
    try {
        const v = localStorage.getItem(ANSWER_COMPARE_LAYOUT_KEY);
        return v === 'horizontal' ? 'horizontal' : 'vertical';
    } catch {
        return 'vertical';
    }
}

function safeWriteLayout(layout: CompareLayout) {
    try {
        localStorage.setItem(ANSWER_COMPARE_LAYOUT_KEY, layout);
    } catch {
        // ignore
    }
}

function shouldCollapseText(text: unknown, opts?: { maxChars?: number; maxLines?: number }) {
    const str = typeof text === 'string' ? text : '';
    const maxChars = opts?.maxChars ?? 220;
    const maxLines = opts?.maxLines ?? 6;
    const lineCount = str ? str.split(/\r?\n/).length : 0;
    return str.length > maxChars || lineCount > maxLines;
}

function CollapsibleBlock({
    value,
    placeholder,
    render,
    maxPreviewLines = 6,
}: {
    value?: unknown;
    placeholder?: React.ReactNode;
    render?: (text: string) => React.ReactNode;
    maxPreviewLines?: number;
}) {
    const text = typeof value === 'string' ? value : '';
    const [expanded, setExpanded] = useState(false);
    const needCollapse = useMemo(() => shouldCollapseText(text, { maxLines: maxPreviewLines }), [text, maxPreviewLines]);

    return (
        <div>
            <div
                style={{
                    padding: '4px 11px',
                    minHeight: '32px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: '#f5f5f5',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    maxHeight: !needCollapse || expanded ? undefined : `${maxPreviewLines * 1.6}em`,
                }}
            >
                {text
                    ? (render ? render(text) : text)
                    : (placeholder ?? <span style={{ color: '#bfbfbf' }}>暂无内容</span>)}
            </div>
            {needCollapse && (
                <div style={{ marginTop: 6, textAlign: 'right' }}>
                    <Button type="link" size="small" onClick={() => setExpanded(v => !v)} style={{ padding: 0, height: 'auto' }}>
                        {expanded ? '收起' : '展开'}
                    </Button>
                </div>
            )}
        </div>
    );
}

const AI_MODEL_FLASH = 'deepseek-v4-flash';
const AI_MODEL_PRO = 'deepseek-v4-pro';

export default function Answer({ placeholder, topicId, closeModal, title, lastStatus, fresh }: AnswerProps) {
    const [form] = Form.useForm();
    const [record, setRecord] = useState<RecordDTO>();
    const [historyRecords, setHistoryRecords] = useState([]);
    const [showRightAnswer, setShowRightAnswer] = useState(false);
    const [showAILoading, setShowAILoading] = useState(true);
    const [compareLayout, setCompareLayout] = useState<CompareLayout>(() => safeReadLayout());
    const [useAiPro, setUseAiPro] = useState(false);
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
            
            // 判断是否是真实做完题（有 durationSec 和 isCorrect）
            const isRealSubmit = data?.isCorrect !== undefined && data?.durationSec !== undefined;
            
            RecordApi.update(data).then(res => {
                // 合并提示信息
                if (res?.coinAdded) {
                    message.success(needAI ? '查询成功，金币 +1 👏🏻' : '提交成功，金币 +1 👏🏻');
                    // 触发金币变更事件
                    coinEventEmitter.emit(COIN_CHANGED_EVENT);
                } else {
                    message.success(needAI ? '查询成功' : '提交成功');
                }
                setShowRightAnswer(true);
                setShowAILoading(false);
                // 只有在真实做完题时才刷新 api/ltn 更新界面数据
                if (isRealSubmit) {
                    fresh?.();
                }
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
        AIApi.compare({ recent, right, title, pro: useAiPro }).then(({suggestion}) => {
            setShowAILoading(false)
            form.setFieldsValue({ AI_suggest: suggestion.join('\n') });
        })
    }

    // 初始化
    useEffect(() => {
        RecordApi.list(topicId).then((res) => {
            // 如果已经有 recentAnswer，应该显示正确答案区域
            const hasRecentAnswer = res?.record?.recentAnswer && res.record.recentAnswer.trim() !== '';
            const shouldShowRightAnswer = res?.showRightAnswer || hasRecentAnswer;
            setShowRightAnswer(shouldShowRightAnswer);
            setShowAILoading(!shouldShowRightAnswer)
            setHistoryRecords(res?.historyRecords || []);
            form.setFieldsValue(res?.record); // 动态填充表单
            if (res) {
                setRecord({ ...res.record, topicId });
            }
        })
    }, [topicId, form])

    return <Form form={form}>
        {showRightAnswer && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <Radio.Group
                    size="small"
                    value={compareLayout}
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(e) => {
                        const next = (e.target?.value ?? 'vertical') as CompareLayout;
                        setCompareLayout(next);
                        safeWriteLayout(next);
                    }}
                    options={[
                        { label: '上下', value: 'vertical' },
                        { label: '左右', value: 'horizontal' },
                    ]}
                />
            </div>
        )}

        {/* 填写答案 + 正确答案（可切换上下/左右） */}
        {showRightAnswer && compareLayout === 'horizontal' ? (
            <Flex gap={12} align="start" style={{ width: '100%' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
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
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Form.Item name="rightAnswer" label="正确答案">
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues?.rightAnswer !== currentValues?.rightAnswer}>
                            {({ getFieldValue }) => {
                                const rightAnswer = getFieldValue('rightAnswer');
                                return (
                                    <CollapsibleBlock
                                        value={rightAnswer}
                                        placeholder={<span style={{ color: '#bfbfbf' }}>{placeholder}</span>}
                                        render={(t) => renderTextWithLinks(t, title)}
                                        maxPreviewLines={6}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                </div>
            </Flex>
        ) : (
            <>
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
                {showRightAnswer && (
                    <Form.Item name="rightAnswer" label="正确答案">
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues?.rightAnswer !== currentValues?.rightAnswer}>
                            {({ getFieldValue }) => {
                                const rightAnswer = getFieldValue('rightAnswer');
                                return (
                                    <CollapsibleBlock
                                        value={rightAnswer}
                                        placeholder={<span style={{ color: '#bfbfbf' }}>{placeholder}</span>}
                                        render={(t) => renderTextWithLinks(t, title)}
                                        maxPreviewLines={6}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                )}
            </>
        )}

        {showRightAnswer && (<>
            <Form.Item name="AI_suggest" label="AI 引导">
                {(showRightAnswer && showAILoading) 
                ?  <LoadingOutlined /> 
                : (
                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues?.AI_suggest !== currentValues?.AI_suggest}>
                        {({ getFieldValue }) => (
                            <CollapsibleBlock
                                value={getFieldValue('AI_suggest')}
                                placeholder={<span style={{ color: '#bfbfbf' }}>点击下方「校验」获取 AI 学习引导</span>}
                                maxPreviewLines={8}
                            />
                        )}
                    </Form.Item>
                )}
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
        <Form.Item label={null} className='check-btn-wrap'>
            <Flex align="center" justify="flex-end" gap={8} style={{ width: '100%' }}>
                <Tooltip title={useAiPro ? AI_MODEL_PRO : AI_MODEL_FLASH}>
                    <Switch
                        size="small"
                        checked={useAiPro}
                        checkedChildren="Pro"
                        unCheckedChildren="Flash"
                        onChange={setUseAiPro}
                    />
                </Tooltip>
                <Button onClick={() => handleCheck(true)} icon={<FontColorsOutlined />}>
                    校验
                </Button>
                {showRightAnswer && (
                    <Button type="primary" onClick={() => handleCheck(false)} icon={<CheckSquareOutlined />}>
                        提交
                    </Button>
                )}
            </Flex>
        </Form.Item>
    </Form>
}