import { DollarOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useEffect, useState, useCallback } from "react";
import { CoinApi } from "../apis/coin";
import { coinEventEmitter, COIN_CHANGED_EVENT } from "../utils/coinEvent";
import CoinStatsModal from "./CoinStatsModal";

export default function CoinStatsBtn({ insetInlineEnd = 374 }: { insetInlineEnd?: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalCoins, setTotalCoins] = useState<number>(0);
    const [yearTarget, setYearTarget] = useState<number | null>(null);
    const [trendData, setTrendData] = useState<Array<{ date: string; coins: number }>>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const loadTotalCoins = useCallback(() => {
        CoinApi.getTotal().then((res) => {
            if (res && typeof res === "object") {
                setTotalCoins(res.total || 0);
                setYearTarget(
                    typeof res.yearTarget === "number" ? res.yearTarget : null,
                );
                return;
            }
            // 兼容旧接口直接返回数字
            setTotalCoins(typeof res === "number" ? res : 0);
        });
    }, []);

    const loadData = useCallback(() => {
        loadTotalCoins();

        CoinApi.getTrend(30).then((res) => {
            setTrendData(res || []);
        });
    }, [loadTotalCoins]);

    useEffect(() => {
        loadTotalCoins();

        const handleCoinChanged = () => {
            loadTotalCoins();
        };

        coinEventEmitter.on(COIN_CHANGED_EVENT, handleCoinChanged);

        return () => {
            coinEventEmitter.off(COIN_CHANGED_EVENT, handleCoinChanged);
        };
    }, [loadTotalCoins]);

    useEffect(() => {
        if (isModalOpen) {
            loadData();
        }
    }, [isModalOpen, loadData]);

    return <>
        <FloatButton
            className="coin-stats-float-btn"
            shape="square"
            type="primary"
            style={{
                insetInlineEnd,
            }}
            description={<span className="coin-stats-float-btn__desc">💰 {totalCoins}</span>}
            icon={<DollarOutlined />}
            onClick={showModal}
        />
        <CoinStatsModal
            open={isModalOpen}
            onCancel={handleCancel}
            totalCoins={totalCoins}
            yearTarget={yearTarget}
            trendData={trendData}
        />
    </>
}
