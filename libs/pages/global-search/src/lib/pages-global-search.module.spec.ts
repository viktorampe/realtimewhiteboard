import { async, TestBed } from '@angular/core/testing';
import { PagesGlobalSearchModule } from './pages-global-search.module';

describe('PagesGlobalSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesGlobalSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesGlobalSearchModule).toBeDefined();
  });
});
