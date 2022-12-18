import type { DebounceOption, Func, Promises } from "./type";

export function debounce<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  delay: number = 100,
  options?: DebounceOption<ReturnType<F>>
): Func<Args, F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options?.immediate ?? false;
  const maxWait = options?.maxWait ?? false;
  const callback = options?.callback ?? false;
  let lastInvokeTime = Date.now();

  let promises: Promises<ReturnType<F>>[] = [];

  const nextInvokeDelay = () => {
    if (maxWait) {
      const timeSinceLastInvoke = Date.now() - lastInvokeTime;
      const timeUtilNextInvoke = maxWait - timeSinceLastInvoke;

      // timeUtilNextInvoke may be less than zero
      return Math.max(timeUtilNextInvoke, 0);
    }

    return delay;
  };

  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ) {
    const context = this;
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = function () {
        timeoutId = undefined;
        lastInvokeTime = Date.now();
        if (!isImmediate) {
          const result = func.apply(context, args);
          callback && callback(result);
          promises.forEach(({ resolve }) => resolve(result));
          promises = [];
        }
      };

      const shouldCallNow = isImmediate && timeoutId === undefined;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeDelay());

      if (shouldCallNow) {
        const result = func.apply(context, args);
        callback && callback(result);
        return resolve(result);
      }
      promises.push({ resolve, reject });
    });
  };

  debouncedFunction.cancel = function (reason?: any) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    promises.forEach(({ reject }) => reject(reason));
    promises = [];
  };

  return debouncedFunction;
}
