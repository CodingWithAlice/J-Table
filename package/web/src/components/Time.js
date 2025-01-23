import React, { useEffect, useState } from 'react';
import { BellOutlined, MediumOutlined, ReadOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Tag, Timeline, Tooltip } from 'antd';
import './time.css';
import { RoutineApi } from '../apis/routine';
import { TimeApi } from '../apis/time';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

const dotList = {
    ltn: {
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
    return <p>
        {type.toUpperCase()} &nbsp;
        {/* <span className='time-ltn-time'>{time}</span> */}
        &nbsp; {text}
    </p>
}

const ltnText = (time, type, ltnId, text, duration, gap) => {
    const title = type === 'ltn' ? `LTN${ltnId}` : '错题重做';
    return <Tooltip title={title}>
        <span className='time-ltn'>
            {!!gap && <Tag className='time-ltn-tag'>{gap}天</Tag>}
            <span className='time-ltn-time'>{time}</span>
            <span className='time-ltn-text'>{text}</span>
            {duration}
        </span>
    </Tooltip>
}

export default function Time({ params }) {
    const [items, setItems] = useState([]);
    const [mode, setMode] = useState('alternate');

    const getItems = (types) => {
        TimeApi.list().then(times => {
            const data = transformItems(times, types)
            setItems(filterFun(params, data))
        })
    }

    useEffect(() => {
        RoutineApi.list().then(routineTypes => {
            getItems(routineTypes);
        })
    }, []);

    const filterFun = (params, arr) => {
        let res = arr;
        if (params.type) {
            res = arr.filter(it => it.type === params.type);
        }
        if(params.count) {
            res = res.slice(0, params.count);
        }
        return res;
    }

    const transformItems = (times, types) => {
        return times.map((time, index) => {
            let dotRoutine = types.filter(routine => time.routineTypeId === routine.id);
            let dotType = dotRoutine.length > 0 ? dotRoutine[0].type : 'thing';

            let children = text(time.date, dotType, time.des);
            if (dotType === 'LTN') {
                dotType = time.ltnWrong ? 'wrong' : 'ltn';
                children = ltnText(time.date, dotType, time.ltnId, time.des, time.duration, time.gap);
            }
            return {
                children,
                ...dotList[dotType],
                // label: time.date,
                type: dotType,
            }
        })
    }

    return <Timeline
        mode={mode}
        items={items}
    />
}