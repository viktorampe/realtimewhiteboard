export class MockWindow {
  open = jest.fn();
  close = jest.fn();
  location = {
    assign: jest.fn()
  };
}
