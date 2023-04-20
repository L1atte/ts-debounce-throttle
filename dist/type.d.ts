export type DebounceOption<Result> = {
    immediate?: boolean;
    maxWait?: number;
    callback?: (data: Result) => void;
};
export type ThrottleOption<Result> = {
    immediate?: boolean;
    callback?: (data: Result) => void;
};
export type Func<Args extends any[], F extends (...args: Args) => any> = {
    (this: ThisParameterType<F>, ...args: Args & Parameters<F>): Promise<ReturnType<F>>;
    cancel: (reason?: any) => void;
};
export type Promises<FuncReturn> = {
    resolve: (result: FuncReturn) => void;
    reject: (reason?: any) => void;
};
