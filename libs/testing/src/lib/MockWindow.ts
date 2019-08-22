export class MockWindow {
  // @ts-ignore
  open = jest.fn();
  // @ts-ignore
  close = jest.fn();
  location = {
    // @ts-ignore
    assign: jest.fn(),
    origin: 'foo',
    set href(value: string) {}
  };
  // @ts-ignore
  clearTimeout = jest.fn();
  setTimeout = (handler: Function, timeout: number): number => {
    handler();
    return timeout;
  };
}
