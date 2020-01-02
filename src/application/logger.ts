import { getLogger, configure, Logger as Log4js } from 'log4js';
import { get } from 'config';

/**
 * Logger
 * @class
 */
export class Logger {
  private stdout: Log4js;
  private stderr: Log4js;

  /**
   * @constructor
   */
  public constructor() {
    configure(get('log'));
    this.stdout = getLogger();
    this.stderr = getLogger();
  }

  /**
   * info
   * @param {Format} log
   */
  public info(log: Format): void {
    this.stdout.info(JSON.stringify(log));
  }

  /**
   * error
   * @param {Format} log
   *
   */
  public error(log: Format): void {
    this.stderr.error(JSON.stringify(log));
  }
}

/**
 * Format
 * @interface
 */
interface Format {
  message: string;
}


export const logger: Logger = new Logger();