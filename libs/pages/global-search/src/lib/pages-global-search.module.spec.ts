import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { PagesGlobalSearchModule } from './pages-global-search.module';

describe('PagesGlobalSearchModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PagesGlobalSearchModule]
    }).compileComponents();
  });

  it('should create', () => {
    expect(PagesGlobalSearchModule).toBeDefined();
  });
});
