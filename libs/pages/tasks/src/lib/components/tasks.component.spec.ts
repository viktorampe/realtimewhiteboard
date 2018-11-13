import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  EduContentInterface,
  LearningAreaInterface,
  PersonInterface,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { EduContentFixture } from 'libs/dal/src/lib/+fixtures/EduContent.fixture';
import { EduContentProductTypeFixture } from 'libs/dal/src/lib/+fixtures/EduContentProductType.fixture';
import { LearningAreaFixture } from 'libs/dal/src/lib/+fixtures/LearningArea.fixture';
import { MethodFixture } from 'libs/dal/src/lib/+fixtures/Method.fixture';
import { PersonFixture } from 'libs/dal/src/lib/+fixtures/Person.fixture';
import { TaskFixture } from 'libs/dal/src/lib/+fixtures/Task.fixture';
import { TaskInstanceFixture } from 'libs/dal/src/lib/+fixtures/TaskInstance.fixture';
import { BehaviorSubject, Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { TasksComponent } from './tasks.component';
import { TasksViewModel } from './tasks.viewmodel';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  TaskInstancesWithEduContentInfoInterface,
  TaskInstanceWithEduContentsInfoInterface
} from './tasks.viewmodel.interfaces';

class MockViewModel {
  selectedLearningArea$ = this.getMockSelectedLearningArea();
  taskInstancesByLearningArea$ = this.getMockTaskInstancesByLearningArea();
  listFormat$ = this.getMockListFormat();

  private getMockLearningAreasWithTaskInstances(): Observable<
    LearningAreasWithTaskInstanceInfoInterface
  > {
    const mockLearningAreas = this.getMockLearningAreas();

    let mock: LearningAreasWithTaskInstanceInfoInterface;
    mock = {
      learningAreas: [
        {
          learningArea: mockLearningAreas[0],
          openTasks: 2,
          closedTasks: 3
        },
        {
          learningArea: mockLearningAreas[1],
          openTasks: 0,
          closedTasks: 2
        },
        {
          learningArea: mockLearningAreas[2],
          openTasks: 2,
          closedTasks: 0
        }
      ],
      totalTasks: 0
    };
    mock.totalTasks = mock.learningAreas.reduce(
      (total, area) => total + area.openTasks + area.closedTasks,
      0
    );

    return new BehaviorSubject(mock);
  }

  private getMockSelectedLearningArea(
    id: 0 | 1 | 2 = 0
  ): Observable<LearningAreaInterface> {
    const mockLearningAreas = this.getMockLearningAreas();
    return new BehaviorSubject(mockLearningAreas[id]);
  }

  private getMockTaskInstancesByLearningArea(): Observable<
    TaskInstancesWithEduContentInfoInterface
  > {
    const mockTaskInstancesAll = this.getMockTaskInstances();

    let mockTaskInstances: TaskInstancesWithEduContentInfoInterface;
    mockTaskInstances = {
      instances: [
        {
          taskInstance: mockTaskInstancesAll[0],
          taskEduContentsCount: 1,
          finished: true
        },
        {
          taskInstance: mockTaskInstancesAll[1],
          taskEduContentsCount: 2,
          finished: true
        },
        {
          taskInstance: mockTaskInstancesAll[2],
          taskEduContentsCount: 1,
          finished: false
        },
        {
          taskInstance: mockTaskInstancesAll[3],
          taskEduContentsCount: 2,
          finished: false
        }
      ]
    };

    return new BehaviorSubject(mockTaskInstances);
  }

  private getMockSelectedTaskInstance(
    id: 0 | 1 | 2 | 3 = 0
  ): Observable<TaskInstanceInterface> {
    return new BehaviorSubject(this.getMockTaskInstances()[id]);
  }

