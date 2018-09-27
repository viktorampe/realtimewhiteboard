import { async, TestBed } from '@angular/core/testing';
import { PagesBundleDetailModule } from './pages-bundle-detail.module';

describe('PagesBundleDetailModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesBundleDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesBundleDetailModule).toBeDefined();
  });
});
