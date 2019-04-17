import { async, TestBed } from '@angular/core/testing';
import { PagesReportsModule } from './pages-reports.module';

describe('PagesReportsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesReportsModule]
    });
  }));

  it('should create', () => {
    expect(PagesReportsModule).toBeDefined();
  });
});
