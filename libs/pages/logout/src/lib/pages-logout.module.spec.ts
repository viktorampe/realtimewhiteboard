import { async, TestBed } from '@angular/core/testing';
import { PagesLogoutModule } from './pages-logout.module';

describe('PagesLogoutModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesLogoutModule]
    });
  }));

  it('should create', () => {
    expect(PagesLogoutModule).toBeDefined();
  });
});
