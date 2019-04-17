import { async, TestBed } from '@angular/core/testing';
import { SearchModule } from './search.module';

describe('SearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchModule]
    });
  }));

  it('should create', () => {
    expect(SearchModule).toBeDefined();
  });
});
