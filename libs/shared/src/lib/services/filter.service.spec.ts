import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let filterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterService]
    });

    filterService = TestBed.get(FilterService);
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });
});
