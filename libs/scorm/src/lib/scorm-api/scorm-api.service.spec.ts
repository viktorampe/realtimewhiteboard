import { TestBed } from '@angular/core/testing';
import { WINDOW } from '@campus/browser';
import { ScormCmiFixture } from './+fixtures/ScormCmi.fixture';
import { ScormApi } from './scorm-api';
import { ScormCmiInterface, ScormCmiMode } from './scorm-api.interface';
import { ScormApiService } from './scorm-api.service';

describe('ScormApiService', () => {
  let scormApiService: ScormApiService;
  let window: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScormApiService, { provide: WINDOW, useValue: {} }]
    });

    scormApiService = TestBed.get(ScormApiService);
    window = TestBed.get(WINDOW);
  });

  it('should be created', () => {
    expect(scormApiService).toBeTruthy();
  });

  describe('when the scorm API is present on the window', () => {
    beforeEach(() => {
      // initialize the first result
      scormApiService.init(new ScormCmiFixture(), ScormCmiMode.CMI_MODE_NORMAL);
    });
    it('should update the current result and mode', () => {
      const expectedResult = new ScormCmiFixture({ objectives: 'foo' });
      const expectedMode = ScormCmiMode.CMI_MODE_PREVIEW;

      // initialize a new result
      scormApiService.init(expectedResult, expectedMode);

      expect(window.API.currentResult).toEqual(
        new ScormCmiFixture(expectedResult)
      );
      expect(window.API.mode).toEqual(expectedMode);
    });
  });

  describe('when the API is not present on the window', () => {
    beforeEach(() => {
      window.API = undefined;
    });
    it('should be added to the window', () => {
      scormApiService.init(
        {} as ScormCmiInterface,
        ScormCmiMode.CMI_MODE_NORMAL
      );
      expect(window.API).toBeDefined();
      expect(window.API.constructor.name).toBe(ScormApi.name);
    });
  });
  describe('when the API is initialized', () => {
    let commitSpy: jest.SpyInstance;
    let cmiSpy: jest.SpyInstance;
    beforeEach(() => {
      jest.clearAllMocks();
      window.API = undefined;
      // initialize the API  (it wil be placed on the window.API)
      scormApiService.init(
        {} as ScormCmiInterface,
        ScormCmiMode.CMI_MODE_NORMAL
      );

      commitSpy = jest.spyOn(scormApiService.commit$, 'next');
      cmiSpy = jest.spyOn(scormApiService.cmi$, 'next');
    });
    it('should pass the commit stream values from the scorm API to the scormApiService', () => {
      window.API.commit$.next({ mode: ScormCmiMode.CMI_MODE_BROWSE });

      expect(commitSpy).toHaveBeenCalledTimes(1);
      expect(commitSpy).toHaveBeenCalledWith({
        mode: ScormCmiMode.CMI_MODE_BROWSE
      });
    });

    it('should pass the cmi stream values from the scorm API to the scormApiService', () => {
      window.API.cmi$.next({ mode: ScormCmiMode.CMI_MODE_NORMAL });

      expect(cmiSpy).toHaveBeenCalledTimes(1);
      expect(cmiSpy).toHaveBeenCalledWith({
        mode: ScormCmiMode.CMI_MODE_NORMAL
      });
    });
  });
});
