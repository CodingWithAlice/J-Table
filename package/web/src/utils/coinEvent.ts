// 金币事件管理器
class CoinEventEmitter {
  private listeners: Map<string, Set<() => void>> = new Map();

  // 监听金币变更事件
  on(event: string, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  // 移除监听
  off(event: string, callback: () => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  // 触发事件
  emit(event: string) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }
}

// 导出单例
export const coinEventEmitter = new CoinEventEmitter();

// 事件名称常量
export const COIN_CHANGED_EVENT = 'coinChanged';

