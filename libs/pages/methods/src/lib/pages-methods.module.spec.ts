import { async, TestBed } from '@angular/core/testing';
import { PagesMethodsModule } from './pages-methods.module';

describe('PagesMethodsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesMethodsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesMethodsModule).toBeDefined();
  });
});
