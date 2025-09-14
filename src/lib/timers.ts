export type TimerAPI = {
  delay: (ms: number, cb: () => void) => number;
  clear: (id: number) => void;
};

export const RealTimers: TimerAPI = {
  delay: (ms, cb) => window.setTimeout(cb, ms),
  clear: (id) => window.clearTimeout(id),
};

export const ImmediateTimers: TimerAPI = {
  delay: (_ms, cb) => {
    cb();
    return 0;
  },
  clear: (_id) => {},
};
