import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatListModule,
  MatTabsModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { PagesKabasTasksModule } from '../../pages-kabas-tasks.module';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { ManageKabasTasksOverviewComponent } from './manage-kabas-tasks-overview.component';

describe('ManageKabasTasksOverviewComponent', () => {
  let component: ManageKabasTasksOverviewComponent;
  let fixture: ComponentFixture<ManageKabasTasksOverviewComponent>;
  let kabasTasksViewModel: KabasTasksViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PagesKabasTasksModule,
        NoopAnimationsModule,
        MatListModule,
        MatTabsModule,
        MatIconModule,
        UiModule,
        SharedModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel }
      ],
      declarations: []
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Task sorting', () => {
    let digitalTasks$: BehaviorSubject<TaskWithAssigneesInterface[]>;
    let paperTasks$: BehaviorSubject<TaskWithAssigneesInterface[]>;

    beforeEach(() => {
      digitalTasks$ = kabasTasksViewModel.tasksWithAssignments$ as BehaviorSubject<
        TaskWithAssigneesInterface[]
      >;
      paperTasks$ = kabasTasksViewModel.paperTasksWithAssignments$ as BehaviorSubject<
        TaskWithAssigneesInterface[]
      >;
    });

    describe('sort modes', () => {
      describe('', () => {});
    });
  });
});
