import { TestBed } from '@angular/core/testing';
import { WINDOW, WindowService } from './window.service';

const currentMockWindow = <Window>{
  open: () => {
    return newMockWindow;
  },
  close: () => {
    return;
  }
};

const newMockWindow = <Window>{
  open: () => {
    return;
  },
  close: () => {
    return;
  }
};

describe('WindowService', () => {
  let windowService: WindowService;
  let openSpy: jest.SpyInstance;
  let closeSpy: jest.SpyInstance;
  let closeWindowSpy: jest.SpyInstance;
  let openedWindows: { [name: string]: Window };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WindowService,
        { provide: WINDOW, useValue: currentMockWindow }
      ]
    });

    windowService = TestBed.get(WindowService);
    openSpy = jest.spyOn(currentMockWindow, 'open');
    closeSpy = jest.spyOn(currentMockWindow, 'close');
    closeWindowSpy = jest.spyOn(windowService, 'closeWindow');
    openedWindows = windowService['openedWindows'];
  });

  it('should be created', () => {
    expect(windowService).toBeTruthy();
  });

  it('should open a new window', () => {
    windowService.openWindow('testName', 'www.testurl.com');
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith('www.testurl.com', 'testName');

    expect(openedWindows['testName']).toBeTruthy();
  });

  it('should close the right window', () => {
    openedWindows['toBeClosed'] = currentMockWindow;
    openedWindows['stillOpen'] = currentMockWindow;

    windowService.closeWindow('toBeClosed');

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(openedWindows['toBeClosed']).toBeFalsy();
    expect(openedWindows['stillOpen']).toBeTruthy();
  });

  it(`should not close non-existing windows`, () => {
    // we have to provide the 'this' context otherwise test fails
    windowService.closeWindow.call(windowService, 'nonExistingWindow');
    expect(closeWindowSpy).toHaveBeenCalledTimes(1);
  });
});
