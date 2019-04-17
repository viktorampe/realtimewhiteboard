import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsAlertsModule } from './pages-settings-alerts.module';

describe('PagesSettingsAlertsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsAlertsModule]
    });
  }));

  it('should create', () => {
    expect(PagesSettingsAlertsModule).toBeDefined();
  });
});
