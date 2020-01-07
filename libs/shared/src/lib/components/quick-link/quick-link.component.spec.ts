import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from '@angular/core/testing';
import {
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
  MatIcon,
  MatIconModule,
  MatIconRegistry,
  MatList,
  MatListItem,
  MatListModule,
  MatListSubheaderCssMatStyler,
  MatMenuModule,
  MatTooltipModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BundleFixture,
  EduContent,
  EduContentFixture,
  EduContentMetadataFixture,
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  FavoriteFixture,
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface,
  LearningAreaFixture,
  Priority,
  TaskFixture
} from '@campus/dal';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import {
  BannerComponent,
  ButtonComponent,
  ContentEditableComponent,
  FilterTextInputComponent,
  InfoPanelComponent,
  UiModule
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { hot } from '@nrwl/angular/testing';
import { BehaviorSubject } from 'rxjs';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import { QuickLinkComponent } from './quick-link.component';
import {
  QuickLinkActionInterface,
  QuickLinkCategoryInterface,
  QuickLinkInterface
} from './quick-link.interface';
import { QuickLinkViewModel } from './quick-link.viewmodel';
import { MockQuickLinkViewModel } from './quick-link.viewmodel.mock';

describe('QuickLinkComponent', () => {
  let component: QuickLinkComponent;
  let fixture: ComponentFixture<QuickLinkComponent>;
  let quickLinkViewModel: QuickLinkViewModel;
  let vmQuickLinkCategories$: BehaviorSubject<QuickLinkCategoryInterface[]>;
  let vmFeedback$: BehaviorSubject<EffectFeedbackInterface>;
  let dateMock: MockDate;
  const mockInjectedData = { mode: 'foo' };

  beforeAll(() => {
    dateMock = new MockDate();
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        MatIconModule,
        MatTooltipModule,
        MatListModule,
        MatDialogModule,
        RouterTestingModule,
        MatMenuModule,
        NoopAnimationsModule
      ],
      declarations: [QuickLinkComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockInjectedData },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: FILTER_SERVICE_TOKEN,
          useValue: {
            filter: () => {}
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    }).overrideComponent(QuickLinkComponent, {
      set: {
        providers: [
          { provide: QuickLinkViewModel, useClass: MockQuickLinkViewModel }
        ]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickLinkComponent);
    component = fixture.componentInstance;

    // provided on component level
    quickLinkViewModel = component['quickLinkViewModel'];

    // in the mockViewmodel this is a BehaviorSubject
    // in the mockViewmodel the mode parameter isn't used
    vmQuickLinkCategories$ = quickLinkViewModel.getQuickLinkCategories$(
      null
    ) as BehaviorSubject<QuickLinkCategoryInterface[]>;
    vmFeedback$ = quickLinkViewModel.getFeedback$() as BehaviorSubject<
      EffectFeedbackInterface
    >;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI', () => {
    describe('for the dialog', () => {
      it('should change the title and title icon based on the mode', () => {
        const infoPanel = fixture.debugElement.query(
          By.directive(InfoPanelComponent)
        ).componentInstance as InfoPanelComponent;

        component.data.mode = QuickLinkTypeEnum.FAVORITES;
        component.ngOnInit();
        fixture.detectChanges();
        expect(infoPanel.titleText).toBe('Favorieten');
        expect(infoPanel.titleIcon).toBe('favorites');

        component.data.mode = QuickLinkTypeEnum.HISTORY;
        component.ngOnInit();
        fixture.detectChanges();
        expect(infoPanel.titleText).toBe('Recente items');
        expect(infoPanel.titleIcon).toBe('unfinished');
      });

      it('should show the quicklinks in a list', () => {
        const quickLinkCategories = vmQuickLinkCategories$.value;
        const quickLinkAmount = quickLinkCategories.reduce((acc, cat) => {
          acc += cat.quickLinks.length;
          return acc;
        }, 0);

        const listItems = fixture.debugElement.queryAll(
          By.directive(MatListItem)
        );
        const listItemTitles = listItems.map(
          listItem =>
            listItem.query(By.css('.quick-link__item__title')).nativeElement
              .textContent
        );

        expect(listItems.length).toBe(quickLinkAmount);
        // every quickLink should have a listItem with the same name
        // mock data contains quicklinks with unique names
        expect(
          quickLinkCategories.every(qL =>
            listItemTitles.some(title => title === qL.title)
          )
        );
      });

      it('should show the unique quicklink categories as headers in the list', () => {
        const headers = Array.from(
          new Set(vmQuickLinkCategories$.value.map(qL => qL.type))
        );

        const listHeaders = fixture.debugElement.queryAll(
          By.directive(MatListSubheaderCssMatStyler)
        );
        const listHeaderTitles = listHeaders.map(
          listHeader => listHeader.nativeElement.textContent
        );

        expect(listHeaders.length).toBe(headers.length);
        // every unique quickLink.type should have a header with the same text
        expect(
          headers.every(header =>
            listHeaderTitles.some(title => title === header)
          )
        );
      });
    });

    describe('per quickLink', () => {
      it('should show the learning area icon', () => {
        const mockQuickLink = addActions(
          new FavoriteFixture({
            learningArea: new LearningAreaFixture({ icon: 'foo' })
          })
        );

        const mockQuickLinkCategory: QuickLinkCategoryInterface = {
          title: 'foo',
          type: mockQuickLink.type,
          order: 1,
          quickLinks: [mockQuickLink]
        };

        vmQuickLinkCategories$.next([mockQuickLinkCategory]);
        fixture.detectChanges();

        const listItemIcon = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.directive(MatIcon)).componentInstance as MatIcon;

        expect(listItemIcon.svgIcon).toBe(mockQuickLink.learningArea.icon);
      });

      it('should show quickLink name', () => {
        const mockQuickLink = addActions(
          new FavoriteFixture({
            name: 'foo',
            learningArea: new LearningAreaFixture({ icon: 'foo' })
          })
        );

        const mockQuickLinkCategory: QuickLinkCategoryInterface = {
          title: 'foo',
          type: mockQuickLink.type,
          order: 1,
          quickLinks: [mockQuickLink]
        };

        vmQuickLinkCategories$.next([mockQuickLinkCategory]);
        fixture.detectChanges();

        const listItemName = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.css('.quick-link__item__title')).nativeElement.textContent;

        expect(listItemName).toBe(mockQuickLink.name);
      });

      describe('open actions', () => {
        describe('type: area', () => {
          beforeEach(() => {
            const mockQuickLink = addActions(
              new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.AREA
              }),
              { handler: 'openArea' }
            );

            const mockQuickLinkCategory: QuickLinkCategoryInterface = {
              title: 'foo',
              type: mockQuickLink.type,
              order: 1,
              quickLinks: [mockQuickLink]
            };

            vmQuickLinkCategories$.next([mockQuickLinkCategory]);
            fixture.detectChanges();
          });
          it('should not show the alternativeOpenActions as links', () => {
            const listItemLinks = fixture.debugElement
              .query(By.directive(MatListItem))
              .queryAll(By.css('a'));

            expect(listItemLinks.length).toBe(0);
          });

          it('should call the correct action handler on element click', () => {
            const listItem = fixture.debugElement.query(
              By.directive(MatListItem)
            );

            // default action
            spyOn(component, 'openArea');
            listItem.triggerEventHandler('click', null);
            expect(component.openArea).toHaveBeenCalled();
          });
        });

        describe('type: bundle', () => {
          beforeEach(() => {
            const mockQuickLink = addActions(
              new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.BUNDLE
              }),
              { handler: 'openBundle' }
            );

            const mockQuickLinkCategory: QuickLinkCategoryInterface = {
              title: 'foo',
              type: mockQuickLink.type,
              order: 1,
              quickLinks: [mockQuickLink]
            };

            vmQuickLinkCategories$.next([mockQuickLinkCategory]);
            fixture.detectChanges();
          });
          it('should not show the alternativeOpenActions as links', () => {
            const listItemLinks = fixture.debugElement
              .query(By.directive(MatListItem))
              .queryAll(By.css('a'));

            expect(listItemLinks.length).toBe(0);
          });

          it('should call the correct action handler on element click', fakeAsync(() => {
            const listItem = fixture.debugElement.query(
              By.directive(MatListItem)
            );

            // default action
            spyOn(component, 'openBundle');
            listItem.triggerEventHandler('click', null);
            expect(component.openBundle).toHaveBeenCalled();
          }));
        });

        describe('type: task', () => {
          beforeEach(() => {
            const mockQuickLink = addActions(
              new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.TASK
              }),
              { handler: 'openTask' }
            );

            const mockQuickLinkCategory: QuickLinkCategoryInterface = {
              title: 'foo',
              type: mockQuickLink.type,
              order: 1,
              quickLinks: [mockQuickLink]
            };

            vmQuickLinkCategories$.next([mockQuickLinkCategory]);
            fixture.detectChanges();
          });
          it('should not show the alternativeOpenActions as links', () => {
            const listItemLinks = fixture.debugElement
              .query(By.directive(MatListItem))
              .queryAll(By.css('a'));

            expect(listItemLinks.length).toBe(0);
          });

          it('should call the correct action handler on element click', fakeAsync(() => {
            const listItem = fixture.debugElement.query(
              By.directive(MatListItem)
            );

            // default action
            spyOn(component, 'openTask');
            listItem.triggerEventHandler('click', null);
            expect(component.openTask).toHaveBeenCalled();
          }));
        });

        describe('type: boek-e', () => {
          beforeEach(() => {
            const mockQuickLink = addActions(
              new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.BOEKE
              }),
              { handler: 'openBoeke' }
            );

            const mockQuickLinkCategory: QuickLinkCategoryInterface = {
              title: 'foo',
              type: mockQuickLink.type,
              order: 1,
              quickLinks: [mockQuickLink]
            };

            vmQuickLinkCategories$.next([mockQuickLinkCategory]);
            fixture.detectChanges();
          });
          it('should not show the alternativeOpenActions as links', () => {
            const listItemLinks = fixture.debugElement
              .query(By.directive(MatListItem))
              .queryAll(By.css('a'));

            expect(listItemLinks.length).toBe(0);
          });

          it('should call the correct action handler on element click', fakeAsync(() => {
            const listItem = fixture.debugElement.query(
              By.directive(MatListItem)
            );

            // default action
            spyOn(component, 'openBoeke');
            listItem.triggerEventHandler('click', null);
            expect(component.openBoeke).toHaveBeenCalled();
          }));
        });

        describe('type: search', () => {
          beforeEach(() => {
            const mockQuickLink = addActions(
              new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.SEARCH
              }),
              { handler: 'openSearch' }
            );

            const mockQuickLinkCategory: QuickLinkCategoryInterface = {
              title: 'foo',
              type: mockQuickLink.type,
              order: 1,
              quickLinks: [mockQuickLink]
            };

            vmQuickLinkCategories$.next([mockQuickLinkCategory]);
            fixture.detectChanges();
          });
          it('should not show the alternativeOpenActions as links', () => {
            const listItemLinks = fixture.debugElement
              .query(By.directive(MatListItem))
              .queryAll(By.css('a'));

            expect(listItemLinks.length).toBe(0);
          });

          it('should call the correct action handler on element click', () => {
            const listItem = fixture.debugElement.query(
              By.directive(MatListItem)
            );

            // default action
            spyOn(component, 'openSearch');
            listItem.triggerEventHandler('click', null);
            expect(component.openSearch).toHaveBeenCalled();
          });
        });

        describe('type: educontent - exercise', () => {
          beforeEach(() => {
            const mockQuickLink = addActions(
              new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.EDUCONTENT,
                eduContent: new EduContentFixture({ type: 'exercise' })
              }),
              { handler: 'openEduContentAsExercise' },
              [
                {
                  handler: 'openEduContentAsSolution',
                  label: 'Toon oplossing'
                }
              ]
            );

            const mockQuickLinkCategory: QuickLinkCategoryInterface = {
              title: 'foo',
              type: mockQuickLink.type,
              order: 1,
              quickLinks: [mockQuickLink]
            };

            vmQuickLinkCategories$.next([mockQuickLinkCategory]);
            fixture.detectChanges();
          });

          it('should show the alternativeOpenActions as links', () => {
            const listItemLinks = fixture.debugElement
              .query(By.directive(MatListItem))
              .queryAll(By.css('a'));

            expect(listItemLinks.length).toBe(1);
            expect(listItemLinks[0].nativeElement.textContent.trim()).toBe(
              'Toon oplossing'
            );
          });

          it('should call the correct action handler on element click', fakeAsync(() => {
            const listItem = fixture.debugElement.query(
              By.directive(MatListItem)
            );

            const listItemLinks = listItem.queryAll(By.css('a'));

            // default action
            spyOn(component, 'openEduContentAsExercise');
            listItem.triggerEventHandler('click', null);
            expect(component.openEduContentAsExercise).toHaveBeenCalled();

            // alternative open action
            spyOn(component, 'openEduContentAsSolution');
            listItemLinks[0].triggerEventHandler('click', null);
            expect(component.openEduContentAsSolution).toHaveBeenCalled();
          }));
        });

        describe('type: educontent - not an exercise', () => {
          describe('educontent is streamable', () => {
            beforeEach(() => {
              const mockQuickLink = addActions(
                new FavoriteFixture({
                  name: 'foo',
                  learningArea: new LearningAreaFixture(),
                  type: FavoriteTypesEnum.EDUCONTENT,
                  eduContent: new EduContentFixture(
                    { type: 'not an exercise' },
                    new EduContentMetadataFixture({ streamable: true })
                  )
                }),
                { handler: 'openEduContentAsStream' },
                [{ handler: 'openEduContentAsDownload', label: 'Downloaden' }]
              );

              const mockQuickLinkCategory: QuickLinkCategoryInterface = {
                title: 'foo',
                type: mockQuickLink.type,
                order: 1,
                quickLinks: [mockQuickLink]
              };

              vmQuickLinkCategories$.next([mockQuickLinkCategory]);
              fixture.detectChanges();
            });

            it('should show the alternativeOpenActions as links', () => {
              const listItemLinks = fixture.debugElement
                .query(By.directive(MatListItem))
                .queryAll(By.css('a'));

              expect(listItemLinks.length).toBe(1);
              expect(listItemLinks[0].nativeElement.textContent.trim()).toBe(
                'Downloaden'
              );
            });

            it('should call the correct action handler on element click', fakeAsync(() => {
              const listItem = fixture.debugElement.query(
                By.directive(MatListItem)
              );

              const listItemLinks = listItem.queryAll(By.css('a'));

              // default action
              spyOn(component, 'openEduContentAsStream');
              listItem.triggerEventHandler('click', null);
              expect(component.openEduContentAsStream).toHaveBeenCalled();

              // alternative open action
              spyOn(component, 'openEduContentAsDownload');
              listItemLinks[0].triggerEventHandler('click', null);
              expect(component.openEduContentAsDownload).toHaveBeenCalled();
            }));
          });

          describe('educontent is not streamable', () => {
            beforeEach(() => {
              const mockQuickLink = addActions(
                new FavoriteFixture({
                  name: 'foo',
                  learningArea: new LearningAreaFixture(),
                  type: FavoriteTypesEnum.EDUCONTENT,
                  eduContent: new EduContentFixture(
                    { type: 'not an exercise' },
                    new EduContentMetadataFixture({ streamable: false })
                  )
                }),
                { handler: 'openEduContentAsDownload', label: 'Downloaden' }
              );

              const mockQuickLinkCategory: QuickLinkCategoryInterface = {
                title: 'foo',
                type: mockQuickLink.type,
                order: 1,
                quickLinks: [mockQuickLink]
              };

              vmQuickLinkCategories$.next([mockQuickLinkCategory]);
              fixture.detectChanges();
            });

            it('should not show the alternativeOpenActions as links', () => {
              const listItemLinks = fixture.debugElement
                .query(By.directive(MatListItem))
                .queryAll(By.css('a'));

              expect(listItemLinks.length).toBe(0);
            });

            it('should call the correct action handler on element click', fakeAsync(() => {
              const listItem = fixture.debugElement.query(
                By.directive(MatListItem)
              );

              // default action
              spyOn(component, 'openEduContentAsDownload');
              listItem.triggerEventHandler('click', null);
              expect(component.openEduContentAsDownload).toHaveBeenCalled();
            }));
          });
        });
      });

      describe('manage actions', () => {
        it('should show the manageActions as buttons', () => {
          const listItemButtons = fixture.debugElement
            .query(By.directive(MatListItem))
            .queryAll(By.directive(ButtonComponent))
            .map(dE => dE.componentInstance as ButtonComponent);

          expect(listItemButtons.length).toBe(3);
          expect(listItemButtons[0].iconClass).toBe('edit');
          expect(listItemButtons[1].iconClass).toBe('delete');
          // context menu button is hidden with css on desktop
          expect(listItemButtons[2].iconClass).toBe('context_menu');
        });

        it('should call the correct action handler on element click', fakeAsync(() => {
          const listItem = fixture.debugElement.query(
            By.directive(MatListItem)
          );

          const listItemButtons = listItem.queryAll(
            By.directive(ButtonComponent)
          );

          // enableEditing
          spyOn(component, 'enableEditing');
          listItemButtons[0].triggerEventHandler('click', null);
          expect(component.enableEditing).toHaveBeenCalled();

          // remove
          spyOn(component, 'remove');
          listItemButtons[1].triggerEventHandler('click', null);
          expect(component.remove).toHaveBeenCalled();
        }));
      });
    });

    describe('error feedback', () => {
      it('should not show the banner when there is no error feedback', () => {
        // clear errors
        vmFeedback$.next(null);
        fixture.detectChanges();

        const banner = fixture.debugElement.query(
          By.directive(BannerComponent)
        );
        expect(banner).toBeFalsy();
      });

      it('should show the banner when there is error feedback', () => {
        const mockErrorFeedback = new EffectFeedbackFixture({
          type: 'error',
          priority: Priority.HIGH
        });
        vmFeedback$.next(mockErrorFeedback);
        fixture.detectChanges();

        const banner = fixture.debugElement.query(
          By.directive(BannerComponent)
        );
        expect(banner).toBeTruthy();
      });
    });
  });

  describe('filtering', () => {
    let filterService: FilterServiceInterface;
    let mockQuickLinks: QuickLinkInterface[];
    beforeEach(() => {
      filterService = TestBed.get(FILTER_SERVICE_TOKEN);

      mockQuickLinks = [
        addActions(
          new FavoriteFixture({
            name: 'foo',
            type: FavoriteTypesEnum.BOEKE
          })
        ),
        addActions(
          new FavoriteFixture({
            name: 'bar',
            type: FavoriteTypesEnum.EDUCONTENT,
            eduContent: new EduContentFixture()
          })
        )
      ];

      const mockQuickLinkCategory1: QuickLinkCategoryInterface = {
        title: 'foo',
        type: mockQuickLinks[0].type,
        order: 1,
        quickLinks: [mockQuickLinks[0]]
      };

      const mockQuickLinkCategory2: QuickLinkCategoryInterface = {
        title: 'bar',
        type: mockQuickLinks[1].type,
        order: 2,
        quickLinks: [mockQuickLinks[1]]
      };

      vmQuickLinkCategories$.next([
        mockQuickLinkCategory1,
        mockQuickLinkCategory2
      ]);
      fixture.detectChanges();
    });

    it('should filter the items', () => {
      const filterText = fixture.debugElement.query(
        By.directive(FilterTextInputComponent)
      );

      component.quickLinkCategories$.subscribe(quickLinks => {
        const returnedItem = mockQuickLinks[0];

        filterService.filter = jest.fn().mockReturnValue([returnedItem]);
        filterText.componentInstance.setValue("text here doesn't matter");

        fixture.detectChanges();

        const linkItems = fixture.debugElement.queryAll(
          By.css('.quick-link__item__title')
        );

        expect(linkItems.length).toBe(1);
        expect(linkItems[0].nativeElement.textContent.trim()).toBe(
          returnedItem.name
        );
      });
    });

    it('should display a no results message when no items are found', () => {
      const filterText = fixture.debugElement.query(
        By.directive(FilterTextInputComponent)
      );

      filterService.filter = jest.fn().mockReturnValue([]);
      filterText.componentInstance.setValue("text here doesn't matter");
      fixture.detectChanges();

      const linkItems = fixture.debugElement.queryAll(
        By.css('.quick-link__item__title')
      );

      const noResultsMessage = fixture.debugElement.query(
        By.css('.quick-link__no-results')
      );

      expect(linkItems.length).toBe(0);
      expect(noResultsMessage).toBeTruthy();
    });

    it('should reset the filter when clicking the reset link in the no results message', () => {
      spyOn(component.filterTextInput, 'clear').and.callThrough();

      const filterText = fixture.debugElement.query(
        By.directive(FilterTextInputComponent)
      );

      filterService.filter = jest.fn().mockReturnValue([]);
      filterText.componentInstance.setValue("item that doesn't exist");
      fixture.detectChanges();

      let linkItems = fixture.debugElement.queryAll(
        By.css('.quick-link__item__title')
      );

      expect(linkItems.length).toBe(0);

      fixture.debugElement
        .query(By.css('.quick-link__no-results a'))
        .nativeElement.click();

      fixture.detectChanges();

      linkItems = fixture.debugElement.queryAll(
        By.css('.quick-link__item__title')
      );

      expect(linkItems.length).not.toBe(0);
      expect(component.filterTextInput.clear).toHaveBeenCalled();
    });
  });

  describe('data and streams', () => {
    describe('data', () => {
      it('should inject the mode-data', () => {
        // mocked data is regular string, not an enum
        expect(component.data).toEqual(mockInjectedData as any);
      });
    });

    describe('quickLinkCategories$', () => {
      describe('sorting', () => {
        it('should sort the favorite quicklink categories', () => {
          component.data.mode = QuickLinkTypeEnum.FAVORITES;
          const mockCategories: QuickLinkCategoryInterface[] = [
            {
              order: 5,
              type: '',
              title: '0',
              quickLinks: []
            },
            {
              order: 1,
              type: '',
              title: '1',
              quickLinks: []
            },
            {
              order: -1,
              type: '',
              title: '2',
              quickLinks: []
            },
            {
              order: 2,
              type: '',
              title: '3',
              quickLinks: []
            },
            {
              order: 3,
              type: '',
              title: '4',
              quickLinks: []
            }
          ];

          vmQuickLinkCategories$.next([...mockCategories]);
          fixture.detectChanges();

          const expected = [
            mockCategories[1],
            mockCategories[3],
            mockCategories[4],
            mockCategories[0],
            mockCategories[2]
          ];

          expect(component.filterTextInput.result$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should sort the history quicklink categories', () => {
          component.data.mode = QuickLinkTypeEnum.HISTORY;
          const mockCategories: QuickLinkCategoryInterface[] = [
            {
              order: 5,
              type: '',
              title: '0',
              quickLinks: [
                {
                  created: new Date(3000),
                  learningArea: {},
                  defaultAction: {}
                } as QuickLinkInterface
              ]
            },
            {
              order: 1,
              type: '',
              title: '1',
              quickLinks: [
                {
                  created: new Date(2000),
                  learningArea: {},
                  defaultAction: {}
                } as QuickLinkInterface
              ]
            },
            {
              order: -1,
              type: '',
              title: '2',
              quickLinks: [
                {
                  created: new Date(1000),
                  learningArea: {},
                  defaultAction: {}
                } as QuickLinkInterface
              ]
            },
            {
              order: 2,
              type: '',
              title: '3',
              quickLinks: [
                {
                  created: new Date(4000),
                  learningArea: {},
                  defaultAction: {}
                } as QuickLinkInterface
              ]
            },
            {
              order: 3,
              type: '',
              title: '4',
              quickLinks: [
                {
                  created: new Date(5000),
                  learningArea: {},
                  defaultAction: {}
                } as QuickLinkInterface
              ]
            }
          ];

          vmQuickLinkCategories$.next([...mockCategories]);
          fixture.detectChanges();

          const expected = [
            mockCategories[4],
            mockCategories[3],
            mockCategories[0],
            mockCategories[1],
            mockCategories[2]
          ];

          expect(component.filterTextInput.result$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });
    });

    describe('feedback$', () => {
      it('should get the feedback data from the quickLinkViewmodel', () => {
        expect(component.feedback$).toBe(quickLinkViewModel.getFeedback$());
      });
    });
  });

  describe('manageActions implementation', () => {
    describe('update', () => {
      it('should activate the right ContentEditable when clicking update', () => {
        const firstListItem = fixture.debugElement.query(
          By.directive(MatListItem)
        );

        const updateButton = firstListItem.query(By.directive(ButtonComponent));

        const contentEditable = firstListItem.query(
          By.directive(ContentEditableComponent)
        );

        expect(contentEditable.componentInstance.active).toBe(false);

        updateButton.nativeElement.click();

        expect(contentEditable.componentInstance.active).toBe(true);
      });

      it('should deactivate the previously activated ContentEditable when clicking update', () => {
        const updateButtons = fixture.debugElement
          .queryAll(By.directive(MatListItem))
          .map(listItem => listItem.query(By.directive(ButtonComponent)));

        const contentEditables = fixture.debugElement
          .queryAll(By.directive(MatListItem))
          .map(listItem =>
            listItem.query(By.directive(ContentEditableComponent))
          );

        updateButtons[0].nativeElement.click();

        expect(contentEditables[0].componentInstance.active).toBe(true);

        updateButtons[1].nativeElement.click();

        expect(contentEditables[0].componentInstance.active).toBe(false);
        expect(contentEditables[1].componentInstance.active).toBe(true);
      });

      it('should call rename when a change is committed in the ContentEditable', () => {
        const updateButton = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.directive(ButtonComponent));

        const contentEditable = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.directive(ContentEditableComponent));

        const newText = 'brown cow';

        spyOn(component, 'update');

        updateButton.nativeElement.click();
        contentEditable.componentInstance.textChanged.emit(newText);

        expect(component.update).toHaveBeenCalled();
        expect(component.update).toHaveBeenCalledWith(
          contentEditable.componentInstance.relatedItem,
          newText
        );
      });
    });
  });

  describe('event handlers', () => {
    it('openEduContentAsExercise should call the correct method on the viewmodel and not close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openExercise = jest.fn();
      component.closeDialog = jest.fn();

      component.openEduContentAsExercise(mockQuickLink);

      expect(quickLinkViewModel.openExercise).toHaveBeenCalled();
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledWith(
        mockQuickLink.eduContent
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
    });

    it('openEduContentAsSolution should call the correct method on the viewmodel and not close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openExercise = jest.fn();
      component.closeDialog = jest.fn();

      component.openEduContentAsSolution(mockQuickLink);

      expect(quickLinkViewModel.openExercise).toHaveBeenCalled();
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledWith(
        mockQuickLink.eduContent,
        true
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
    });

    it('openEduContentAsStream should call the correct method on the viewmodel and close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openStaticContent = jest.fn();
      component.closeDialog = jest.fn();

      component.openEduContentAsStream(mockQuickLink);

      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalled();
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledWith(
        mockQuickLink.eduContent,
        true
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('openEduContentAsDownload should call the correct method on the viewmodel and not close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openStaticContent = jest.fn();
      component.closeDialog = jest.fn();

      component.openEduContentAsDownload(mockQuickLink);

      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalled();
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledWith(
        mockQuickLink.eduContent
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
    });

    it('openBundle should call the correct method on the viewmodel and close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        bundle: new BundleFixture()
      }) as any;

      quickLinkViewModel.openBundle = jest.fn();
      component.closeDialog = jest.fn();

      component.openBundle(mockQuickLink);

      expect(quickLinkViewModel.openBundle).toHaveBeenCalled();
      expect(quickLinkViewModel.openBundle).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openBundle).toHaveBeenCalledWith(
        mockQuickLink.bundle
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('openTask should call the correct method on the viewmodel and close the dialog', () => {
      const mockQuickLink = {
        ...new FavoriteFixture(),
        task: new TaskFixture(),
        defaultAction: null,
        alternativeOpenActions: [],
        manageActions: []
      };

      quickLinkViewModel.openTask = jest.fn();
      component.closeDialog = jest.fn();

      component.openTask(mockQuickLink);

      expect(quickLinkViewModel.openTask).toHaveBeenCalled();
      expect(quickLinkViewModel.openTask).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openTask).toHaveBeenCalledWith(
        mockQuickLink.task
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('openArea should call the correct method on the viewmodel and close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        learningArea: new LearningAreaFixture()
      }) as any;

      quickLinkViewModel.openArea = jest.fn();
      component.closeDialog = jest.fn();

      component.openArea(mockQuickLink);

      expect(quickLinkViewModel.openArea).toHaveBeenCalled();
      expect(quickLinkViewModel.openArea).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openArea).toHaveBeenCalledWith(
        mockQuickLink.learningArea
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('openSearch should call the correct method on the viewmodel and close the dialog', () => {
      const mockQuickLink = new FavoriteFixture() as any;

      quickLinkViewModel.openSearch = jest.fn();
      component.closeDialog = jest.fn();

      component.openSearch(mockQuickLink);

      expect(quickLinkViewModel.openSearch).toHaveBeenCalled();
      expect(quickLinkViewModel.openSearch).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openSearch).toHaveBeenCalledWith(
        mockQuickLink,
        mockInjectedData.mode
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('openBoeke should call the correct method on the viewmodel and not close the dialog', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openStaticContent = jest.fn();
      component.closeDialog = jest.fn();

      component.openBoeke(mockQuickLink);

      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalled();
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledWith(
        mockQuickLink.eduContent
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
    });

    it('update should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture() as any;

      quickLinkViewModel.update = jest.fn();

      const newName = 'brown cow';
      component.update(mockQuickLink, newName);

      expect(quickLinkViewModel.update).toHaveBeenCalled();
      expect(quickLinkViewModel.update).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.update).toHaveBeenCalledWith(
        mockQuickLink.id,
        newName,
        mockInjectedData.mode
      );
    });

    it('remove should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture() as any;

      quickLinkViewModel.remove = jest.fn();

      component.remove(mockQuickLink);

      expect(quickLinkViewModel.remove).toHaveBeenCalled();
      expect(quickLinkViewModel.remove).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.remove).toHaveBeenCalledWith(
        mockQuickLink.id,
        mockInjectedData.mode
      );
    });
    it('onBannerDismiss should call the correct method on the viewmodel', () => {
      const spy = jest.spyOn(quickLinkViewModel, 'onFeedbackDismiss');
      const mockEvent = { action: 'foo', feedbackId: 'bar' };
      component.onBannerDismiss(mockEvent);
      expect(spy).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('dialog functionality', () => {
    it('should set the selection list as scrollable content', () => {
      // just testing if the list is inside a <mat-dialog-content>
      // the rest should be handled by Material's unit tests
      const dialogContent = fixture.debugElement.query(
        By.css('mat-dialog-content')
      );
      const selectionList = fixture.debugElement.query(By.directive(MatList));
      expect(selectionList.parent).toBe(dialogContent);
    });
    it('should include a close button', () => {
      // just testing if MatDialogRef.close() is called
      // the rest should be handled by Material's unit tests
      const dialogRef = TestBed.get(MatDialogRef);
      dialogRef.close = jest.fn();

      const button = fixture.debugElement
        .query(By.directive(MatDialogActions))
        .query(By.directive(ButtonComponent));
      button.triggerEventHandler('click', null);

      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});

function addActions(
  fixture: FavoriteInterface | HistoryInterface,
  defaultAction: Partial<QuickLinkActionInterface> = { handler: '' },
  alternativeOpenActions: Partial<QuickLinkActionInterface>[] = [],
  manageActions: Partial<QuickLinkActionInterface>[] = [
    { handler: 'edit' },
    { handler: 'remove' }
  ]
): QuickLinkInterface {
  const emptyAction = {
    actionType: 'open',
    label: 'foo label',
    icon: 'foo icon',
    tooltip: 'foo tooltip',
    handler: 'foo handler'
  };

  return {
    ...fixture,
    eduContent: Object.assign(new EduContent(), fixture.eduContent),
    defaultAction: Object.assign({ ...emptyAction }, defaultAction),
    alternativeOpenActions: alternativeOpenActions.map(aOA =>
      Object.assign({ ...emptyAction }, aOA)
    ),
    manageActions: manageActions.map(mA =>
      Object.assign({ ...emptyAction }, mA)
    )
  };
}
