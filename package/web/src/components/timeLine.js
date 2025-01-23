import React, { useEffect, useState } from 'react';
import { BellOutlined, MediumOutlined, ReadOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Timeline, Tooltip } from 'antd';
import './timeLine.css';
import { RoutineApi } from '../apis/routine';
import { TimeApi } from '../apis/time';

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

const ltnText = (time, type, ltnId, text, duration) => {
    const title = type === 'ltn' ? `LTN${ltnId}` : '错题重做';
    return <Tooltip title={title}>
        <span className='time-ltn'>
            {/* <span className='time-ltn-id'>{ltnId}</span> */}
            {/* <span className='time-ltn-time'>{time}</span> */}
            {text} &nbsp; {duration}
        </span>
    </Tooltip>
}

export default function TimeLine() {
    const [items, setItems] = useState([]);
    const [line, setLine] = useState(10);

    useEffect(() => {
        RoutineApi.list().then(routineTypes => {
            TimeApi.list().then(times => {
                setItems(transformItems(times, routineTypes))
            })
        })
    }, []);

    const transformItems = (times, routineTypes) => {
        return times.map(time => {
            let dotRoutine = routineTypes.filter(routine => time.routineTypeId === routine.id);
            let dotType = dotRoutine.length > 0 ? dotRoutine[0].type : 'thing';

            let children = text(time.date, dotType, time.des);
            if (dotType === 'LTN') {
                dotType = time.ltnWrong ? 'wrong' : 'ltn';
                children = ltnText(time.date, dotType, time.ltnId, time.des, time.duration);
            }
            return {
                children,
                ...dotList[dotType],
                label: time.date,
            }
        })
    }

    return <Timeline
        mode="left"
        items={items}
    />
}