import { async, TestBed } from '@angular/core/testing';
import { PagesProfileModule } from './pages-profile.module';

describe('PagesProfileModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesProfileModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesProfileModule).toBeDefined();
  });
});
