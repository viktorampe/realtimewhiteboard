import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable, of } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { TasksViewModel } from '../tasks.viewmodel';
import { MockTasksViewModel } from '../tasks.viewmodel.mock';
import { TasksComponent } from './tasks.component';

export type NestedPartial<T> = { [P in keyof T]?: NestedPartial<T[P]> };

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async(() => {
    const params: Params = {};

    TestBed.configureTestingModule({
      declarations: [TasksComponent, FilterTextInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TasksViewModel, useClass: MockTasksViewModel },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(params)
          }
        }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct icon', () => {
    expect(component.getIcon(true)).toBe('finished');
    expect(component.getIcon(false)).toBe('unfinished');
  });

  it('should display all tasks', () => {
    const folders = fixture.debugElement.queryAll(By.css('campus-folder'));
    expect(folders.length).toBe(4);
  });

  it('should display correct tasks count text', () => {
    const tasksText = fixture.debugElement.query(
      By.css('.pages-tasks__container__tasks-count')
    );
    expect(tasksText).toBeTruthy();
    expect(tasksText.nativeElement.innerHTML).toBe(
      ' 4 van <u>4</u> weergegeven '
    );
  });

  it(
    'listformats$',
    marbles(m => {
      const listformats$ = m.hot('--a--b|', {
        a: ListFormat.GRID,
        b: ListFormat.LINE
      });

      const result = '--a--b|';
      const result$: Observable<ListFormat> = listformats$;

      m.expect(result$).toBeObservable(result, {
        a: ListFormat.GRID,
        b: ListFormat.LINE
      });
    })
  );
});
