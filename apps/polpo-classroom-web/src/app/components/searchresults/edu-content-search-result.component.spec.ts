import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  BundleFixture,
  EduContentBookFixture,
  EduContentFixture,
  EduContentMetadataFixture,
  EduContentProductTypeFixture,
  EduContentTOCFixture,
  FavoriteTypesEnum,
  TaskFixture
} from '@campus/dal';
import { EduContentSearchResultInterface } from '@campus/shared';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { EduContentSearchResultComponent } from './edu-content-search-result.component';
import {
  EduContentSearchResultItemServiceInterface,
  EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN
} from './edu-content-search-result.service.interface';

describe('EduContentSearchResultComponent', () => {
  let component: EduContentSearchResultComponent;
  let fixture: ComponentFixture<EduContentSearchResultComponent>;
  let eduContentSearchResultItemService: EduContentSearchResultItemServiceInterface;
  const mockIsFavorite = new BehaviorSubject(false);
  let dateMock: MockDate;

  beforeAll(() => {
    dateMock = new MockDate();
  });
  afterAll(() => {
    dateMock.returnRealDate();
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EduContentSearchResultComponent],
      imports: [MatIconModule, UiModule, NoopAnimationsModule],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN,
          useValue: {
            isFavorite$: () => mockIsFavorite,
            toggleFavorite: jest.fn(),
            upsertEduContentToStore: jest.fn(),
            upsertHistoryToStore: jest.fn(),
            linkTask: jest.fn(),
            linkBundle: jest.fn(),
            openStatic: jest.fn(),
            openExercise: jest.fn()
          }
        }
      ]
    });

    eduContentSearchResultItemService = TestBed.get(
      EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchResultComponent);
    component = fixture.componentInstance;

    component.data = {
      eduContent: new EduContentFixture({ id: 1 }),
      currentBundle: null,
      currentTask: null,
      inTask: false,
      inBundle: false,
      isFavorite: false,
      minimal: new EduContentFixture({ id: 1 })
    } as EduContentSearchResultInterface;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('contents', () => {
    it('should show a check icon top right if currentTask and inTask', () => {
      const query =
        '.app-educontentsearchresult__top__details__header__icons__added-task';

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.inTask = true;
      component.data.currentTask = new TaskFixture();
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));

      expect(el).toBeTruthy();
    });

    it('should show a check icon top right if currentBundle and inBundle', () => {
      const query =
        '.app-educontentsearchresult__top__details__header__icons__added-bundle';

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.inBundle = true;
      component.data.currentBundle = new BundleFixture();
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));

      expect(el).toBeTruthy();
    });

    it('should show a book icon if EduContent TOC length > 0', () => {
      const query =
        '.app-educontentsearchresult__top__details__header__icons mat-icon[mattooltip="Gekoppeld aan een bordboek"]';

      component.data.eduContent.publishedEduContentMetadata.eduContentTOC = null;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.eduContentTOC = [
        new EduContentTOCFixture()
      ];
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));

      expect(el).toBeTruthy();
    });

    it('should show a student icon if the content is pedagogic', () => {
      const query =
        '.app-educontentsearchresult__top__details__header__icons mat-icon[mattooltip="Pedagogisch materiaal"]';

      component.data.eduContent.publishedEduContentMetadata.eduContentProductType.pedagogic = false;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.eduContentProductType.pedagogic = true;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));

      expect(el).toBeTruthy();
    });

    it('should show a preview image if the EduContent has one', () => {
      const query = '.app-educontentsearchresult__top__thumbnail';
      const imgUrl = 'test.jpg';

      component.data.eduContent.publishedEduContentMetadata.thumbSmall = '';
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.thumbSmall = imgUrl;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));

      expect(el).toBeTruthy();
      expect(el.styles.backgroundImage).toBe('url(' + imgUrl + ')');
    });

    it('should show the file extension (extensionClass = fileExt)', () => {
      const query = 'campus-file-extension';
      const extension = 'ludo.zip';

      component.data.eduContent.publishedEduContentMetadata.fileExt = extension;
      fixture.detectChanges();

      const extensionClass = fixture.debugElement.query(By.css(query))
        .componentInstance.extensionClass;
      expect(extensionClass).toBeTruthy();
      expect(extensionClass).toBe(extension);
    });

    it('should show the title of the EduContent', () => {
      const query =
        '.app-educontentsearchresult__top__details__header__title span';
      const title = 'Hoeken';

      component.data.eduContent.publishedEduContentMetadata.title = title;
      fixture.detectChanges();

      const text = fixture.debugElement.query(By.css(query)).nativeElement
        .textContent;

      expect(text).toBe(title);
    });

    it('should show the description of the EduContent', () => {
      const query = '.app-educontentsearchresult__top__details__content';
      const description = 'Sample description';

      component.data.eduContent.publishedEduContentMetadata.description = description;
      fixture.detectChanges();

      const text = fixture.debugElement.query(By.css(query)).nativeElement
        .textContent;

      expect(text).toBe(description);
    });

    it("should show the educontent's methods", () => {
      const queryTopos =
        '.app-educontentsearchresult__top__details__methods .topos';

      const queryNando =
        '.app-educontentsearchresult__top__details__methods .nando';

      expect(fixture.debugElement.query(By.css(queryTopos))).toBeTruthy();
      expect(fixture.debugElement.query(By.css(queryNando))).toBeTruthy();
    });
  });

  describe('bottom uncollapsible', () => {
    it('should show the content type icon of the EduContent', () => {
      const query =
        '.app-educontentsearchresult__bottom__contents__producttype mat-icon';
      const icon = 'test';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.eduContentProductType = new EduContentProductTypeFixture(
        { icon: icon }
      );
      fixture.detectChanges();

      const iconClass = fixture.debugElement.query(By.css(query))
        .componentInstance.svgIcon;

      expect(iconClass).toBeTruthy();
      expect(iconClass).toBe(icon);
    });

    it('should show the student icon if isPedagogic', () => {
      const query =
        '.app-educontentsearchresult__bottom__contents__pedagogic mat-icon';
      const icon = 'student';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.eduContentProductType.pedagogic = false;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(query))).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.eduContentProductType.pedagogic = true;
      fixture.detectChanges();

      const iconClass = fixture.debugElement.query(By.css(query))
        .componentInstance.svgIcon;

      expect(iconClass).toBeTruthy();
      expect(iconClass).toBe(icon);
    });

    it('should show the toc', () => {
      const queryBase =
        '.app-educontentsearchresult__bottom__contents__toc-body ';
      const queryTitle = queryBase + 'span';
      const title = 'mytitle';
      const expectedTocs = ['a', 'b'];
      const book = new EduContentBookFixture({
        id: 1,
        title: title
      });

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.eduContentTOC = [
        new EduContentTOCFixture({
          treeId: 1,
          eduContentBook: book,
          title: expectedTocs[0],
          depth: 0
        }),
        new EduContentTOCFixture({
          treeId: 1,
          eduContentBook: book,
          title: expectedTocs[1],
          depth: 1
        })
      ];

      component.ngOnChanges({
        data: new SimpleChange(component.data, component.data, false)
      });

      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css(queryTitle)).nativeElement.textContent
      ).toBe(title);

      for (let i = 0; i < 2; i++) {
        expect(
          fixture.debugElement.query(
            By.css(queryBase + '.toc-depth-' + i.toString())
          ).nativeElement.textContent
        ).toBe(expectedTocs[i]);
      }
    });
  });

  describe('actions', () => {
    it('should show link bundle button if no currentTask and not in bundle', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__linkbundle';

      component.isSelected = true;
      component.data.currentTask = new TaskFixture();
      component.data.inBundle = true;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.currentTask = null;
      component.data.inBundle = false;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show unlink bundle button if in bundle', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__unlinkbundle';

      component.isSelected = true;
      component.data.inBundle = false;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.inBundle = true;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show link task button if no currentBundle and not in task and taskAllowed', () => {
      const query = '.app-educontentsearchresult__bottom__buttonbar__linktask';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.taskAllowed = false;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.taskAllowed = true;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show unlink task button if in task', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__unlinktask';

      component.isSelected = true;
      component.data.inTask = false;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.inTask = true;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show download button if educontent is streamable', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__openstatic__download';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.streamable = false;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.streamable = true;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show openstatic view button if content is not an exercise', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__openstatic';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.fileExt =
        'ludo.zip';
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.fileExt = 'pdf';
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show open exercise without solutions button if content is an exercise', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__openexercise';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.fileExt = 'pdf';
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.fileExt =
        'ludo.zip';
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should show open exercise with solutions button if content is an exercise', () => {
      const query =
        '.app-educontentsearchresult__bottom__buttonbar__openexercise__solutions';

      component.isSelected = true;
      component.data.eduContent.publishedEduContentMetadata.fileExt = 'pdf';
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css(query));
      expect(el).toBeFalsy();

      component.data.eduContent.publishedEduContentMetadata.fileExt =
        'ludo.zip';
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css(query));
      expect(el).toBeTruthy();
    });

    it('should update the toggleFavorite button content', () => {
      component.isSelected = true;
      fixture.detectChanges();

      const toggleFavoriteButton = fixture.debugElement.query(
        By.css(
          '.app-educontentsearchresult__bottom__buttonbar__togglefavorites'
        )
      );

      mockIsFavorite.next(false);
      fixture.detectChanges();

      let checkmarkDE = toggleFavoriteButton.query(By.css('.checkmark'));
      expect(checkmarkDE).toBeFalsy();
      expect(toggleFavoriteButton.nativeElement.textContent.trim()).toBe(
        'Toevoegen aan favorieten'
      );

      mockIsFavorite.next(true);
      fixture.detectChanges();

      checkmarkDE = toggleFavoriteButton.query(By.css('.checkmark'));
      expect(checkmarkDE).toBeTruthy();
      expect(toggleFavoriteButton.nativeElement.textContent.trim()).toBe(
        'Verwijderen uit favorieten'
      );
    });

    describe('update store', () => {
      it('should add eduContent on toggleFavorite()', () => {
        component.toggleFavorite();
        expect(
          eduContentSearchResultItemService.upsertEduContentToStore
        ).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.upsertEduContentToStore
        ).toHaveBeenCalledWith(component.data.eduContent.minimal);
      });

      it('should add eduContent on openStatic()', () => {
        component.openStatic();
        expect(
          eduContentSearchResultItemService.upsertEduContentToStore
        ).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.upsertEduContentToStore
        ).toHaveBeenCalledWith(component.data.eduContent.minimal);
      });

      it('should add eduContent on openExercise()', () => {
        component.openExercise(false);
        expect(
          eduContentSearchResultItemService.upsertEduContentToStore
        ).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.upsertEduContentToStore
        ).toHaveBeenCalledWith(component.data.eduContent.minimal);
      });
    });
  });

  describe('logic', () => {
    it('should return the correct value if educontent is in the current bundle', () => {
      component.data.currentBundle = new BundleFixture();
      component.data.currentBundle.eduContents = [];

      expect(component.isEduContentInCurrentBundle).toBeFalsy();

      component.data.currentBundle.eduContents.push(component.data.eduContent);

      expect(component.isEduContentInCurrentBundle).toBeTruthy();
    });

    it('should return the correct value if educontent is in the current task', () => {
      component.data.currentTask = new TaskFixture();
      component.data.currentTask.eduContents = [];

      expect(component.isEduContentInCurrentTask).toBeFalsy();

      component.data.currentTask.eduContents.push(component.data.eduContent);

      expect(component.isEduContentInCurrentTask).toBeTruthy();
    });

    describe('EduContent actions', () => {
      it('should call manageTasksForContent on collection manager when calling linkTask', () => {
        component.linkTask();
        expect(eduContentSearchResultItemService.linkTask).toHaveBeenCalled();
        expect(eduContentSearchResultItemService.linkTask).toHaveBeenCalledWith(
          component.data.eduContent
        );
      });

      it('should call manageBundlesForContent on collection manager when calling linkBundle', () => {
        component.linkBundle();
        expect(eduContentSearchResultItemService.linkBundle).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.linkBundle
        ).toHaveBeenCalledWith(component.data.eduContent);
      });

      it('should call open on static content service when calling openStatic and upsertHistoryToStore', () => {
        component.data = {
          eduContent: new EduContentFixture({
            id: 1,
            publishedEduContentMetadata: new EduContentMetadataFixture({
              title: 'foo',
              learningAreaId: 29
            }),
            type: 'boek-e'
          }),
          currentBundle: null,
          currentTask: null,
          inTask: false,
          inBundle: false,
          isFavorite: false,
          minimal: new EduContentFixture({ id: 1 })
        } as EduContentSearchResultInterface;

        fixture.detectChanges();

        const mockDate = new MockDate();

        const expectedHistory = {
          name: 'foo',
          type: 'boek-e',
          eduContentId: 1,
          created: mockDate.mockDate,
          learningAreaId: 29
        };

        component.openStatic(true);
        expect(eduContentSearchResultItemService.openStatic).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.openStatic
        ).toHaveBeenCalledWith(component.data.eduContent, true);
        expect(
          eduContentSearchResultItemService.upsertHistoryToStore
        ).toHaveBeenCalledWith(expectedHistory);

        mockDate.returnRealDate();
      });

      it('should call open without solutions on scorm exercise service when calling openExercise(false)', () => {
        component.openExercise(false);
        expect(
          eduContentSearchResultItemService.openExercise
        ).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.openExercise
        ).toHaveBeenCalledWith(component.data.eduContent.id, false);
      });

      it('should call open with solutions on scorm exercise service when calling openExercise(true)', () => {
        component.openExercise(true);
        expect(
          eduContentSearchResultItemService.openExercise
        ).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.openExercise
        ).toHaveBeenCalledWith(component.data.eduContent.id, true);
      });

      it('should call toggleFavorite on EduContentSearchResultItemService when calling toggleFavorite', () => {
        component.toggleFavorite();

        const expected = {
          name: component.data.eduContent.name,
          type: FavoriteTypesEnum.EDUCONTENT,
          eduContentId: component.data.eduContent.id,
          created: new Date(),
          learningAreaId:
            component.data.eduContent.publishedEduContentMetadata.learningAreaId
        };

        expect(
          eduContentSearchResultItemService.toggleFavorite
        ).toHaveBeenCalled();
        expect(
          eduContentSearchResultItemService.toggleFavorite
        ).toHaveBeenCalledWith(expected);
      });
    });
  });
});
