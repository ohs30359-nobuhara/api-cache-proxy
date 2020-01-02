/**
 * CircuitBreaker
 * @class
 */
export class CircuitBreaker {
  public readonly host: string;
  public readonly activeSpanMs: number;
  private readonly threshold: number;
  private count: number;
  private isForceMode: boolean;

  /**
   * @constructor
   * @param host ターゲットホスト
   * @param threshold 閾値
   * @param activeSpanMs 有効期限(ms)
   * @param count
   * @param isForceMode 強制実行モード
   */
  public constructor(host: string, threshold: number, activeSpanMs: number, count: number = 0, isForceMode: boolean = false) {
    this.host = host;
    this.threshold = threshold;
    this.activeSpanMs = activeSpanMs;
    this.count = count;
    this.isForceMode = isForceMode;
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