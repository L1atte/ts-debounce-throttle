import type { ThrottleOption, Func } from "./type";
export declare function throttle<Args extends any[], F extends (...args: Args) => any>(func: F, delay?: number, options?: ThrottleOption<ReturnType<F>>): Func<Args, F>;
