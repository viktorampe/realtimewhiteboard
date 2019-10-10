import { inject, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { SettingsService } from './settings.service';

describe('EditorHttpService', () => {
  let settingsService: SettingsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
  });

  beforeEach(() => {
    settingsService = TestBed.get(SettingsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should be created and available via DI', inject(
    [SettingsService],
    (service: SettingsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
