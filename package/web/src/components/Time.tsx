import React, { useEffect, useState, JSX } from 'react';
import { BellOutlined, MediumOutlined, ReadOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Tag, Timeline, Tooltip } from 'antd';
import './time.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

interface ParamsProps {
    type?: string;
    count?: number;
}
interface TimeProps {
    params: ParamsProps,
    timeData: TimeDTO[];
}

interface TimeDTO {
    routineTypeId: number
    serialNumber: number
    des: string;
    duration: string;
    date: string;
    ltnWrong: boolean;
    gap: number;
    routineType: string;
    label?: string;
}

interface ItemProps {
    label?: string;
    children: JSX.Element;
    type: string,
    date: string,
    color?: string;
    dot?: JSX.Element;
}

const dotList: { [key in 'LTN' | 'wrong' | 'reading' | 'TED' | 'movie' | 'thing']: { color?: string; dot?: JSX.Element } } = {
    LTN: {
        color: '#4E6EF2',
    },
    wrong: {
        color: '#FF6B81',
    },
    reading: {
        dot: (<ReadOutlined style={{
            fontSize: '16px',
        }} />),
        color: '#58C2A9',
    },
    TED: {
        dot: (
            <YoutubeOutlined style={{
                fontSize: '16px',
            }} />
        ),
        color: '#FF9F43',
    },
    movie: {
        dot: (
            <MediumOutlined style={{
                fontSize: '16px',
            }} />
        ),
        color: '#9C51B6',
    },
    thing: {
        dot: (
            <BellOutlined
                style={{
                    fontSize: '16px',
                }}
            />
        ),
        color: '#6C757D',
    }
}
const getText = (type: string, text: string) => {
    console.log({type});
    
    return <span>
        {type?.toUpperCase()} &nbsp;
        &nbsp; {text}
    </span>
}

const transLtnText = (time: string, type: string, ltnId: number, text: string, duration: string) => {
    const title = type === 'LTN' ? `LTN${ltnId}` : '错题重做';
    return <Tooltip title={title}>
        <span className='time-ltn'>
            {!!duration && <Tag className='time-ltn-tag'>{duration}天</Tag>}
            <span className='time-ltn-time'>{time}</span>
            <span className='time-ltn-text'>{text}</span>
        </span>
    </Tooltip>
}

export default function Time({ params, timeData }: TimeProps) {
    console.log({params, timeData});
    
    const [items, setItems] = useState<ItemProps[]>([]);
    const [mode, setMode] = useState<'alternate' | "left" | "right">('alternate');

    useEffect(() => {
        if (!timeData) return;
        if (!params?.type) {
            const res = transformItems(timeData);
            setItems(addLabel(res));
        } else {
            const res = transformItems(filterFun(params, removeLabel(timeData)));
            setItems(res)
        }
    }, [params, timeData])

    useEffect(() => {
        if (!params?.type) {
            setMode('left');
        } else {
            setMode('alternate');
        }
    }, [items, params?.type])

    const addLabel = (arr: ItemProps[]) => {
        return arr.map(it => ({ ...it, label: it.date }))
    }
    const removeLabel = (arr: TimeDTO[]) => {
        return arr.map(it => { delete it.label; return it })
    }
    const filterFun = (filters: ParamsProps, arr: TimeDTO[]) => {
        let res = arr;
        if (filters.type) {
            res = arr.filter(it => it.routineType === filters.type && !it.ltnWrong);
        }
        if (filters.count) {
            res = res.slice(0, filters.count);
        }
        return res;
    }

    const transformItems = (times: TimeDTO[]) => {
        return times.map((time) => {
            let dotType = time.routineType as keyof typeof dotList;
            let children = getText(dotType, time.des);
            if (dotType === 'LTN') {
                children = transLtnText(time.date, dotType, time.serialNumber, time.des, time.duration);
            }
            return {
                children,
                ...dotList[dotType],
                type: dotType,
                date: time.date
            }
        })
    }

    return <Timeline
        mode={mode}
        items={items}
    />
}