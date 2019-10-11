import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardDemoPageComponent } from './whiteboard-demo-page.component';

describe('WhiteboardDemoPageComponent', () => {
  let component: WhiteboardDemoPageComponent;
  let fixture: ComponentFixture<WhiteboardDemoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteboardDemoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardDemoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
