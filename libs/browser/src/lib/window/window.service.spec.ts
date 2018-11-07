import { inject, TestBed } from '@angular/core/testing';
import { WINDOW, WindowService } from './window.service';

const mockWindow = <Window>{
  open: () => {
    return;
  },
  close: () => {
    return;
  }
};
// file.only
describe('WindowService', () => {
  let windowService: WindowService;
  let openSpy: jasmine.Spy;
  let closeSpy: jasmine.Spy;
  let openedWindows: { [name: string]: Window };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowService, { provide: WINDOW, useValue: mockWindow }]
    });

    windowService = TestBed.get(WindowService);
    openSpy = spyOn(windowService['nativeWindow'], 'open').and.returnValue(
      mockWindow
    );
    closeSpy = spyOn(windowService['nativeWindow'], 'close').and.stub();
    openedWindows = windowService['openedWindows'];
  });

  it('should be created', inject([WindowService], (service: WindowService) => {
    expect(service).toBeTruthy();
  }));

  it('should open a new window', () => {
    windowService.openWindow('testName', 'www.testurl.com');
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith('www.testurl.com', 'testName');

    expect(openedWindows['testName']).toBeTruthy();
  });

  it('should close the right window', () => {
    openedWindows['toBeClosed'] = mockWindow;
    openedWindows['stillOpen'] = mockWindow;

    const closeSpyOnWindowInstance = spyOn(
      openedWindows['toBeClosed'],
      'close'
    );

    windowService.closeWindow('toBeClosed');

    expect(closeSpyOnWindowInstance).toHaveBeenCalledTimes(1);
    expect(openedWindows['toBeClosed']).toBeFalsy();
    expect(openedWindows['stillOpen']).toBeTruthy();
  });

  it('should keep a record of opened windows', () => {
    windowService.openWindow('window1', 'www.url1.com');
    windowService.openWindow('window2', 'www.url2.com');
    windowService.openWindow('window3', 'www.url3.com');
    windowService.openWindow('window4', 'www.url4.com');

    windowService.closeWindow('window3');
    expect(openedWindows.window1).toBeTruthy();
    expect(openedWindows.window2).toBeTruthy();
    expect(openedWindows.window3).toBeFalsy();
    expect(openedWindows.window4).toBeTruthy();
  });
});
