import { reducer, actions } from '.';

describe('orders reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual({
      lastIncomingMessage: null,
      lastOutgoingMessage: null,
      error: '',
      ready: false,
    });
  });

  it('should handle changeReady', () => {
    expect(reducer(undefined, actions.changeReady(true))).toEqual({
      lastIncomingMessage: null,
      lastOutgoingMessage: null,
      error: '',
      ready: true,
    });
  });

  it('should handle receive', () => {
    expect(reducer(undefined, actions.receive({ test: 1 }))).toEqual({
      lastIncomingMessage: { test: 1 },
      lastOutgoingMessage: null,
      error: '',
      ready: false,
    });
  });

  it('should handle send', () => {
    expect(reducer(undefined, actions.send({ test: 1 }))).toEqual({
      lastIncomingMessage: null,
      lastOutgoingMessage: { test: 1 },
      error: '',
      ready: false,
    });
  });

  it('should handle setError', () => {
    expect(reducer(undefined, actions.setError('test error'))).toEqual({
      lastIncomingMessage: null,
      lastOutgoingMessage: null,
      error: 'test error',
      ready: false,
    });
  });
});