  private getMockTaskInstanceWithEduContents(
    id: 0 | 1 | 2 | 3 = 0,
    finished = false
  ): Observable<TaskInstanceWithEduContentsInfoInterface> {
    const mockTaskInstance = this.getMockTaskInstances()[id];
    const mockTaskEducontents = this.getMockTaskEducontents();

    let mockTaskInstanceWithEducontent: TaskInstanceWithEduContentsInfoInterface;
    mockTaskInstanceWithEducontent = {
      taskInstance: mockTaskInstance,
      taskEduContents: mockTaskEducontents,
      finished: finished
    };

    return new BehaviorSubject(mockTaskInstanceWithEducontent);
  }

  private getMockLearningAreas(): LearningAreaInterface[] {
    return [
      new LearningAreaFixture({
        name: 'Wiskunde',
        icon: 'wiskunde',
        color: '#2c354f'
      }),
      new LearningAreaFixture({
        name: 'Moderne Wetenschappen',
        icon: 'natuurwetenschappen',
        color: '#5e3b47'
      }),
      new LearningAreaFixture({
        name: 'Engels',
        icon: 'engels',
        color: '#553030'
      })
    ];
  }

  private getMockTaskInstances(): TaskInstanceInterface[] {
    const mockTasks = this.getMockTasks();
    const mockStudent = new PersonFixture();

    return [
      new TaskInstanceFixture({
        start: new Date(2018, 11 - 1, 5, 0 + 2),
        end: new Date(2018, 11 - 1, 15, 0 + 2),
        alerted: true,
        id: 1,
        taskId: mockTasks[0].id,
        task: mockTasks[0],
        personId: mockStudent.id,
        student: mockStudent
      }),
      new TaskInstanceFixture({
        start: new Date(2018, 11 - 1, 5, 0 + 2),
        end: new Date(2018, 11 - 1, 6, 0 + 2),
        alerted: true,
        id: 2,
        taskId: mockTasks[1].id,
        task: mockTasks[1],
        personId: mockStudent.id,
        student: mockStudent
      }),
      new TaskInstanceFixture({
        start: new Date(2018, 11 - 1, 15, 0 + 2),
        end: new Date(2018, 11 - 1, 30, 0 + 2),
        alerted: false,
        id: 3,
        taskId: mockTasks[2].id,
        task: mockTasks[2],
        personId: mockStudent.id,
        student: mockStudent
      }),
      new TaskInstanceFixture({
        start: new Date(2018, 11 - 1, 15, 0 + 2),
        end: new Date(2018, 11 - 1, 30, 0 + 2),
        alerted: true,
        id: 4,
        taskId: mockTasks[0].id,
        task: mockTasks[0],
        personId: mockStudent.id,
        student: mockStudent
      })
    ];
  }

  private getMockTaskEducontents(): TaskEduContentInterface[] {
    const mockTeacher = this.getMockTeacher();
    const mockTasks = this.getMockTasks();
    const mockEducontents = this.getMockEducontents();

    let mockTaskEducontents1: TaskEduContentInterface;
    mockTaskEducontents1 = {
      index: 10000,
      id: 1,
      teacherId: mockTeacher.id,
      teacher: mockTeacher,
      eduContentId: mockEducontents[0].id,
      eduContent: mockEducontents[0],
      taskId: mockTasks[0].id,
      task: mockTasks[0]
    };

    let mockTaskEducontents2: TaskEduContentInterface;
    mockTaskEducontents2 = {
      index: 10000,
      id: 2,
      teacherId: mockTeacher.id,
      teacher: mockTeacher,
      eduContentId: mockEducontents[1].id,
      eduContent: mockEducontents[1],
      taskId: mockTasks[1].id,
      task: mockTasks[1]
    };

    let mockTaskEducontents3: TaskEduContentInterface;
    mockTaskEducontents3 = {
      index: 10000,
      id: 3,
      teacherId: mockTeacher.id,
      teacher: mockTeacher,
      eduContentId: mockEducontents[2].id,
      eduContent: mockEducontents[2],
      taskId: mockTasks[2].id,
      task: mockTasks[2]
    };

    let mockTaskEducontents4: TaskEduContentInterface;
    mockTaskEducontents4 = {
      index: 10000,
      id: 4,
      teacherId: mockTeacher.id,
      teacher: mockTeacher,
      eduContentId: mockEducontents[0].id,
      eduContent: mockEducontents[0],
      taskId: mockTasks[0].id,
      task: mockTasks[0]
    };

    return [
      mockTaskEducontents1,
      mockTaskEducontents2,
      mockTaskEducontents3,
      mockTaskEducontents4
    ];
  }

