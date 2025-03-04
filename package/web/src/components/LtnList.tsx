import { Avatar } from "antd";
import dayjs from "dayjs";
import Grade from "./Grade";
import LongPage from "./LongPage";
import { LtnDTO } from "./LtnTable";

interface LtnListProps {
    list: LtnDTO[],
    boxId: number, 
    fresh: () => void
}

export default function LtnList({ list, boxId, fresh }: LtnListProps) {
    const getNextTime = (solveTime: string) => {
        return dayjs(solveTime || '2025-01-20').add(boxId * 7, 'day').format('YYYY-MM-DD');
    }
    const sortList = list.sort((a, b) => {
        ;
        return dayjs(a.solveTime).isBefore(dayjs(b.solveTime)) ? -1 : 1;
    })
    return <div className="ltn-list">
        {sortList.map((it, index) => <div key={it.id} className="ltn-item">
            {/* 序号 */}
            <Avatar className="ltn-avatar" size='small'>{index + 1}</Avatar>
            {/* 默认单行展示 - 过长通过悬浮展示 */}
            <LongPage title={it.title} />
            {/* 升降 */}
            <Grade boxId={boxId} fresh={fresh} ltnId={it.id} />
            {/* 下次做题时间 */}
            {it.solveTime &&
                <span className="ltn-time">{getNextTime(it.solveTime)}</span>}
        </div>)}
    </div>
}