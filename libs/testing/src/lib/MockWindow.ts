export class MockWindow {
  open = jest.fn();
  close = jest.fn();
  location = {
    assign: jest.fn()
  };

  clearTimeout = jest.fn();
  setTimeout = (handler: Function, timeout: number): number => {
    handler();
    return timeout;
  };
}
