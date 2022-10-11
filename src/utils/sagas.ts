import { fork, take, call } from 'redux-saga/effects';

export function* takeSingle<Fn extends (...args: object[]) => object>(
  pattern: string,
  saga: Fn,
  ...args: Parameters<Fn>
) {
  const task = yield fork(function*() {
    while (true) {
      const action = yield take(pattern);
      yield call(saga, ...(args.concat(action) as Parameters<Fn>));
      break;
    }
  });
  return task;
}
