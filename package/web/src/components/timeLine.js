import React from 'react';
import { BellOutlined, ClockCircleOutlined, MediumOutlined, ReadOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Timeline, Tooltip } from 'antd';
import './timeLine.css';

const dotList = {
    ltn: {
        color: 'green',
    },
    wrong: {
        color: 'blue',
    },
    read: {
        dot: (<ReadOutlined style={{
            fontSize: '16px',
        }} />)
    },
    ted: {
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

export default function TimeLine() {
    const text = (time, type, text) => {
        return <p>
            {type.toUpperCase()} &nbsp;
            <span className='time-ltn-time'>{time}</span>
            &nbsp; {text}
        </p>
    }

    const ltnText = (time, type, ltnId, text, duration) => {
        const title = type === 'ltn' ? `LTN${ltnId}` : '错题重做';
        return <Tooltip title={title}>
            <p className='time-ltn'>
                <span className='time-ltn-id'>{ltnId}</span>
                <span className='time-ltn-time'>{time}</span>
                {text} &nbsp; {duration}
            </p>
        </Tooltip>
    }
    const items = [
        {
            children: ltnText('2024.9.28', 'ltn', 1, ' 39周 6题/1题'),
            // label:'22'
            ...dotList['ltn']
        },
        {
            children: ltnText('2024.9.28', 'wrong', 2, ' 39周 6题/1题'),
            ...dotList['wrong']
        },
        {
            children: 'read',
            ...dotList['read']
        },
        {
            children: text('2025.1.20', 'ted', 'Round1'),
            ...dotList['ted']
        },
        {
            children: ltnText('2025.1.6', 'ltn', 13, '1周 76题/28题', '25h40m'),
            ...dotList['ltn']
        },
        {
            ...dotList['movie'],
            children: 'movie',
        },
        {
            ...dotList['thing'],
            children: 'thing',
        },
        {
            dot: (
                <ClockCircleOutlined
                    style={{
                        fontSize: '16px',
                    }}
                />
            ),
            children: '66',
        },
    ]
    return <Timeline
        mode="alternate"
        items={items}
    />
}