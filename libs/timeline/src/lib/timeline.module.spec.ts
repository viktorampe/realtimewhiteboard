import { async, TestBed } from '@angular/core/testing';
import { EDITOR_HTTP_SERVICE_TOKEN } from './services/editor-http.service';
import { TimelineModule } from './timeline.module';

describe('TimelineModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineModule],
      providers: [{ provide: EDITOR_HTTP_SERVICE_TOKEN, useValue: {} }]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TimelineModule).toBeDefined();
  });
});
