import { Inject, Injectable } from '@angular/core';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentBookInterface,
  EduContentFixture,
  GroupFixture,
  GroupInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  PersonFixture,
  PersonInterface,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskFixture,
  TaskInterface
} from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import {
  CurrentTaskParams,
  KabasTasksViewModel
} from './kabas-tasks.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockKabasTasksViewModel
  implements ViewModelInterface<KabasTasksViewModel> {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$ = new BehaviorSubject<SearchStateInterface>({
    searchTerm: '',
    filterCriteriaSelections: new Map<string, (string | number)[]>()
  });

  public tasksWithAssignments$: BehaviorSubject<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: BehaviorSubject<
    TaskWithAssigneesInterface[]
  >;
  public currentTask$: Observable<TaskWithAssigneesInterface>;
  public currentTaskParams$: BehaviorSubject<CurrentTaskParams>;
  public selectableLearningAreas$: BehaviorSubject<LearningAreaInterface[]>;
  public classGroups$: BehaviorSubject<ClassGroupInterface[]>;
  public groups$: BehaviorSubject<GroupInterface[]>;
  public students$: BehaviorSubject<PersonInterface[]>;
  public searchBook$: BehaviorSubject<EduContentBookInterface>;
  constructor(
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    private searchModes: EnvironmentSearchModesInterface
  ) {
    const tasks = this.setupTaskWithAssignments();
    this.tasksWithAssignments$ = new BehaviorSubject<
      TaskWithAssigneesInterface[]
    >(tasks);

    this.paperTasksWithAssignments$ = new BehaviorSubject<
      TaskWithAssigneesInterface[]
    >(
      tasks.slice(0, 3).map(task => {
        return {
          ...task,
          isPaperTask: true,
          name: `papier: ${task.name}`,
          description: `papieren taak: ${task.description}`,
          startDate: null,
          endDate: null,
          assignees: task.assignees.map(assignee => {
            return {
              ...assignee,
              start: null,
              end: null
            };
          })
        };
      })
    );

    // this.currentTask$ = this.paperTasksWithAssignments$.pipe(
    this.currentTask$ = this.getCurrentTask();
    this.currentTaskParams$ = new BehaviorSubject<CurrentTaskParams>({
      id: 1
    });

    this.selectableLearningAreas$ = new BehaviorSubject<
      LearningAreaInterface[]
    >([
      new LearningAreaFixture({ name: 'Wiskunde' }),
      new LearningAreaFixture({ name: 'Frans' })
    ]);

    this.classGroups$ = new BehaviorSubject<ClassGroupInterface[]>([
      new ClassGroupFixture({ id: 1, name: 'klas 1' }),
      new ClassGroupFixture({ id: 2, name: 'klas 2' }),
      new ClassGroupFixture({ id: 3, name: 'klas 3' })
    ]);

    this.groups$ = new BehaviorSubject<GroupInterface[]>([
      new GroupFixture({ id: 1, name: 'groep 1' }),
      new GroupFixture({ id: 2, name: 'groep 2' }),
      new GroupFixture({ id: 3, name: 'groep 3' })
    ]);

    this.students$ = new BehaviorSubject<PersonInterface[]>([
      new PersonFixture({ id: 1, displayName: 'leerling 1' }),
      new PersonFixture({ id: 2, displayName: 'leerling 2' }),
      new PersonFixture({ id: 3, displayName: 'leerling 3' })
    ]);
  }

  public getTaskDates() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      status: this.getTaskStatus()
    };
  }
  public getTaskStatus() {
    return TaskStatusEnum.ACTIVE;
  }

  private setupTaskWithAssignments(): TaskWithAssigneesInterface[] {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    const prevWeek = new Date(today.setDate(today.getDate() - 7));
    const prevMonth = new Date(today.setMonth(today.getMonth() - 1));

    return [
      //Task runs for all assignees from yesterday to next week
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Titel van de eerste oefening',
        isPaperTask: false,
        eduContentAmount: 3,
        eduContents: [
          new EduContentFixture(
            { id: 1 },
            {
              id: 1,
              title: 'oefening 1',
              learningArea: new LearningAreaFixture({ id: 1, name: 'Wiskunde' })
            }
          ),
          new EduContentFixture(
            { id: 2 },
            {
              id: 2,
              title: 'oefening 2',
              learningArea: new LearningAreaFixture({
                id: 2,
                name: 'Geschiedenis'
              })
            }
          ),
          new EduContentFixture(
            { id: 3 },
            {
              id: 3,
              title: 'oefening 3',
              learningArea: new LearningAreaFixture({
                id: 3,
                name: 'Nederlands'
              })
            }
          )
        ],
        learningArea: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
        learningAreaId: 1,
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '1A',
            start: yesterday,
            end: nextWeek,
            id: 1
          },
          {
            type: AssigneeTypesEnum.GROUP,
            label: 'Remediëring 2c',
            start: yesterday,
            end: nextWeek,
            id: 2
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Polleke',
            start: yesterday,
            end: nextWeek,
            id: 3
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Anneke',
            start: yesterday,
            end: nextWeek,
            id: 4
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Ronny',
            start: yesterday,
            end: nextWeek,
            id: 5
          }
        ],
        taskEduContents: [1, 2, 3].map(
          id =>
            new TaskEduContentFixture({
              eduContentId: id,
              eduContent: new EduContentFixture(
                { id },
                {
                  id,
                  title: 'oefening ' + id,
                  learningArea: new LearningAreaFixture({
                    id: 1,
                    name: 'Wiskunde'
                  })
                }
              )
            })
        ),
        startDate: yesterday,
        endDate: nextWeek
      },
      //Task runs for all assignees in different timespans
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Titel van de tweede oefening',
        isPaperTask: false,
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ id: 2, name: 'frans' }),
        learningAreaId: 2,
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: yesterday,
            end: tomorrow,
            id: 2
          },
          {
            type: AssigneeTypesEnum.GROUP,
            label: 'Remediëring 2c',
            start: yesterday,
            end: nextWeek,
            id: 2
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Polleke',
            start: prevWeek,
            end: nextWeek,
            id: 3
          }
        ]
      },
      //active
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Actieve oefening voor één klasgroep',
        isPaperTask: false,
        eduContentAmount: 3,
        learningArea: new LearningAreaFixture({ id: 3, name: 'nederlands' }),
        learningAreaId: 3,
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: nextWeek,
            id: 2
          }
        ]
      },
      //pending
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Pending oefening voor één klasgroep',
        isPaperTask: false,
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ id: 3, name: 'nederlands' }),
        learningAreaId: 3,
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: tomorrow,
            end: nextWeek,
            id: 2
          }
        ]
      },
      //finished
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Finished oefening',
        isPaperTask: false,
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ id: 3, name: 'nederlands' }),
        learningAreaId: 3,
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: prevWeek,
            id: 2
          }
        ]
      },
      //archived
      {
        ...new TaskFixture({
          archivedAt: prevWeek,
          archivedYear: prevWeek.getFullYear()
        }),
        name: 'Gearchiveerde oefening',
        isPaperTask: false,
        eduContentAmount: 2,
        learningArea: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
        learningAreaId: 1,
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: prevWeek,
            id: 2
          }
        ]
      }
    ];
  }
  public startArchivingTasks(
    tasks: TaskWithAssigneesInterface[],
    shouldArchive: boolean
  ): void {}
  public removeTasks(tasks: TaskWithAssigneesInterface[]): void {}
  public toggleFavorite(task: TaskWithAssigneesInterface): void {}
  public canBeArchivedOrDeleted(task: TaskWithAssigneesInterface): boolean {
    return true;
  }
  public createTask(
    name: string,
    learningAreaId: number,
    type: 'paper' | 'digital'
  ) {}

  public updateTask(task: TaskInterface) {}
  public updateTaskAccess(
    task: TaskInterface,
    assignees: AssigneeInterface[]
  ) {}

  private getCurrentTask(): Observable<TaskWithAssigneesInterface> {
    return this.tasksWithAssignments$.pipe(map(tasks => tasks[0]));
  }

  public updateTaskEduContent(
    taskEduContents: TaskEduContentInterface[],
    updatedValues: Partial<TaskEduContentInterface>
  ): void {}

  public updateTaskEduContentsOrder(
    taskEduContents: TaskEduContentInterface[]
  ) {}

  public getDeleteInfo(): any {}

  public addTaskEduContents() {}
  public updateTaskEduContentsRequired() {}
  public deleteTaskEduContents() {}
  public printTask() {}
  public printSolution() {}
  public openEduContentAsExercise() {}
  public openEduContentAsSolution() {}
  public openEduContentAsStream() {}
  public openEduContentAsDownload() {}
  public openBoeke() {}
  public previewEduContentAsImage() {}
  public addEduContentToTask() {}
  public removeEduContentFromTask() {}

  public getSearchMode(mode: string): Observable<SearchModeInterface> {
    return of(this.searchModes[mode]);
  }

  public getInitialSearchState(): Observable<SearchStateInterface> {
    return this.searchState$;
  }

  public requestAutoComplete(searchTerm: string): Observable<string[]> {
    return;
  }

  public updateSearchState(state: SearchStateInterface) {}
}
