import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardToolsComponent } from './whiteboard-tools.component';

describe('WhiteboardToolsComponent', () => {
  let component: WhiteboardToolsComponent;
  let fixture: ComponentFixture<WhiteboardToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteboardToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
