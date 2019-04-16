import { async, TestBed } from '@angular/core/testing';
import { PagesBooksModule } from './pages-books.module';

describe('PagesBooksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesBooksModule]
    });
  }));

  it('should create', () => {
    expect(PagesBooksModule).toBeDefined();
  });
});
