import { Mutex } from 'async-mutex';

export class MutexValue<T> {
  private readonly creator: () => Promise<T>;
  private readonly _mutex = new Mutex();
  private _value: T | null = null;

  private ignoreOpsStartedBefore: number | null = null;

  constructor(creator: () => Promise<T>) {
    this.creator = creator;
    this.getValue = this.getValue.bind(this);
    this.freshValue = this.freshValue.bind(this);
    this.invalidate = this.invalidate.bind(this);
    this.isSet = this.isSet.bind(this);
  }

  isSet() {
    return this._value != null;
  }

  async getValue(): Promise<T> {
    let startedAt = performance.now();
    return this._mutex.runExclusive(async () => {
      if (this._value !== null) {
        return this._value;
      }

      const result = await this.runCreator();
      const shouldIgnore = this.ignoreOpsStartedBefore
        ? startedAt < this.ignoreOpsStartedBefore
        : false;

      if (!shouldIgnore) {
        this._value = result;
      }

      return this._value as T;
    });
  }

  setValue(val: T, overrideCurrentOps: boolean = false) {
    this._value = val;
    this.ignoreOpsStartedBefore = overrideCurrentOps ? performance.now() : null;
  }

  async freshValue() {
    this.invalidate();
    return this.getValue();
  }

  invalidate() {
    this._value = null;
  }

  /**
   * Extracted for testing purposes
   */
  runCreator() {
    return this.creator();
  }
}
