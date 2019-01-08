import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsDashboardModule } from './pages-settings-dashboard.module';

describe('PagesSettingsDashboardModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsDashboardModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesSettingsDashboardModule).toBeDefined();
  });
});
