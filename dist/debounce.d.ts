import type { DebounceOption, Func } from "./type";
export declare function debounce<Args extends any[], F extends (...args: Args) => any>(func: F, delay?: number, options?: DebounceOption<ReturnType<F>>): Func<Args, F>;
