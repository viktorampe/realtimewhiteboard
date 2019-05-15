import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  BundleFixture,
  DalState,
  EduContentBookFixture,
  EduContentFixture,
  EduContentProductTypeFixture,
  EduContentReducer,
  EduContentTOCFixture,
  FavoriteReducer,
  getStoreModuleForFeatures,
  TaskFixture
} from '@campus/dal';
import {
  EduContentCollectionManagerServiceInterface,
  EduContentSearchResultInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { EduContentSearchResultComponent } from './edu-content-search-result.component';

describe('EduContentSearchResultComponent', () => {
  let component: EduContentSearchResultComponent;
  let fixture: ComponentFixture<EduContentSearchResultComponent>;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let collectionManagerService: EduContentCollectionManagerServiceInterface;
  let store: Store<DalState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EduContentSearchResultComponent],
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([FavoriteReducer, EduContentReducer]),
        MatIconModule,
        UiModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        {
          provide: EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
          useValue: {
            manageTasksForContent: jest.fn(),
            manageBundlesForContent: jest.fn()
          }
        },
        Store
      ]
    });

    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    collectionManagerService = TestBed.get(
      EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN
    );

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchResultComponent);
    component = fixture.componentInstance;

    component.data = {
      eduContent: new EduContentFixture(),
      currentBundle: null,
      currentTask: null,
      inTask: false,
      inBundle: false,
      isFavorite: false
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
        expect(
          collectionManagerService.manageTasksForContent
        ).toHaveBeenCalled();
        expect(
          collectionManagerService.manageTasksForContent
        ).toHaveBeenCalledWith(component.data.eduContent);
      });

      it('should call manageBundlesForContent on collection manager when calling linkBundle', () => {
        component.linkBundle();
        expect(
          collectionManagerService.manageBundlesForContent
        ).toHaveBeenCalled();
        expect(
          collectionManagerService.manageBundlesForContent
        ).toHaveBeenCalledWith(
          component.data.eduContent,
          component.data.eduContent.publishedEduContentMetadata.learningAreaId
        );
      });

      it('should call open on static content service when calling openStatic', () => {
        component.openStatic();
        expect(openStaticContentService.open).toHaveBeenCalled();
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          component.data.eduContent
        );
      });
    });
  });
});
