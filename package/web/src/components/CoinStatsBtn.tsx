import { DollarOutlined } from "@ant-design/icons";
import { FloatButton, Modal, Statistic, List, Tag } from "antd";
import { useEffect, useState, useCallback, useRef } from "react";
import { CoinApi } from "../apis/coin";
import dayjs from "dayjs";
import { coinEventEmitter, COIN_CHANGED_EVENT } from "../utils/coinEvent";

export default function CoinStatsBtn() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalCoins, setTotalCoins] = useState<number>(0);
    const [trendData, setTrendData] = useState<Array<{ date: string; coins: number }>>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const loadTotalCoins = useCallback(() => {
        // 加载总金币数
        CoinApi.getTotal().then((res) => {
            setTotalCoins(res || 0);
        });
    }, []);

    const loadData = useCallback(() => {
        // 加载总金币数
        loadTotalCoins();

        // 加载趋势数据（最近30天）
        CoinApi.getTrend(30).then((res) => {
            setTrendData(res || []);
        });
    }, [loadTotalCoins]);

    useEffect(() => {
        // 初始化加载总金币数
        loadTotalCoins();

        // 监听金币变更事件
        const handleCoinChanged = () => {
            // 只刷新总金币数，不刷新趋势数据（除非弹窗打开）
            loadTotalCoins();
        };

        coinEventEmitter.on(COIN_CHANGED_EVENT, handleCoinChanged);

        // 清理监听器
        return () => {
            coinEventEmitter.off(COIN_CHANGED_EVENT, handleCoinChanged);
        };
    }, [loadTotalCoins]);

    useEffect(() => {
        if (isModalOpen) {
            loadData();
        }
    }, [isModalOpen]);

    return <>
        <FloatButton
            shape="square"
            type="primary"
            style={{
                insetInlineEnd: 374,
            }}
            description={`💰 ${totalCoins}`}
            icon={<DollarOutlined />}
            onClick={showModal}
        />
        <Modal
            title="金币统计"
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
            width={600}
        >
            <Statistic
                title="总金币数"
                value={totalCoins}
                valueStyle={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}
            />
            <div style={{ marginTop: 24 }}>
                <h3>最近30天趋势</h3>
                <List
                    dataSource={trendData}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.date}
                                description={<Tag color="gold">{item.coins} 金币</Tag>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    </>
}

