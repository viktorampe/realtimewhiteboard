import { TestBed } from '@angular/core/testing';
import { BrowserFaviconService } from './favicons';

describe('NavItemServiceService', () => {
  let browserFaviconService: BrowserFaviconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserFaviconService]
    });
    browserFaviconService = TestBed.get(BrowserFaviconService);
  });

  it('should be created', () => {
    expect(browserFaviconService).toBeTruthy();
  });

  it('should call relevant functions when setFavicon Called', () => {
    const setSpy = jest.spyOn(browserFaviconService, 'setNode');
    const removeSpy = jest.spyOn(browserFaviconService, 'removeNode');
    const addSpy = jest.spyOn(browserFaviconService, 'addNode');
    browserFaviconService.setFavicon('favi.png', 'image/png');
    expect(setSpy).toHaveBeenCalledWith('favi.png', 'image/png');
    expect(removeSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith('favi.png', 'image/png');
  });

  it('should call relevant functions when resetFavicon Called', () => {
    const setSpy = jest.spyOn(browserFaviconService, 'setNode');
    const removeSpy = jest.spyOn(browserFaviconService, 'removeNode');
    const addSpy = jest.spyOn(browserFaviconService, 'addNode');
    browserFaviconService.resetFavicon();
    expect(removeSpy).toHaveBeenCalled();
  });
});
