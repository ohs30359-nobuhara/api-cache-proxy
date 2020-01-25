/**
 * CircuitBreaker
 * @class
 */
export class CircuitBreaker {
  public readonly host: string;
  public readonly activeSpanSec: number;
  private readonly threshold: number;
  private count: number;
  private isForceMode: boolean;
  private readonly timestamp: number;

  /**
   * @constructor
   * @param host ターゲットホスト
   * @param threshold 閾値
   * @param activeSpanSec 有効期限(sec)
   * @param count
   * @param isForceMode 強制実行モード
   */
  public constructor(host: string, threshold: number, activeSpanSec: number, count: number = 0, isForceMode: boolean = false) {
    this.host = host;
    this.threshold = threshold;
    this.activeSpanSec = activeSpanSec;
    this.count = count;
    this.isForceMode = isForceMode;
    this.timestamp = Date.now();
  }

  /**
   * isActive
   */
  public isActive(): boolean {
    // 強制モードが有効なら常に有効
    if (this.isForceMode) {
      return true;
    }

    return this.threshold <= this.count;
  }

  /**
   * isOverdue
   */
  public isOverdue(): boolean {
    const diffMs: number = Date.now() - this.timestamp;
    return this.activeSpanSec >= Math.floor(diffMs / 1000);
  }

  /**
   * countUp
   */
  public countUp(): number {
    this.count = this.count + 1;
    return this.count;
  }

  /**
   * forceEffectiveness
   * 強制的にサーキットブレーカーを有効化
   */
  public forceEffectiveness(): void {
    this.isForceMode = true;
  }

  /**
   * forceInvalid
   * 強制的にサーキットブレーカーを無効化
   */
  public forceInvalid(): void {
    this.isForceMode = false;
  }

  /**
   * createFromJson
   * @param json
   */
  public static createFromJson(json: any): CircuitBreaker {
    return new CircuitBreaker(json.host, json.threshold, json.activeSpanSec, json.count, json.isForceMode);
  }
}