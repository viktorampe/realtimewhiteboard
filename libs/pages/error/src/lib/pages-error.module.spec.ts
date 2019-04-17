import { async, TestBed } from '@angular/core/testing';
import { PagesErrorModule } from './pages-error.module';

describe('PagesErrorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesErrorModule]
    });
  }));

  it('should create', () => {
    expect(PagesErrorModule).toBeDefined();
  });
});
