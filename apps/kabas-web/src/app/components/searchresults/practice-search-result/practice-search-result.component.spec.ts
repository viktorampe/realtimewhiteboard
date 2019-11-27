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
  EduContentMetadataFixture,
  MethodLevelFixture,
  Result
} from '@campus/dal';
import {
  ContentActionInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN,
  EduContentSearchResultInterface
} from '@campus/shared';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { PracticeSearchResultComponent } from './practice-search-result.component';

describe('PracticeSearchResultComponent', () => {
  let component: PracticeSearchResultComponent;
  let fixture: ComponentFixture<PracticeSearchResultComponent>;
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
      declarations: [PracticeSearchResultComponent],
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
          provide: CONTENT_ACTIONS_SERVICE_TOKEN,
          useValue: {
            getActionsForEduContent: () => mockActions
          }
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeSearchResultComponent);
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
        By.css('.app-practice-searchresult__extension')
      );

      expect(extensionDE.componentInstance.label).toBe(
        mockEduContent.fileExtension
      );
    });

    it('should clear the file icon label if the eduContent is an exercise', () => {
      const extensionDE = fixture.debugElement.query(
        By.css('.app-practice-searchresult__extension')
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
        By.css('.app-practice-searchresult__content__header')
      );

      const descriptionDE = fixture.debugElement.query(
        By.css('.app-practice-searchresult__content__body__description')
      );

      expect(titleDE.nativeElement.textContent).toContain(mockEduContent.name);

      expect(descriptionDE.nativeElement.textContent).toBe(
        mockEduContent.description
      );
    });

    it('should not show the methodLevel icon', () => {
      const methodLevelDE = fixture.debugElement.query(
        By.css('.app-practice-searchresult__content__header__level')
      );

      expect(methodLevelDE).toBeNull();
    });

    it('should show the methodLevel icon', () => {
      component.data = {
        ...component.data,
        methodLevel: new MethodLevelFixture({ icon: 'foo' })
      };
      fixture.detectChanges();

      const methodLevelIconDE = fixture.debugElement.query(
        By.css('.app-practice-searchresult__content__header__level .mat-icon')
      );

      expect(methodLevelIconDE.componentInstance.svgIcon).toBe('foo');
    });

    it('should show the methodLevel label when there is no icon', () => {
      component.data = {
        ...component.data,
        methodLevel: new MethodLevelFixture({ icon: null, label: 'bar' })
      };
      fixture.detectChanges();

      const methodLevelDE = fixture.debugElement.query(
        By.css('.app-practice-searchresult__content__header__level')
      );

      expect(methodLevelDE.nativeElement.textContent).toContain('bar');
    });

    it('should not empty stars when no result is available', () => {
      const starsDE = fixture.debugElement.queryAll(
        By.css('.app-practice-searchresult__stars__star')
      );

      expect(starsDE.length).toBe(3);
      expect(starsDE[0].componentInstance.svgIcon).toBe('star-outline');
      expect(starsDE[1].componentInstance.svgIcon).toBe('star-outline');
      expect(starsDE[2].componentInstance.svgIcon).toBe('star-outline');
    });

    it('should show the stars when a result is available', () => {
      component.data = {
        ...component.data,
        result: { stars: 2 } as Result
      };
      fixture.detectChanges();

      const starsDE = fixture.debugElement.queryAll(
        By.css('.app-practice-searchresult__stars .mat-icon')
      );

      expect(starsDE.length).toBe(3);
      expect(starsDE[0].componentInstance.svgIcon).toBe('star');
      expect(starsDE[1].componentInstance.svgIcon).toBe('star');
      expect(starsDE[2].componentInstance.svgIcon).toBe('star-outline');
    });

    it('should show the possible actions for the eduContent', () => {
      const actionDEs = fixture.debugElement.queryAll(
        By.css('.app-practice-searchresult__content__action')
      );

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
});
