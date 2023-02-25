import watch from './saga';

describe('orders saga', () => {
  it('should put send if chain id is not set', () => {
    const gen = watch();
    let effect = gen.next();
    const take = effect.value.payload.fn(...effect.value.payload.args);
    effect = take.next();
    effect = take.next({ payload: 'tBTCUSD' });
    const setSymbol = effect.value.payload.fn(...effect.value.payload.args);
    effect = setSymbol.next();
    effect = setSymbol.next(0);
    expect(effect.value.payload.action.payload).toEqual({
      event: 'subscribe', channel: 'book', symbol: 'tBTCUSD',
    });
    expect(effect.value.payload.action.type).toBe('socket/send');
  });
  it('should put unsubscribe and send if chain id is set', () => {
    const gen = watch();
    let effect = gen.next();
    const take = effect.value.payload.fn(...effect.value.payload.args);
    effect = take.next();
    effect = take.next({ payload: 'tBTCUSD' });
    const setSymbol = effect.value.payload.fn(...effect.value.payload.args);
    effect = setSymbol.next();
    effect = setSymbol.next(1);
    expect(effect.value.payload.action.payload).toEqual({
      event: 'unsubscribe', chanId: 1,
    });
    expect(effect.value.payload.action.type).toBe('socket/send');
    effect = setSymbol.next();
    expect(effect.value.payload.action.payload).toEqual({
      event: 'subscribe', channel: 'book', symbol: 'tBTCUSD',
    });
    expect(effect.value.payload.action.type).toBe('socket/send');
  });
});
