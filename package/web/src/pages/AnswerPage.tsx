import { Button, Card, Space, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Answer from "../components/Answer";
import { LtnApi } from "../apis/ltn";
import { buildAnswerPath, flattenLtns, sortLtnsForPractice } from "../utils/practiceQueue";

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
    const [hasNext, setHasNext] = useState(true);
    const [nextLoading, setNextLoading] = useState(false);

    const id = useMemo(() => {
        const n = Number(topicId);
        return Number.isFinite(n) ? n : 0;
    }, [topicId]);

    const title = searchParams.get('title') || '';
    const placeholder = searchParams.get('placeholder') || '请输入正确答案';
    const lastStatus = searchParams.get('lastStatus') === '1';
    const returnModal = searchParams.get('returnModal'); // e.g. redoNextDay | minDateFilter

    const navigateBack = useCallback(() => {
        navigate(buildReturnUrl({ modal: returnModal }), { replace: true });
    }, [navigate, returnModal]);

    useEffect(() => {
        if (!id) {
            setHasNext(false);
            return;
        }
        LtnApi.list().then((data) => {
            const sorted = sortLtnsForPractice(flattenLtns(data));
            const idx = sorted.findIndex((it) => it.id === id);
            setHasNext(idx >= 0 && idx < sorted.length - 1);
        }).catch(() => {
            setHasNext(false);
        });
    }, [id]);

    const goNext = useCallback(async () => {
        if (nextLoading) return;
        setNextLoading(true);
        try {
            const data = await LtnApi.list();
            const sorted = sortLtnsForPractice(flattenLtns(data));
            const idx = sorted.findIndex((it) => it.id === id);
            const next = idx >= 0 ? sorted[idx + 1] : sorted[0];
            if (!next) {
                message.info('已经是最后一题');
                setHasNext(false);
                return;
            }
            navigate(buildAnswerPath(next, { returnModal }));
        } catch (e) {
            message.error(e instanceof Error ? e.message : '获取下一题失败');
        } finally {
            setNextLoading(false);
        }
    }, [id, navigate, nextLoading, returnModal]);

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
                <Button onClick={navigateBack}>返回列表</Button>
                <div style={{ fontWeight: 600, flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
                    {title || `题目 ${id}`}
                </div>
                <Button onClick={goNext} loading={nextLoading} disabled={!hasNext}>
                    下一题
                </Button>
            </div>
            <Card>
                <Answer
                    topicId={id}
                    title={title || `题目 ${id}`}
                    placeholder={placeholder}
                    lastStatus={lastStatus}
                    closeModal={navigateBack}
                />
            </Card>
        </div>
    );
}