  private getMockTeacher(): PersonInterface {
    let mockTeacher: PersonInterface;
    mockTeacher = {
      name: 'Mertens',
      firstName: 'Tom',
      created: new Date('2018-09-04 14:21:15'),
      email: 'teacher1@mailinator.com',
      currentSchoolYear: 2018,
      id: 187,
      displayName: 'Tom Mertens'
      // Avatar:
    };

    return mockTeacher;
  }

  private getMockTasks(): TaskInterface[] {
    const mockTeacher = new PersonFixture({
      id: 666
    });
    const mockLearningAreas = this.getMockLearningAreas();

    return [
      new TaskFixture({
        name: 'Overhoring 1',
        description:
          'Maak deze taak als voorbereiding op de overhoring van volgende week.',
        id: 1,
        personId: mockTeacher.id,
        teacher: mockTeacher,
        learningAreaId: mockLearningAreas[0].id,
        learningArea: mockLearningAreas[0]
      }),
      new TaskFixture({
        name: 'Herhaling 1',
        description:
          'Maak deze taak als extra herhaling op de leerstof van vorige week.',
        id: 2,
        personId: mockTeacher.id,
        teacher: mockTeacher,
        learningAreaId: mockLearningAreas[1].id,
        learningArea: mockLearningAreas[1]
      }),
      new TaskFixture({
        name: 'Archief groepstaak 1',
        description:
          'Maak deze taak als voorbereiding op de overhoring van volgende week.',
        id: 3,
        personId: mockTeacher.id,
        teacher: mockTeacher,
        learningAreaId: mockLearningAreas[2].id,
        learningArea: mockLearningAreas[2]
      })
    ];
  }

