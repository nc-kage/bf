import { checkReady } from './selectors';

describe('socket selectors', () => {
  it('should return ready', () => {
    const state = {
      socket: {
        ready: true,
      },
    };
    const result = checkReady(state);
    expect(result).toBeTruthy();
  });

  it('should return not ready', () => {
    const state = {
      socket: {
        ready: false,
      },
    };
    const result = checkReady(state);
    expect(result).toBeFalsy();
  });
});
