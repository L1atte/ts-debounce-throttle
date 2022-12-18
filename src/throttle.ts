import type { ThrottleOption, Func, Promises } from "./type";

export function throttle<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  delay: number = 100,
  options?: ThrottleOption<ReturnType<F>>
): Func<Args, F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options?.immediate ?? false;
  const callback = options?.callback ?? false;
  // const trailing = options?.trailing ?? false;
  let lastInvokeTime = Date.now();

  let promises: Promises<ReturnType<F>>[] = [];

  const nextInvokeDelay = () => {
    const timeSinceLastInvoke = Date.now() - lastInvokeTime;
    const timeUtilNextInvoke = delay - timeSinceLastInvoke;

    // timeUtilNextInvoke may be less than zero
    return Math.max(timeUtilNextInvoke, 0);
  };

  const throttledFunction = function (
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

  throttledFunction.cancel = function (reason?: any) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    promises.forEach(({ reject }) => reject(reason));
    promises = [];
  };

  return throttledFunction;
}
