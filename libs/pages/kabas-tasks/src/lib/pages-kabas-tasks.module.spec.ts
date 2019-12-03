import { async, TestBed } from '@angular/core/testing';
import { PagesKabasTasksModule } from './pages-kabas-tasks.module';

describe('PagesKabasTasksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesKabasTasksModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesKabasTasksModule).toBeDefined();
  });
});
