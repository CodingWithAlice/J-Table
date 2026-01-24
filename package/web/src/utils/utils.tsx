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

// URL 检测正则表达式
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/**
 * 检测文本是否为 URL
 */
export function isUrl(text: string): boolean {
    return URL_REGEX.test(text.trim());
}

/**
 * 将文本中的 URL 转换为可点击的链接元素（使用 Ant Design Typography.Link）
 * @param text 要处理的文本
 * @param linkTitle 链接的显示标题，如果提供则使用此标题替代 URL 作为显示文本
 */
export function renderTextWithLinks(text: string | undefined | null, linkTitle?: string): React.ReactNode {
    if (!text) return text;
    
    // 如果整个文本就是一个 URL，直接返回链接
    const trimmedText = text.trim();
    if (isUrl(trimmedText)) {
        return (
            <Link href={trimmedText} target="_blank" rel="noopener noreferrer">
                {linkTitle || trimmedText}
            </Link>
        );
    }
    
    // 如果文本中包含 URL，将 URL 部分转换为链接
    const parts = text.split(URL_REGEX);
    return parts.map((part, index) => {
        if (isUrl(part)) {
            return (
                <Link key={index} href={part} target="_blank" rel="noopener noreferrer">
                    {linkTitle || part}
                </Link>
            );
        }
        return <span key={index}>{part}</span>;
    });
}
