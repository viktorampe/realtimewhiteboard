import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardStandaloneComponent } from './whiteboard-standalone.component';

describe('WhiteboardStandaloneComponent', () => {
  let component: WhiteboardStandaloneComponent;
  let fixture: ComponentFixture<WhiteboardStandaloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteboardStandaloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
