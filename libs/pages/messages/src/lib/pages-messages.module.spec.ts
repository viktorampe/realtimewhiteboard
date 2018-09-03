import { async, TestBed } from '@angular/core/testing';
import { PagesMessagesModule } from './pages-messages.module';

describe('PagesMessagesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesMessagesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesMessagesModule).toBeDefined();
  });
});
