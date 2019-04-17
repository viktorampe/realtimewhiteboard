import { async, TestBed } from '@angular/core/testing';
import { PagesTasksModule } from './pages-tasks.module';

describe('PagesTasksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesTasksModule]
    });
  }));

  it('should create', () => {
    expect(PagesTasksModule).toBeDefined();
  });
});
