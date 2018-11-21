// file.only

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { TasksViewModel } from '../tasks.viewmodel';
import { MockActivatedRoute } from '../tasks.viewmodel.mock';
import { TaskDetailComponent } from './task-detail.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskViewModel: TasksViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, BrowserAnimationsModule],
      declarations: [TaskDetailComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        TasksViewModel
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    taskViewModel = TestBed.get(TasksViewModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initial load', () => {
    it('should show the task info panel', () => {
      expect(component.contents$).toEqual(
        hot('a', { a: taskViewModel.getMockTaskEducontents() })
      );
    });
  });
});
