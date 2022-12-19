import { debounce } from "../src";

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  test("it should debounce function", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100);

    debouncedFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(100);
    expect(func).toBeCalled();
    expect(func).toBeCalledTimes(1);
  });
  test("it should debounce function with immediate set to true ", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100, { immediate: true });

    debouncedFunction();
    expect(func).toBeCalled();
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(func).toBeCalledTimes(1);

    // it should be possible to call it second time after timeout passes
    debouncedFunction();
    expect(func).toBeCalledTimes(2);
  });

  test("it cancels debounced function ", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100);

    const result = debouncedFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    debouncedFunction.cancel();

    jest.advanceTimersByTime(100);
    expect(func).not.toBeCalled();

    expect(result).rejects.toBeUndefined();
  });

  describe("maxWait", () => {
    test("it calls func with maxWait >= wait correctly", () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100, { maxWait: 150 });
      debouncedFunction();

      jest.advanceTimersByTime(50);
      expect(func).not.toBeCalled();
      debouncedFunction();

      // function should be called because of maxWait
      jest.advanceTimersByTime(100);
      expect(func).toBeCalled();
    });

    test("it calls func with maxWait < wait correctly", () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100, { maxWait: 50 });
      debouncedFunction();

      // function should be called because of maxWait
      jest.advanceTimersByTime(50);
      expect(func).toBeCalled();

      jest.advanceTimersByTime(50);
      expect(func).toBeCalledTimes(1);

      debouncedFunction();
      jest.advanceTimersByTime(100);
      expect(func).toBeCalledTimes(2);
    });

    test("it calls in the next tick with maxWait === 0", () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100, { maxWait: 0 });
      debouncedFunction();

      jest.advanceTimersByTime(1);
      expect(func).toBeCalled();
    });
  });

  describe("callback", () => {
    test("it should debounce function with callback provided", async () => {
      const data = {
        message: "Hello World",
      };
      const callback = jest.fn();
      const func = jest.fn().mockReturnValue(data);

      const debouncedFunction = debounce(func, 100, {
        callback,
      });
      const promise = debouncedFunction();
      jest.advanceTimersByTime(100);
      await promise;
      expect(callback).toBeCalledWith(data);
    });
  });

  describe("promises", () => {
    test("it should debounce function and returns a Promise", async () => {
      const func = jest.fn().mockReturnValue(12345);
      const debouncedFunction = debounce(func, 100);

      const result = debouncedFunction();
      const result1 = debouncedFunction();

      jest.advanceTimersByTime(100);

      await expect(result).resolves.toEqual(12345);
      await expect(result1).resolves.toEqual(12345);
    });

    test("it should debounce async functions", async () => {
      const asyncFunc = jest.fn().mockResolvedValue(12345);
      const debouncedFunction = debounce(asyncFunc, 100);

      const promise = debouncedFunction();

      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toEqual(12345);
    });

    test("it should reject after debounced function is cancelled", async () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100);

      const result = debouncedFunction();
      const result1 = debouncedFunction();

      const reason = "changed my mind";
      debouncedFunction.cancel(reason);

      await expect(result).rejects.toEqual(reason);
      await expect(result1).rejects.toEqual(reason);
    });
  });
});
