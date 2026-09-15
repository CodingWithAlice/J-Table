import { Tag } from 'antd';
import { useMemo, useState } from 'react';
import {
    highlightJs,
    parseQuestionTitle,
    type HighlightToken,
    type QuestionSegment,
} from '../utils/formatQuestionTitle';
import { renderTextWithLinks } from '../utils/utils';

function CodeView({ code }: { code: string }) {
    const tokens = useMemo(() => highlightJs(code), [code]);
    return (
        <pre className="question-code">
            <code>
                {tokens.map((token, idx) => (
                    <span key={idx} className={tokenClass(token)}>{token.value}</span>
                ))}
            </code>
        </pre>
    );
}

function tokenClass(token: HighlightToken): string {
    if (token.type === 'plain') return '';
    return `question-code-${token.type}`;
}

function SegmentList({ segments }: { segments: QuestionSegment[] }) {
    const codeTotal = segments.filter((s) => s.type === 'code').length;
    let codeNo = 0;
    return (
        <>
            {segments.map((seg, idx) => {
                if (seg.type === 'code') codeNo += 1;
                return (
                    <div key={idx} className="question-segment">
                        {seg.type === 'code' ? (
                            <>
                                {codeTotal > 1 && (
                                    <div className="question-code-label">示例 {codeNo}</div>
                                )}
                                <CodeView code={seg.content} />
                            </>
                        ) : (
                            <div className="question-stem-text">{renderTextWithLinks(seg.content)}</div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default function QuestionStem({
    title,
    compact = false,
    showOriginalToggle = true,
}: {
    title: string;
    compact?: boolean;
    showOriginalToggle?: boolean;
}) {
    const parsed = useMemo(() => parseQuestionTitle(title), [title]);
    const [showOriginal, setShowOriginal] = useState(false);
    const allowOriginal = showOriginalToggle && (parsed.hasCode || parsed.segments.length > 0 || title.length > 80);
    const showHead = Boolean(parsed.boxLabel || allowOriginal);

    if (!title) return null;

    return (
        <div className={`question-stem${compact ? ' is-compact' : ''}`}>
            {showHead && (
                <div className="question-stem-head">
                    {parsed.boxLabel && <Tag color="blue">{parsed.boxLabel}</Tag>}
                    {allowOriginal && (
                        <button
                            type="button"
                            className="question-original-toggle"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowOriginal((v) => !v);
                            }}
                        >
                            {showOriginal ? '格式化显示' : '查看原文'}
                        </button>
                    )}
                </div>
            )}
            {showOriginal ? (
                <pre className="question-original">{title}</pre>
            ) : (
                <>
                    {parsed.stem && <div className="question-stem-text">{renderTextWithLinks(parsed.stem)}</div>}
                    <SegmentList segments={parsed.segments} />
                </>
            )}
        </div>
    );
}