  private getMockEducontents(): EduContentInterface[] {
    const mockLearningAreas = this.getMockLearningAreas();
    const mockEducontentProductTypes = this.getMockEduContentProductTypes();
    const mockMethods = this.getMockMethods();

    return [
      new EduContentFixture({
        type: 'boek-e',
        id: 1,
        publishedEduContentMetadata: {
          version: 1,
          metaVersion: '0.1',
          language: 'be',
          title: 'De wereld van de getallen',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
          created: new Date('2018-09-04 14:21:19'),
          quotable: false,
          taskAllowed: true,
          link: '908500016',
          commitMessage: 'Initial publish',
          id: 1,
          learningAreaId: mockLearningAreas[0].id,
          learningArea: mockLearningAreas[0],
          eduContentProductTypeId: mockEducontentProductTypes[0].id,
          eduContentProductType: mockEducontentProductTypes[0],
          methods: mockMethods.filter(method => method.id === 1)
        }
      }),
      new EduContentFixture({
        type: 'link',
        id: 2,
        publishedEduContentMetadata: {
          version: 1,
          metaVersion: '0.1',
          language: 'be',
          title: 'Uit het leven gegrepen',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
          created: new Date('2018-09-04 14:21:19'),
          quotable: false,
          taskAllowed: true,
          link: 'https://drive.google.com/',
          commitMessage: 'Initial publish',
          id: 2,
          learningAreaId: mockLearningAreas[1].id,
          learningArea: mockLearningAreas[1],
          eduContentProductTypeId: mockEducontentProductTypes[1].id,
          eduContentProductType: mockEducontentProductTypes[1],
          methods: mockMethods.filter(method => method.id !== 3)
        }
      }),
      new EduContentFixture({
        type: 'exercise',
        id: 3,
        publishedEduContentMetadata: {
          version: 1,
          metaVersion: '0.1',
          language: 'be',
          title: 'Het gemiddelde',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
          created: new Date('2018-09-04 14:21:19'),
          quotable: true,
          taskAllowed: true,
          fileName: '19462.ludo.zip',
          file: '9-f0ffb8dbde05931dfb9baeee5c86b27.ludo.zip',
          checksum: 'f0ffb8dbde05931dfb9baeee5c86b27',
          commitMessage: 'Initial publish',
          id: 3,
          learningAreaId: mockLearningAreas[2].id,
          learningArea: mockLearningAreas[2],
          eduContentProductTypeId: mockEducontentProductTypes[2].id,
          eduContentProductType: mockEducontentProductTypes[2],
          methods: mockMethods
        }
      }),
      new EduContentFixture({
        type: 'file',
        id: 4,
        publishedEduContentMetadata: {
          version: 1,
          metaVersion: '0.1',
          language: 'be',
          title: 'Percentrekenen',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
          created: new Date('2018-09-04 14:21:19'),
          quotable: false,
          taskAllowed: true,
          fileName: 'HAN_meetkunde_tso_geogebra_p23_stelling_van_Thales.ggb',
          file: '13-f0ffb8dbde05931dfb9baeee5c86b211.ggb',
          checksum: 'f0ffb8dbde05931dfb9baeee5c86b211',
          commitMessage: 'Initial publish',
          id: 4,
          learningAreaId: mockLearningAreas[0].id,
          learningArea: mockLearningAreas[0],
          eduContentProductTypeId: mockEducontentProductTypes[0].id,
          eduContentProductType: mockEducontentProductTypes[0],
          methods: mockMethods
        }
      })
    ];
  }

  getMockEduContentProductTypes(): EduContentProductTypeInterface[] {
    return [
      new EduContentProductTypeFixture({
        name: 'Jaarplan',
        icon: 'polpo-lesmateriaal',
        pedagogic: true,
        excludeFromFilter: false,
        id: 2
      }),
      new EduContentProductTypeFixture({
        name: 'Online oefeningen',
        icon: 'polpo-tasks',
        pedagogic: false,
        excludeFromFilter: false,
        id: 4
      }),
      new EduContentProductTypeFixture({
        name: 'Lessuggesties',
        icon: 'polpo-lesmateriaal',
        pedagogic: true,
        excludeFromFilter: false,
        id: 6
      }),
      new EduContentProductTypeFixture({
        name: 'Links',
        icon: 'polpo-website',
        pedagogic: false,
        excludeFromFilter: false,
        id: 18
      })
    ];
  }

  getMockMethods(): MethodInterface[] {
    const mockLearningAreas = this.getMockLearningAreas();
    return [
      new MethodFixture({
        name: 'Beautemps',
        icon: 'beautemps',
        logoUrl: 'beautemps.svg',
        experimental: false,
        id: 1,
        learningAreaId: mockLearningAreas[0].id,
        learningArea: mockLearningAreas[0]
      }),
      new MethodFixture({
        name: 'Kapitaal',
        icon: 'kapitaal',
        logoUrl: 'kapitaal.svg',
        experimental: false,
        id: 2,
        learningAreaId: mockLearningAreas[1].id,
        learningArea: mockLearningAreas[1]
      }),
      new MethodFixture({
        name: 'Beaufort',
        icon: 'beaufort',
        logoUrl: 'beaufort.svg',
        experimental: false,
        id: 3,
        learningAreaId: mockLearningAreas[2].id,
        learningArea: mockLearningAreas[2]
      })
    ];
  }

  getMockListFormat(): Observable<ListFormat> {
    return new BehaviorSubject(ListFormat.GRID);
  }

