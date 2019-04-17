import { async, TestBed } from '@angular/core/testing';
import { PagesSharedModule } from './pages-shared.module';

describe('PagesSharedModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSharedModule]
    });
  }));

  it('should create', () => {
    expect(PagesSharedModule).toBeDefined();
  });
});
