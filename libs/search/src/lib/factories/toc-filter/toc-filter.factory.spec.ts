import { TestBed } from '@angular/core/testing';
import { TocFilterFactory } from './toc-filter.factory';

describe('TocFilterFactory', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const factory: TocFilterFactory = TestBed.get(TocFilterFactory);
    expect(factory).toBeTruthy();
  });
});
