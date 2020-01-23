import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEduContentListItemComponent } from './task-edu-content-list-item.component';

describe('TaskEduContentListItemComponent', () => {
  let component: TaskEduContentListItemComponent;
  let fixture: ComponentFixture<TaskEduContentListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskEduContentListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEduContentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
