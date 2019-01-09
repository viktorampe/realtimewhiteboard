import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSummaryComponentComponent } from './teacher-summary-component.component';

describe('TeacherSummaryComponentComponent', () => {
  let component: TeacherSummaryComponentComponent;
  let fixture: ComponentFixture<TeacherSummaryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherSummaryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSummaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