  changeListFormat(listFormat: ListFormat): void {}
}

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TasksComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TasksViewModel, useClass: MockViewModel },
        { provide: ActivatedRoute, value: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should return 100 as progress if startdate == endDate', () => {
    const startDate = new Date(1541599801751);
    const endDate = new Date(1541599801751);
    const currentDate = new Date();
    jest.spyOn(component, 'getDate').mockReturnValue(currentDate);
    expect(component.getProgress(startDate, endDate)).toBe(100);
  });

  it('it should return 0 as progress if startDate == currentDate && enddate > startDate', () => {
    const startDate = new Date(1541599801751);
    const endDate = new Date(1541999801751);
    const currentDate = startDate;
    jest.spyOn(component, 'getDate').mockReturnValue(currentDate);
    expect(component.getProgress(startDate, endDate)).toBe(0);
  });

  it('should return 100 if the currentdate > enddate', () => {
    const startDate = new Date(1541599801751);
    const endDate = new Date(1541999801751);
    const currentDate = new Date(2541999801751);
    jest.spyOn(component, 'getDate').mockReturnValue(currentDate);
    expect(component.getProgress(startDate, endDate)).toBe(100);
  });

  it('should return 0 if startdate > enddate', () => {
    const startDate = new Date(2541599801751);
    const endDate = new Date(1541999801751);
    const currentDate = new Date(1641999801751);
    jest.spyOn(component, 'getDate').mockReturnValue(currentDate);
    expect(component.getProgress(startDate, endDate)).toBe(0);
  });

  it('should return 0 if startdate and or enddate is missing', () => {
    const startDate = new Date(2541599801751);
    const endDate = new Date(1541999801751);
    const currentDate = new Date(1641999801751);
    jest.spyOn(component, 'getDate').mockReturnValue(currentDate);
    expect(component.getProgress(null, endDate)).toBe(0);
    expect(component.getProgress(startDate, null)).toBe(0);
    expect(component.getProgress(null, null)).toBe(0);
  });

  it('should return the correct icon', () => {
    expect(component.getIcon(true)).toBe('icon-checkmark');
    expect(component.getIcon(false)).toBe(''); //no icon shown
  });

  it('it should return the correct deadline string', () => {
    const date = new Date(1541599801751);
    expect(component.getDeadLineString(date)).toBe('7/11/18 15:10');
  });

  it('it should return an empty deadline if no date is set', () => {
    expect(component.getDeadLineString(null)).toBe('');
  });

  it('should display all tasks', () => {
    const tasksContainer = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );
    expect(tasksContainer).toBeTruthy();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(4);
  });

  it('should filter out tasks', () => {
    const tasksContainer = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );
    expect(tasksContainer).toBeTruthy();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(4);
    component.filterInput$.next('test');
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(0);
    component.filterInput$.next('Overhoring');
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(2);
    component.filterInput$.next('');
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(4);
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

  it('should display correct tasks count text when filtered', () => {
    const tasksText = fixture.debugElement.query(
      By.css('.pages-tasks__container__tasks-count')
    );
    expect(tasksText).toBeTruthy();
    expect(tasksText.nativeElement.innerHTML).toBe(
      ' 4 van <u>4</u> weergegeven '
    );
    component.filterInput$.next('overhoring');
    fixture.detectChanges();
    expect(tasksText.nativeElement.innerHTML).toBe(
      ' 2 van <u>4</u> weergegeven '
    );
  });

  it('should reset the filter', () => {
    const tasksContainer = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );
    component.filterInput$.next('test');
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(0);
    component.resetFilterInput();
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(4);
  });

  it('should change the filter input', () => {
    const tasksContainer = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );
    component.onChangeFilterInput('test');
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(0);
    component.onChangeFilterInput('');
    fixture.detectChanges();
    expect(tasksContainer.children[1].nativeElement.children.length).toBe(4);
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
