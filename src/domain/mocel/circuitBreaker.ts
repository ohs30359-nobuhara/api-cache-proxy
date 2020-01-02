/**
 * CircuitBreaker
 * @class
 */
export class CircuitBreaker {
  public readonly host: string;
  private readonly threshold: number;
  private count: number;
  private isForceMode: boolean

  /**
   * @constructor
   * @param host ターゲットホスト
   * @param threshold 閾値
   */
  public constructor(host: string, threshold: number) {
    this.host = host;
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