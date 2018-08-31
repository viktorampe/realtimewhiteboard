import { async, TestBed } from '@angular/core/testing';
import { PagesAlertsModule } from './pages-alerts.module';

describe('PagesAlertsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesAlertsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesAlertsModule).toBeDefined();
  });
});
