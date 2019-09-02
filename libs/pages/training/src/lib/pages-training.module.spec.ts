import { async, TestBed } from '@angular/core/testing';
import { PagesTrainingModule } from './pages-training.module';

describe('PagesTrainingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesTrainingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesTrainingModule).toBeDefined();
  });
});
