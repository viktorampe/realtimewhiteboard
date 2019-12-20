import { async, TestBed } from '@angular/core/testing';
import { PagesPracticeModule } from './pages-practice.module';

describe('PagesPracticeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesPracticeModule]
    });
  }));

  it('should create', () => {
    expect(PagesPracticeModule).toBeDefined();
  });
});
