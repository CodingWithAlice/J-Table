import { PlayCircleOutlined } from "@ant-design/icons";
import { FloatButton, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LtnApi } from "../apis/ltn";
import { buildAnswerPath, flattenLtns, sortLtnsForPractice } from "../utils/practiceQueue";

export default function StartPracticeBtn({ insetInlineEnd = 374 }: { insetInlineEnd?: number }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await LtnApi.list();
            const first = sortLtnsForPractice(flattenLtns(data))[0];
            if (!first) {
                message.warning("暂无题目");
                return;
            }
            navigate(buildAnswerPath(first));
        } catch (e) {
            message.error(e instanceof Error ? e.message : "获取题目失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FloatButton
            shape="square"
            type="primary"
            style={{ insetInlineEnd }}
            description="开始"
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
        />
    );
}
