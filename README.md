# TypeScript implementation of debounce and throttle function

_Debounce_ creates a new function `g`, which when called will delay the invocation of the original function `f` until `n` milliseconds, BUT drop previous pending delayed emissions if a new invocation is made before `n` milliseconds.

It's very useful for scenarios when it's better to limit the number of times the function is called. E.g. think of search input which fetches data from API. It's enough display search results after user has stopped entering characters for some time.

## Install

```
npm i p-debounce-throttle -S
```



## Function arguments

```ts
import { debounce } from "ts-debounce";

const debouncedFunction = debounce(originalFunction, waitMilliseconds, options);
```

- `originalFunction`
  - the function which we want to debounce
- `waitMilliseconds`
  - how many seconds must pass after most recent function call, for the original function to be called
- `options`
  - `isImmediate` (boolean)
    - if set to `true` then `originalFunction` will be called immediately, but on subsequent calls of the debounced function original function won't be called, unless `waitMilliseconds` passed after last call
  - `maxWait` (number)
    - if defined it will call the `originalFunction` after `maxWait` time has passed, even if the debounced function is called in the meantime
      - e.g. if `wait` is set to `100` and `maxWait` to `200`, then if the debounced function is called every 50ms, then the original function will be called after 200ms anyway
  - `callback` (function)
    - it is called when `originalFunction` is debounced and receives as first parameter returned data from `originalFunction`

## Cancellation

The returned debounced function can be cancelled by calling `cancel()` on it.

```ts
const debouncedFunction = debounce(originalFunction, waitMilliseconds, options);

debouncedFunction.cancel();
```

## Promises

`ts-debounce-throttle` has Promise support. Everytime you call debounced function a promise is returned which will be resolved when the original function will be finally called. This promise will be rejected, if the debounced function will be cancelled.

You can also debounce a function `f` which returns a promise. The returned promise(s) will resolve (unless cancelled) with the return value of the original function.

```ts
const asyncFunction = async () => "value";
const g = debounce(asyncFunction);
const returnValue = await g();
returnValue === "value"; // true
```

## Credits & inspiration

This implementation is based upon following sources:

- [JavaScript Debounce Function](https://davidwalsh.name/javascript-debounce-function) by David Walsh
- [Lodash implementation](https://lodash.com/)
- [p-debounce](https://github.com/sindresorhus/p-debounce)