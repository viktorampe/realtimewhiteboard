import { async, TestBed } from '@angular/core/testing';
import { PagesHomeModule } from './pages-home.module';

describe('PagesHomeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesHomeModule).toBeDefined();
  });
});
