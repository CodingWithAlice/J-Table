import React from 'react';
import { Typography } from 'antd';

const { Link } = Typography;

// 分类共三类：Learning、Life、Health
export const Category = {
    learning: 'Learning',
    life: 'Life',
    health: 'Health',
}
export const CategoryColor = {
    Learning: 'green',
    Life: 'pink',
    Health: 'volcano'
}

// 每次调用新建，避免 /g 正则的 lastIndex 在多次 exec 之间串状态。
const markdownLink = () => /\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g;

/**
 * 只把 [文章标题](url) 渲染成链接，其余文本保持原样。
 */
export function renderTextWithLinks(text: string | undefined | null): React.ReactNode {
    if (!text) return text;

    const re = markdownLink();
    const nodes: React.ReactNode[] = [];
    let last = 0;
    let index = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(text)) !== null) {
        const start = match.index;
        if (start > last) {
            nodes.push(<span key={`t-${index}`}>{text.slice(last, start)}</span>);
        }
        nodes.push(
            <Link key={`l-${index}`} href={match[2]} target="_blank" rel="noopener noreferrer">
                {match[1]}
            </Link>
        );
        last = start + match[0].length;
        index += 1;
    }

    if (index === 0) return text;
    if (last < text.length) {
        nodes.push(<span key="t-end">{text.slice(last)}</span>);
    }
    return nodes;
}
