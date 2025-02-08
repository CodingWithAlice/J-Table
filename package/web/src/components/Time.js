import React, { useEffect, useState } from 'react';
import { BellOutlined, MediumOutlined, ReadOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Tag, Timeline, Tooltip } from 'antd';
import './time.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

const dotList = {
    LTN: {
        color: 'blue',
    },
    wrong: {
        color: 'red',
    },
    reading: {
        dot: (<ReadOutlined style={{
            fontSize: '16px',
        }} />)
    },
    TED: {
        dot: (
            <YoutubeOutlined style={{
                fontSize: '16px',
            }} />
        )
    },
    movie: {
        dot: (
            <MediumOutlined style={{
                fontSize: '16px',
            }} />
        )
    },
    thing: {
        dot: (
            <BellOutlined
                style={{
                    fontSize: '16px',
                }}
            />
        )
    }
}
const text = (time, type, text) => {
    return <span>
        {type.toUpperCase()} &nbsp;
        &nbsp; {text}
    </span>
}

const ltnText = (time, type, ltnId, text, duration, gap) => {
    const title = type === 'LTN' ? `LTN${ltnId}` : '错题重做';
    return <Tooltip title={title}>
        <span className='time-ltn'>
            {!!gap && <Tag className='time-ltn-tag'>{gap}天</Tag>}
            <span className='time-ltn-time'>{time}</span>
            <span className='time-ltn-text'>{text}</span>
            {duration}
        </span>
    </Tooltip>
}

export default function Time({ params, timeData }) {
    const [items, setItems] = useState([]);
    const [mode, setMode] = useState('alternate');

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
    }, [items])

    const addLabel = (arr) => {
        return arr.map(it => ({ ...it, label: it.date }))
    }
    const removeLabel = (arr) => {
        return arr.map(it => { delete it.label; return it })
    }
    const filterFun = (filters, arr) => {
        let res = arr;
        if (filters.type) {
            res = arr.filter(it => it.routineType === filters.type && !it.ltnWrong);
        }
        if (filters.count) {
            res = res.slice(0, filters.count);
        }
        return res;
    }

    const transformItems = (times) => {
        return times.map((time) => {
            let dotType = time.routineType;
            let children = text(time.date, dotType, time.des);
            if (dotType === 'LTN') {
                dotType = time.ltnWrong ? 'wrong' : 'LTN';
                children = ltnText(time.date, dotType, time.serialNumber, time.des, time.duration, time.gap);
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