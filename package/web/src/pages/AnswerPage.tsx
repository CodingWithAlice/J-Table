import { Button, Card, Space } from "antd";
import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Answer from "../components/Answer";

function buildReturnUrl(opts: { modal?: string | null; refresh?: string }) {
    const modal = opts.modal ?? '';
    if (!modal) return '/';
    const sp = new URLSearchParams();
    sp.set('modal', modal);
    sp.set('refresh', opts.refresh ?? String(Date.now()));
    return `/?${sp.toString()}`;
}

export default function AnswerPage() {
    const navigate = useNavigate();
    const { topicId } = useParams();
    const [searchParams] = useSearchParams();

    const id = useMemo(() => {
        const n = Number(topicId);
        return Number.isFinite(n) ? n : 0;
    }, [topicId]);

    const title = searchParams.get('title') || '';
    const placeholder = searchParams.get('placeholder') || '请输入正确答案';
    const lastStatus = searchParams.get('lastStatus') === '1';
    const returnModal = searchParams.get('returnModal'); // e.g. redoNextDay | minDateFilter

    const backUrl = useMemo(() => buildReturnUrl({ modal: returnModal }), [returnModal]);

    if (!id) {
        return (
            <div style={{ padding: 16 }}>
                <Card>
                    <Space direction="vertical">
                        <div>题目 ID 不正确</div>
                        <Button onClick={() => navigate('/', { replace: true })}>返回</Button>
                    </Space>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: 12, maxWidth: 980, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Button onClick={() => navigate(backUrl, { replace: true })}>返回列表</Button>
                <div style={{ fontWeight: 600, flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
                    {title || `题目 ${id}`}
                </div>
            </div>
            <Card>
                <Answer
                    topicId={id}
                    title={title || `题目 ${id}`}
                    placeholder={placeholder}
                    lastStatus={lastStatus}
                    closeModal={() => navigate(backUrl, { replace: true })}
                />
            </Card>
        </div>
    );
}

