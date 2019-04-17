import { async, TestBed } from '@angular/core/testing';
import { PagesEduContentsModule } from './pages-edu-contents.module';

describe('PagesEduContentsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesEduContentsModule]
    });
  }));

  it('should create', () => {
    expect(PagesEduContentsModule).toBeDefined();
  });
});
