import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatTooltipModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DiaboloPhaseFixture,
  EduContentFixture,
  EduContentMetadataFixture
} from '@campus/dal';
import {
  ContentActionInterface,
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN,
  EduContentSearchResultInterface
} from '@campus/shared';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { EduContentSearchResultComponent } from './edu-content-search-result.component';

describe('EduContentSearchResultComponent', () => {
  let component: EduContentSearchResultComponent;
  let fixture: ComponentFixture<EduContentSearchResultComponent>;
  let contentActionsServiceInterface: ContentActionsServiceInterface;
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
          provide: CONTENT_ACTIONS_SERVICE_TOKEN,
          useValue: {
            getActionsForEduContent: () => mockActions
          }
        }
      ]
    });

    contentActionsServiceInterface = TestBed.get(CONTENT_ACTIONS_SERVICE_TOKEN);
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
    it('should show the file extension of the eduContent', () => {
      const extensionDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__extension')
      );

      expect(extensionDE.componentInstance.extensionClass).toBe(
        mockEduContent.fileExtension
      );

      expect(extensionDE.componentInstance.title).toBe(
        mockEduContent.fileTypeLabel
      );
    });

    it('should show the title and description of the eduContent', () => {
      const titleDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__content__header__title')
      );

      const descriptionDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__content__body__description')
      );

      expect(titleDE.nativeElement.textContent).toBe(mockEduContent.name);

      expect(descriptionDE.nativeElement.textContent).toBe(
        mockEduContent.description
      );
    });

    it('should show the title and description of the eduContent', () => {
      const titleDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__content__header__title')
      );

      const descriptionDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__content__body__description')
      );

      expect(titleDE.nativeElement.textContent).toBe(mockEduContent.name);

      expect(descriptionDE.nativeElement.textContent).toBe(
        mockEduContent.description
      );
    });

    it('should show the diabolo phase icon of the eduContent', () => {
      const diaboloIconDE = fixture.debugElement.query(
        By.css('.app-educontentsearchresult__content__header__diabolo-phase')
      );

      expect(diaboloIconDE.componentInstance.svgIcon).toBe(
        mockEduContent.diaboloPhase.icon
      );
    });

    it('should show the possible actions for the eduContent', () => {
      const actionDEs = fixture.debugElement.queryAll(
        By.css('.app-educontentsearchresult__content__header__action')
      );

      expect(actionDEs.length).toBe(mockActions.length);
      actionDEs.forEach((actionDE, index) => {
        const mockAction = mockActions[index];
        const clickAction = jest.spyOn(component, 'onActionClick');

        expect(actionDE.nativeElement.textContent).toBe(mockAction.label);
        expect(actionDE.componentInstance.iconClass).toBe(mockAction.icon);

        actionDE.nativeElement.click();
        expect(clickAction).toHaveBeenCalled();

        clickAction.mockReset();
      });
    });
  });
});
