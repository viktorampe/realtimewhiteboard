import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TaskEduContentListItemComponent } from './task-edu-content-list-item.component';

describe('TaskEduContentListItemComponent', () => {
  let component: TaskEduContentListItemComponent;
  let fixture: ComponentFixture<TaskEduContentListItemComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TaskEduContentListItemComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEduContentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
