/** Declaration file generated by dts-gen */

export = ymp3d;

declare class ymp3d {
  constructor(...args: any[]);

  Download(url: string, outPath?: string): Promise<any>;

  static captureRejectionSymbol: any;

  static captureRejections: boolean;

  static defaultMaxListeners: number;

  static errorMonitor: any;

  static getEventListeners(emitterOrTarget: any, type: any): any;

  static init(opts: any): void;

  static kMaxEventTargetListeners: any;

  static kMaxEventTargetListenersWarned: any;

  static listenerCount(emitter: any, type: any): any;

  static on(emitter: any, event: any, options: any): any;

  on<T = string>(
    emitter: any,
    event: (fileName: T) => any,
    options?: any
  ): void;

  static once(emitter: any, name: any, options: any): any;

  static setMaxListeners(n: any, eventTargets: any): void;

  static usingDomains: boolean;
}

declare namespace ymp3d {
  class EventEmitter {
    constructor(opts: any);

    addListener(type: any, listener: any): any;

    emit(type: any, args: any): any;

    eventNames(): any;

    getMaxListeners(): any;

    listenerCount(type: any): any;

    listeners(type: any): any;

    off(type: any, listener: any): any;

    on(type: any, listener: any): any;

    once(type: any, listener: any): any;

    prependListener(type: any, listener: any): any;

    prependOnceListener(type: any, listener: any): any;

    rawListeners(type: any): any;

    removeAllListeners(type: any, ...args: any[]): any;

    removeListener(type: any, listener: any): any;

    setMaxListeners(n: any): any;

    static EventEmitter: any;

    static captureRejectionSymbol: any;

    static captureRejections: boolean;

    static defaultMaxListeners: number;

    static errorMonitor: any;

    static getEventListeners(emitterOrTarget: any, type: any): any;

    static init(opts: any): void;

    static kMaxEventTargetListeners: any;

    static kMaxEventTargetListenersWarned: any;

    static listenerCount(emitter: any, type: any): any;

    static on(emitter: any, event: any, options: any): any;

    static once(emitter: any, name: any, options: any): any;

    static setMaxListeners(n: any, eventTargets: any): void;

    static usingDomains: boolean;
  }

  class EventEmitterAsyncResource {
    constructor(...args: any[]);

    emit(...args: any[]): void;

    emitDestroy(...args: any[]): void;

    static EventEmitterAsyncResource: any;

    static captureRejectionSymbol: any;

    static captureRejections: boolean;

    static defaultMaxListeners: number;

    static errorMonitor: any;

    static getEventListeners(emitterOrTarget: any, type: any): any;

    static init(opts: any): void;

    static kMaxEventTargetListeners: any;

    static kMaxEventTargetListenersWarned: any;

    static listenerCount(emitter: any, type: any): any;

    static on(emitter: any, event: any, options: any): any;

    static once(emitter: any, name: any, options: any): any;

    static setMaxListeners(n: any, eventTargets: any): void;

    static usingDomains: boolean;
  }

  namespace EventEmitter {
    class EventEmitterAsyncResource {
      constructor(...args: any[]);

      emit(...args: any[]): void;

      emitDestroy(...args: any[]): void;

      static EventEmitter: any;

      static EventEmitterAsyncResource: any;

      static captureRejectionSymbol: any;

      static captureRejections: boolean;

      static defaultMaxListeners: number;

      static errorMonitor: any;

      static getEventListeners(emitterOrTarget: any, type: any): any;

      static init(opts: any): void;

      static kMaxEventTargetListeners: any;

      static kMaxEventTargetListenersWarned: any;

      static listenerCount(emitter: any, type: any): any;

      static on(emitter: any, event: any, options: any): any;

      static once(emitter: any, name: any, options: any): any;

      static setMaxListeners(n: any, eventTargets: any): void;

      static usingDomains: boolean;
    }
  }

  namespace EventEmitterAsyncResource {
    class EventEmitter {
      constructor(opts: any);

      addListener(type: any, listener: any): any;

      emit(type: any, args: any): any;

      eventNames(): any;

      getMaxListeners(): any;

      listenerCount(type: any): any;

      listeners(type: any): any;

      off(type: any, listener: any): any;

      on(type: any, listener: any): any;

      once(type: any, listener: any): any;

      prependListener(type: any, listener: any): any;

      prependOnceListener(type: any, listener: any): any;

      rawListeners(type: any): any;

      removeAllListeners(type: any, ...args: any[]): any;

      removeListener(type: any, listener: any): any;

      setMaxListeners(n: any): any;

      static EventEmitter: any;

      static EventEmitterAsyncResource: any;

      static captureRejectionSymbol: any;

      static captureRejections: boolean;

      static defaultMaxListeners: number;

      static errorMonitor: any;

      static getEventListeners(emitterOrTarget: any, type: any): any;

      static init(opts: any): void;

      static kMaxEventTargetListeners: any;

      static kMaxEventTargetListenersWarned: any;

      static listenerCount(emitter: any, type: any): any;

      static on(emitter: any, event: any, options: any): any;

      static once(emitter: any, name: any, options: any): any;

      static setMaxListeners(n: any, eventTargets: any): void;

      static usingDomains: boolean;
    }
  }
}
