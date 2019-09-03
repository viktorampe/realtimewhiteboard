import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { FavIconService } from './favicons';

describe('FavIconService', () => {
  let browserFaviconService: FavIconService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [FavIconService]
    });
    browserFaviconService = TestBed.get(FavIconService);
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
    const removeSpy = jest.spyOn(browserFaviconService, 'removeNode');
    browserFaviconService.resetFavicon();
    expect(removeSpy).toHaveBeenCalled();
  });
});
