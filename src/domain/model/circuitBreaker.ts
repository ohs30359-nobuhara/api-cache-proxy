/**
 * CircuitBreaker
 * @class
 */
export class CircuitBreaker {
  public readonly host: string;
  public readonly activeSpanSec: number;
  private readonly threshold: number;
  private records: Array<Record>;

  /**
   * @constructor
   * @param host ターゲットホスト
   * @param threshold 閾値
   * @param activeSpanSec 有効期限(sec)
   */
  public constructor(host: string, threshold: number, activeSpanSec: number) {
    this.host = host;
    this.threshold = threshold;
    this.activeSpanSec = activeSpanSec;
    this.records = [{timestamp: Date.now()}]
  }

  /**
   * isActive
   * @return true: リクエスト可, false: リクエスト不可
   */
  public isActive(): boolean {
    this.update();
    return this.threshold <= this.records.length;
  }

  /**
   * countUp
   */
  public countUp(): void {
    this.records.push({timestamp: Date.now()});
  }

  /**
   * 有効期限が切れたレコードを削除
   */
  private update(): void {
    const now: number = Date.now();

    this.records = this.records.filter(record => {
      const diff: number = now - record.timestamp;
      return (this.activeSpanSec >= Math.floor(diff/1000));
    });
  }

  /**
   * createFromJson
   * @param json
   */
  public static createFromJson(json: any): CircuitBreaker {
    return new CircuitBreaker(json.host, json.threshold, json.activeSpanSec);
  }
}

/**
 * Record
 * @interface
 */
interface Record {
  timestamp: number
}