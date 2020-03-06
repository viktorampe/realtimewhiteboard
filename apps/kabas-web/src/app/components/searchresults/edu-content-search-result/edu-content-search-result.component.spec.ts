import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatTooltipModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DiaboloPhaseFixture,
  EduContentFixture,
  EduContentMetadataFixture
} from '@campus/dal';
import {
  ContentActionInterface,
  ContentOpenActionsServiceInterface,
  CONTENT_OPEN_ACTIONS_SERVICE_TOKEN,
  CONTENT_TASK_ACTIONS_SERVICE_TOKEN,
  EduContentSearchResultInterface
} from '@campus/shared';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import {
  FileIconComponent,
  ListItemActionsDirective,
  ListItemCaptionDirective,
  ListItemTitleDirective,
  UiModule
} from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { EduContentSearchResultComponent } from './edu-content-search-result.component';

describe('EduContentSearchResultComponent', () => {
  let component: EduContentSearchResultComponent;
  let fixture: ComponentFixture<EduContentSearchResultComponent>;
  let contentOpenActionsService: ContentOpenActionsServiceInterface;
  const mockIsFavorite = new BehaviorSubject(false);
  let dateMock: MockDate;

  const mockEduContent = new EduContentFixture({
    id: 1,
    publishedEduContentMetadata: new EduContentMetadataFixture({
      title: 'De breuken',
      description: 'mock description',
      fileExt: 'pdf',
      fileLabel: 'pdfLabel',
      diaboloPhase: new DiaboloPhaseFixture({
        icon: 'diabolo-intro'
      })
    })
  });

  const mockActions: ContentActionInterface[] = [
    {
      label: 'Downloaden',
      icon: 'download',
      tooltip: 'Download dit bestand',
      handler: jest.fn()
    },
    {
      label: 'Stream',
      icon: 'stream',
      tooltip: 'Stream deze video',
      handler: jest.fn()
    }
  ];

  const mockTaskActions: ContentActionInterface[] = [
    {
      label: 'Toevoegen aan taak',
      icon: 'add',
      tooltip: 'Inhoud toevoagen aan deze taak',
      handler: jest.fn()
    }
  ];

  beforeAll(() => {
    dateMock = new MockDate();
  });
  afterAll(() => {
    dateMock.returnRealDate();
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EduContentSearchResultComponent],
      imports: [
        MatTooltipModule,
        MatIconModule,
        UiModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        {
          provide: CONTENT_OPEN_ACTIONS_SERVICE_TOKEN,
          useValue: {
            getActionsForEduContent: () => mockActions
          }
        },
        {
          provide: CONTENT_TASK_ACTIONS_SERVICE_TOKEN,
          useValue: {
            getTaskActionsForEduContent: () => mockTaskActions
          }
        }
      ]
    });

    contentOpenActionsService = TestBed.get(CONTENT_OPEN_ACTIONS_SERVICE_TOKEN);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchResultComponent);
    component = fixture.componentInstance;

    component.data = {
      eduContent: mockEduContent
    } as EduContentSearchResultInterface;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should set file icon label to the eduContent fileExtension', () => {
      const extensionDE = fixture.debugElement.query(
        By.directive(FileIconComponent)
      );

      expect(extensionDE.componentInstance.label).toBe(
        mockEduContent.fileExtension
      );
    });

    it('should clear the file icon label if the eduContent is an exercise', () => {
      const extensionDE = fixture.debugElement.query(
        By.directive(FileIconComponent)
      );

      component.data = {
        eduContent: new EduContentFixture({
          id: 1,
          publishedEduContentMetadata: new EduContentMetadataFixture({
            title: 'De breuken',
            description: 'mock description',
            fileExt: 'ludo.zip',
            fileLabel: 'pdfLabel',
            diaboloPhase: new DiaboloPhaseFixture({
              icon: 'diabolo-intro'
            })
          })
        })
      } as EduContentSearchResultInterface;

      fixture.detectChanges();

      expect(extensionDE.componentInstance.label).toBe('');
    });

    it('should show the title and description of the eduContent', () => {
      const titleDE = fixture.debugElement.query(
        By.directive(ListItemTitleDirective)
      );

      const descriptionDE = fixture.debugElement.query(
        By.directive(ListItemCaptionDirective)
      );

      expect(titleDE.nativeElement.textContent.trim()).toBe(
        mockEduContent.name
      );

      expect(descriptionDE.nativeElement.textContent).toBe(
        mockEduContent.description
      );
    });

    it('should show the diabolo phase icon of the eduContent', () => {
      const diaboloIconDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__icon')
      );

      expect(diaboloIconDE.componentInstance.svgIcon).toBe(
        mockEduContent.diaboloPhase.icon
      );
    });

    it('should show the possible actions for the eduContent', () => {
      const actionDEs = fixture.debugElement
        .query(By.directive(ListItemActionsDirective))
        .queryAll(By.css('.ui-button--inline'));

      expect(actionDEs.length).toBe(mockActions.length);
      actionDEs.forEach((actionDE, index) => {
        const mockAction = mockActions[index];
        const clickAction = jest.spyOn(component, 'onActionClick');

        expect(actionDE.nativeElement.textContent).toBe(mockAction.label);

        actionDE.nativeElement.click();
        expect(clickAction).toHaveBeenCalled();

        clickAction.mockReset();
      });
    });
  });

  describe('actions', () => {
    it('should return the default educontent actions', () => {
      expect(component.actions).toEqual(mockActions);
    });

    it('should include task actions when addTaskActions is true', () => {
      component.data = {
        eduContent: new EduContentFixture(),
        addTaskActions: true
      } as EduContentSearchResultInterface;

      component.ngOnInit();

      expect(component.actions).toEqual([...mockTaskActions, ...mockActions]);
    });
  });

  describe('update', () => {
    it('should get the actions', () => {
      expect(component.actions).toEqual(mockActions);

      component.data = {
        eduContent: new EduContentFixture(),
        addTaskActions: true
      } as EduContentSearchResultInterface;

      component.update();

      expect(component.actions).toEqual([...mockTaskActions, ...mockActions]);
    });
  });
});
