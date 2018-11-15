import { TestBed } from '@angular/core/testing';
import { WINDOW, WindowService } from './window.service';

const newMockWindow = {
  open: jest.fn(),
  close: jest.fn()
};

const currentMockWindow = {
  open: jest.fn().mockReturnValue(newMockWindow),
  close: jest.fn()
};

describe('WindowService', () => {
  let windowService: WindowService;
  let closeWindowSpy: jest.SpyInstance;
  let openedWindows: { [name: string]: any };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WindowService,
        { provide: WINDOW, useValue: currentMockWindow }
      ]
    });

    windowService = TestBed.get(WindowService);
    closeWindowSpy = jest.spyOn(windowService, 'closeWindow');
    openedWindows = windowService['openedWindows'];
  });

  it('should be created', () => {
    expect(windowService).toBeTruthy();
  });

  it('should open a new window', () => {
    windowService.openWindow('testName', 'www.testurl.com');
    expect(currentMockWindow.open).toHaveBeenCalledTimes(1);
    expect(currentMockWindow.open).toHaveBeenCalledWith(
      'www.testurl.com',
      'testName'
    );

    expect(openedWindows['testName']).toBeTruthy();
  });

  it('should close the right window', () => {
    windowService.openWindow('toBeClosed', 'www.foo.com');
    windowService.openWindow('stillOpen', 'www.bar.com');

    const toBeClosed = windowService.openedWindows.toBeClosed;
    const stillOpen = windowService.openedWindows.stillOpen;

    windowService.closeWindow('toBeClosed');

    expect(toBeClosed.close).toHaveBeenCalledTimes(1);
    expect(windowService.openedWindows.toBeClosed).toBeUndefined();
    expect(windowService.openedWindows.stillOpen).toBe(stillOpen);
  });

  it(`should not close non-existing windows`, () => {
    // we have to provide the 'this' context otherwise test fails
    windowService.closeWindow.call(windowService, 'nonExistingWindow');
    expect(closeWindowSpy).toHaveBeenCalledTimes(1);
  });
});
