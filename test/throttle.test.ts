import { throttle } from "../src";

describe("throttle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("it should throttle function", () => {
    const func = jest.fn();
    const throttledFunction = throttle(func, 100);

    throttledFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(100);
    expect(func).toBeCalled();
    expect(func).toBeCalledTimes(1);
  });

  test("it should throttle function with a delay", () => {
    const func = jest.fn();
    const throttledFunction = throttle(func, 300);

    const timer = setInterval(() => throttledFunction(), 10);
    jest.advanceTimersByTime(1000);
    clearInterval(timer);
    expect(func).toBeCalledTimes(3);
  });

  test("it should throttle function with immediate set to true", () => {
    const func = jest.fn();
    const throttledFunction = throttle(func, 100, { immediate: true });

    throttledFunction();
    expect(func).toBeCalled();
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(func).toBeCalledTimes(1);

    throttledFunction();
    expect(func).toBeCalledTimes(2);
  });

  test("it cancels debounced function", () => {
    const func = jest.fn();
    const throttledFunction = throttle(func, 100);

    const result = throttledFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    throttledFunction.cancel();

    jest.advanceTimersByTime(100);
    expect(func).not.toBeCalled();

    expect(result).rejects.toBeUndefined();
  });

  describe("callback", () => {
    test("it should throttle function with callback provided", async () => {
      const data = {
        message: "Hello world",
      };
      const callback = jest.fn();
      const func = jest.fn().mockReturnValue(data);

      const throttledFunction = throttle(func, 100, { callback });
      const promise = throttledFunction();
      jest.advanceTimersByTime(100);
      await promise;
      expect(callback).toBeCalledWith(data);
    });
  });

  describe("promises", () => {
    test("it should throttle function and return a Promise", async () => {
      const func = jest.fn().mockReturnValue("promise");
      const throttledFunction = throttle(func, 100);

      const promise1 = throttledFunction();
      const promise2 = throttledFunction();

      jest.advanceTimersByTime(100);

      await expect(promise1).resolves.toEqual("promise");
      await expect(promise2).resolves.toEqual("promise");
    });

    test("it should throttle async functions", async () => {
      const asyncFunc = jest.fn().mockResolvedValue("promise");
      const throttledFunction = throttle(asyncFunc, 100);

      const promise = throttledFunction();

      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toEqual("promise");
    });

    test("it should reject after throttled function is cancelled", async () => {
      const func = jest.fn();
      const throttledFunction = throttle(func, 100);

      const result = throttledFunction();
      const result1 = throttledFunction();

      const reason = "cancelled";
      throttledFunction.cancel(reason);

      await expect(result).rejects.toEqual(reason);
      await expect(result1).rejects.toEqual(reason);
    });
  });
});
