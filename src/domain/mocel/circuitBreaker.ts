/**
 * CircuitBreaker
 * @class
 */
export class CircuitBreaker {
  public readonly host: string;
  private readonly threshold: number;
  private readonly activeSpanMs: number;
  private timestamp: number;
  private count: number;
  private isForceMode: boolean

  /**
   * @constructor
   * @param host ターゲットホスト
   * @param threshold 閾値
   * @param activeSpanMs 有効期限(ms)
   */
  public constructor(host: string, threshold: number, activeSpanMs: number) {
    this.host = host;
    this.timestamp = Date.now();
    this.activeSpanMs = activeSpanMs;
    this.threshold = threshold;
    this.count = 1;
    this.isForceMode = false;
  }

  /**
   * execTriggerCheck
   * サーキットブレーカー実行判定
   */
  public execTriggerCheck() {
    // 強制有効状態ならtrue
    if (this.isForceMode) {
      return true;
    }

    // 有効時間外ならカウントとtimestampを初期化
    if (!this.checkEffectiveSpan()) {
      this.refresh();
    }

    // カウントアップ後, 閾値判定
    return this.threshold < this.countUp();
  }

  /**
   * countUp
   */
  private countUp(): number {
    this.count = this.count ++;
    return this.count;
  }

  /**
   * refresh
   * カウントとtimestampを初期化
   */
  private refresh(): void {
    this.count = 0;
    this.timestamp = Date.now();
  }

  /**
   * checkEffectiveSpan
   * 有効時間内判定
   */
  private checkEffectiveSpan() {
    const diff: number = Date.now() - this.timestamp ;

    return (diff < this.activeSpanMs);
  }

  /**
   * forceEffectiveness
   * 強制的にサーキットブレーカーを有効化
   */
  public forceEffectiveness(): void {
    this.isForceMode = true;
  }

  /**
   * forceExec
   * 強制的にサーキットブレーカーを有効化
   */
  public forceInvalid(): void {
    this.isForceMode = false;
  }
}