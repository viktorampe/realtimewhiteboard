import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsetupdialogComponent } from './sessionsetupdialog.component';

describe('SessionsetupdialogComponent', () => {
  let component: SessionsetupdialogComponent;
  let fixture: ComponentFixture<SessionsetupdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsetupdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsetupdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
