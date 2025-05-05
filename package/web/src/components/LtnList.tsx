import { Avatar } from "antd";
import dayjs from "dayjs";
// import Grade from "./Grade";
import LongPage from "./LongPage";
import { LtnDTO } from "./LtnTable";
import { useMediaQuery } from '@mui/material';
import AnswerModal from "./AnswerModal";
interface LtnListProps {
    list: LtnDTO[],
    boxId?: number,
    fresh?: () => void,
    lastStatus?: boolean
}

export default function LtnList({ list, boxId, lastStatus }: LtnListProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const getNextTime = (solveTime: string, customDuration: number) => {
        const date = dayjs(solveTime || '2025-01-20').add(customDuration, 'day').format('YYYY-MM-DD');
        return isMobile ? date.slice(5) : date;
    }
    const sortList = list.sort((a, b) => {
        return dayjs(a.solveTime).isBefore(dayjs(b.solveTime)) ? -1 : 1;
    })
    return <div className="ltn-list">
        {sortList.map((it, index) => <div key={it.id} className="ltn-item">
            {/* 序号 */}
            <Avatar className="ltn-avatar" size='small'>{index + 1}</Avatar>
            {/* 默认单行展示 - 过长通过悬浮展示 */}
            <LongPage title={it.title} />
            {/* 做题弹窗 */}
            <AnswerModal title={lastStatus ? `【BOX${boxId}】${it.title}` : ''} type="answer" topicId={it.id} lastStatus={lastStatus} />
            {/* 升降 */}
            {/* <Grade boxId={boxId} fresh={fresh} ltnId={it.id} /> */}
            {/* 下次做题时间 */}
            {it.solveTime && !lastStatus &&
                <span className="ltn-time">{getNextTime(it.solveTime, it.customDuration)}</span>}
            {/* 修改弹窗答案 - 隔天重做时，没有 boxId */}
            {!lastStatus && <AnswerModal title={it.title} type="rightAnswer" topicId={+it.id} />}
        </div>)}
    </div>
}