import { Tooltip } from "antd";
import { parseQuestionTitle } from "../utils/formatQuestionTitle";
import QuestionStem from "./QuestionStem";

export default function LongPage({ title }: { title: string }) {
    const parsed = parseQuestionTitle(title);
    const needRichTip = parsed.hasCode || title.length > 70;
    const node = <p className="ltn-title">{title}</p>;
    if (!needRichTip) return node;
    return (
        <Tooltip
            color="#fff"
            title={<QuestionStem title={title} compact showOriginalToggle={false} />}
            overlayStyle={{ maxWidth: 560 }}
            overlayInnerStyle={{ maxHeight: 360, overflow: 'auto', color: '#1f1f1f' }}
        >
            {node}
        </Tooltip>
    );
}