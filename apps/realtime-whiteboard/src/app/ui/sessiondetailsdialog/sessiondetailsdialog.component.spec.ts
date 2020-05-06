import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessiondetailsdialogComponent } from './sessiondetailsdialog.component';

describe('SessiondetailsdialogComponent', () => {
  let component: SessiondetailsdialogComponent;
  let fixture: ComponentFixture<SessiondetailsdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessiondetailsdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessiondetailsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
