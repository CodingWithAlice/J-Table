import { Modal, Statistic } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export interface CoinTrendItem {
    date: string;
    coins: number;
}

interface CoinStatsModalProps {
    open: boolean;
    onCancel: () => void;
    totalCoins: number;
    trendData: CoinTrendItem[];
}

export default function CoinStatsModal({
    open,
    onCancel,
    totalCoins,
    trendData,
}: CoinStatsModalProps) {
    // 折线图需要按时间正序（从左到右为时间递增）
    const chartData = [...trendData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <Modal
            title="金币统计"
            open={open}
            footer={null}
            onCancel={onCancel}
            width={600}
        >
            <Statistic
                title="总金币数"
                value={totalCoins}
                valueStyle={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#1890ff",
                }}
            />
            <div style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 16 }}>最近30天趋势</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                                try {
                                    return value.slice(5); // 显示 MM-DD
                                } catch {
                                    return value;
                                }
                            }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                            label={{
                                value: "金币",
                                angle: -90,
                                position: "insideLeft",
                                style: { fontSize: 12 },
                            }}
                        />
                        <Tooltip
                            formatter={(value: number | undefined) => [`${value ?? 0} 金币`, "金币"]}
                            labelFormatter={(label) => `日期: ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="coins"
                            stroke="#1890ff"
                            strokeWidth={2}
                            dot={{ fill: "#1890ff", r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Modal>
    );
}
