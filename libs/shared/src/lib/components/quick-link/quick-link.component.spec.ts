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
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import { QuickLinkComponent } from './quick-link.component';
import { QuickLinkViewModel } from './quick-link.viewmodel';
import { MockQuickLinkViewModel } from './quick-link.viewmodel.mock';

describe('QuickLinkComponent', () => {
  let component: QuickLinkComponent;
  let fixture: ComponentFixture<QuickLinkComponent>;
  let quickLinkViewModel: QuickLinkViewModel;
  let vmQuickLinks$: BehaviorSubject<FavoriteInterface[] | HistoryInterface[]>;
  let vmFeedback$: BehaviorSubject<EffectFeedbackInterface>;
  let dateMock: MockDate;
  const mockInjectedData = { mode: 'foo' };

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

  beforeAll(() => {
    dateMock = new MockDate();
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickLinkComponent);
    component = fixture.componentInstance;

    // provided on component level
    quickLinkViewModel = component['quickLinkViewModel'];

    // in the mockViewmodel this is a BehaviorSubject
    // in the mockViewmodel the mode parameter isn't used
    vmQuickLinks$ = quickLinkViewModel.getQuickLinks$(null) as BehaviorSubject<
      FavoriteInterface[] | HistoryInterface[]
    >;
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
        const quickLinks = vmQuickLinks$.value;

        const listItems = fixture.debugElement.queryAll(
          By.directive(MatListItem)
        );
        const listItemTitles = listItems.map(
          listItem =>
            listItem.query(By.css('.quick-link__item__title')).nativeElement
              .textContent
        );

        expect(listItems.length).toBe(quickLinks.length);
        // every quickLink should have a listItem with the same name
        // mock data contains quicklinks with unique names
        expect(
          quickLinks.every(qL =>
            listItemTitles.some(title => title === qL.name)
          )
        );
      });

      it('should show the unique quicklink categories as headers in the list', () => {
        const headers = Array.from(
          new Set(vmQuickLinks$.value.map(qL => qL.type))
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
        const mockQuickLink = new FavoriteFixture({
          learningArea: new LearningAreaFixture({ icon: 'foo' })
        }) as FavoriteInterface;

        vmQuickLinks$.next([mockQuickLink]);
        fixture.detectChanges();

        const listItemIcon = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.directive(MatIcon)).componentInstance as MatIcon;

        expect(listItemIcon.svgIcon).toBe(mockQuickLink.learningArea.icon);
      });

      it('should show quickLink name', () => {
        const mockQuickLink = new FavoriteFixture({
          name: 'foo',
          learningArea: new LearningAreaFixture()
        }) as FavoriteInterface;

        vmQuickLinks$.next([mockQuickLink]);
        fixture.detectChanges();

        const listItemName = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.css('.quick-link__item__title')).nativeElement.textContent;

        expect(listItemName).toBe(mockQuickLink.name);
      });

      describe('open actions', () => {
        describe('type: area', () => {
          beforeEach(() => {
            const mockQuickLink = new FavoriteFixture({
              name: 'foo',
              learningArea: new LearningAreaFixture(),
              type: FavoriteTypesEnum.AREA
            }) as FavoriteInterface;

            vmQuickLinks$.next([mockQuickLink]);
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
            spyOn(component, 'openArea');
            listItem.triggerEventHandler('click', null);
            expect(component.openArea).toHaveBeenCalled();
          }));
        });

        describe('type: bundle', () => {
          beforeEach(() => {
            const mockQuickLink = new FavoriteFixture({
              name: 'foo',
              learningArea: new LearningAreaFixture(),
              type: FavoriteTypesEnum.BUNDLE
            }) as FavoriteInterface;

            vmQuickLinks$.next([mockQuickLink]);
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
            const mockQuickLink = new FavoriteFixture({
              name: 'foo',
              learningArea: new LearningAreaFixture(),
              type: FavoriteTypesEnum.TASK
            }) as FavoriteInterface;

            vmQuickLinks$.next([mockQuickLink]);
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
            const mockQuickLink = new FavoriteFixture({
              name: 'foo',
              learningArea: new LearningAreaFixture(),
              type: FavoriteTypesEnum.BOEKE
            }) as FavoriteInterface;

            vmQuickLinks$.next([mockQuickLink]);
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
            const mockQuickLink = new FavoriteFixture({
              name: 'foo',
              learningArea: new LearningAreaFixture(),
              type: FavoriteTypesEnum.SEARCH
            }) as FavoriteInterface;

            vmQuickLinks$.next([mockQuickLink]);
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
            spyOn(component, 'openSearch');
            listItem.triggerEventHandler('click', null);
            expect(component.openSearch).toHaveBeenCalled();
          }));
        });

        describe('type: educontent - exercise', () => {
          beforeEach(() => {
            const mockQuickLink = new FavoriteFixture({
              name: 'foo',
              learningArea: new LearningAreaFixture(),
              type: FavoriteTypesEnum.EDUCONTENT,
              eduContent: new EduContentFixture({ contentType: 'exercise' })
            }) as FavoriteInterface;

            vmQuickLinks$.next([mockQuickLink]);
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
              const mockQuickLink = new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.EDUCONTENT,
                eduContent: new EduContentFixture(
                  { contentType: 'not an exercise' },
                  new EduContentMetadataFixture({ streamable: true })
                )
              }) as FavoriteInterface;

              vmQuickLinks$.next([mockQuickLink]);
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
              const mockQuickLink = new FavoriteFixture({
                name: 'foo',
                learningArea: new LearningAreaFixture(),
                type: FavoriteTypesEnum.EDUCONTENT,
                eduContent: new EduContentFixture(
                  { contentType: 'not an exercise' },
                  new EduContentMetadataFixture({ streamable: false })
                )
              }) as FavoriteInterface;

              vmQuickLinks$.next([mockQuickLink]);
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
    beforeEach(() => {
      filterService = TestBed.get(FILTER_SERVICE_TOKEN);

      const mockQuickLinks = [
        new FavoriteFixture({
          name: 'foo',
          type: FavoriteTypesEnum.BOEKE
        }),
        new FavoriteFixture({
          name: 'bar',
          type: FavoriteTypesEnum.EDUCONTENT,
          eduContent: new EduContentFixture()
        })
      ];

      vmQuickLinks$.next(mockQuickLinks);
      fixture.detectChanges();
    });

    it('should filter the items', () => {
      const filterText = fixture.debugElement.query(
        By.directive(FilterTextInputComponent)
      );

      component.contentData$.subscribe(quickLinks => {
        const returnedItem = quickLinks[0];

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

    describe('contentData$', () => {
      describe('grouping and sorting', () => {
        it('should group the quicklinks in categories, by type', () => {
          const mockFavorites = [
            new FavoriteFixture({
              type: 'boek-e'
            }),
            new FavoriteFixture({
              type: 'boek-e'
            }),
            new FavoriteFixture({
              type: 'task'
            }),
            new FavoriteFixture({
              type: 'bundle'
            })
          ];

          vmQuickLinks$.next(mockFavorites);
          fixture.detectChanges();

          // doesn't test array order
          const expected = jasmine.arrayContaining([
            {
              type: 'boek-e',
              title: 'Bordboeken',
              quickLinks: [
                // ignore missing properties
                jasmine.objectContaining({ ...mockFavorites[0] }),
                jasmine.objectContaining({ ...mockFavorites[1] })
              ]
            },
            {
              type: 'task',
              title: 'Taken',
              quickLinks: [jasmine.objectContaining({ ...mockFavorites[2] })]
            },
            {
              type: 'bundle',
              title: 'Bundels',
              quickLinks: [jasmine.objectContaining({ ...mockFavorites[3] })]
            }
          ]);

          expect(component.filterTextInput.result$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should sort the quicklink categories and use a readable name', () => {
          const mockFavorites = [
            new FavoriteFixture({ type: FavoriteTypesEnum.TASK }),
            new FavoriteFixture({ type: 'type not in list' }),
            new FavoriteFixture({
              type: FavoriteTypesEnum.BOEKE,
              eduContent: Object.assign(
                new EduContent(),
                new EduContentFixture()
              )
            }),
            new FavoriteFixture({ type: FavoriteTypesEnum.SEARCH }),
            new FavoriteFixture({
              type: FavoriteTypesEnum.EDUCONTENT,
              eduContent: Object.assign(
                new EduContent(),
                new EduContentFixture()
              )
            }),
            new FavoriteFixture({ type: FavoriteTypesEnum.BUNDLE })
          ];

          vmQuickLinks$.next(mockFavorites);
          fixture.detectChanges();

          // only test category order + title
          const expected = [
            jasmine.objectContaining({
              type: FavoriteTypesEnum.BOEKE,
              title: 'Bordboeken'
            }),
            jasmine.objectContaining({
              type: FavoriteTypesEnum.EDUCONTENT,
              title: 'Lesmateriaal'
            }),
            jasmine.objectContaining({
              type: FavoriteTypesEnum.SEARCH,
              title: 'Zoekopdrachten'
            }),
            jasmine.objectContaining({
              type: FavoriteTypesEnum.BUNDLE,
              title: 'Bundels'
            }),
            jasmine.objectContaining({
              type: FavoriteTypesEnum.TASK,
              title: 'Taken'
            }),
            jasmine.objectContaining({
              type: 'type not in list',
              title: 'type not in list'
            })
          ];

          expect(component.filterTextInput.result$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should sort the quicklinks [per category] on created date, descending', () => {
          const mockFavorites = [
            new FavoriteFixture({
              id: 1,
              type: 'boek-e',
              created: new Date(1)
            }),
            new FavoriteFixture({
              id: 2,
              type: 'boek-e',
              created: new Date(4)
            }),
            new FavoriteFixture({
              id: 3,
              type: 'boek-e',
              created: new Date(2)
            }),
            new FavoriteFixture({ id: 4, type: 'boek-e', created: new Date(3) })
          ];

          vmQuickLinks$.next(mockFavorites);
          fixture.detectChanges();

          // only need quickLinks, only 1 category
          const quickLinks$ = component.filterTextInput.result$.pipe(
            map(cD => cD[0].quickLinks)
          );

          // only test quickLink order
          const expected = [
            jasmine.objectContaining(mockFavorites[1]),
            jasmine.objectContaining(mockFavorites[3]),
            jasmine.objectContaining(mockFavorites[2]),
            jasmine.objectContaining(mockFavorites[0])
          ];

          expect(quickLinks$).toBeObservable(hot('a', { a: expected }));
        });
      });

      describe('actions on a quickLink', () => {
        let quickLinkActions;
        let quickLink$;

        beforeEach(() => {
          // replace functions that should be added as handlers with mocks
          // tests need same instance reference
          // there are other tests to check if clicks call the correct handler
          quickLinkActions = component['quickLinkActions'];
        });

        describe('open actions', () => {
          describe('type: area', () => {
            const mockOpenAreaFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.AREA
            });

            beforeEach(() => {
              quickLinkActions.openArea.handler = mockOpenAreaFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'lesmateriaal',
                tooltip: 'Navigeer naar de leergebied pagina',
                handler: mockOpenAreaFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: bundle', () => {
            const mockOpenBundleFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.BUNDLE
            });

            beforeEach(() => {
              quickLinkActions.openBundle.handler = mockOpenBundleFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'bundle',
                tooltip: 'Navigeer naar de bundel pagina',
                handler: mockOpenBundleFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: task', () => {
            const mockOpenTaskFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.TASK
            });

            beforeEach(() => {
              quickLinkActions.openTask.handler = mockOpenTaskFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'task',
                tooltip: 'Navigeer naar de taken pagina',
                handler: mockOpenTaskFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: boeke-e', () => {
            const mockOpenBoekeFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.BOEKE
            });

            beforeEach(() => {
              quickLinkActions.openBoeke.handler = mockOpenBoekeFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'boeken',
                tooltip: 'Open het bordboek',
                handler: mockOpenBoekeFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: search', () => {
            const mockOpenSearchFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.SEARCH
            });

            beforeEach(() => {
              quickLinkActions.openSearch.handler = mockOpenSearchFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'magnifier',
                tooltip: 'Open de zoekopdracht',
                handler: mockOpenSearchFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: eduContent - exercise', () => {
            const mockOpenEduContentAsExerciseFunction = () => {};
            const mockOpenEduContentAsSolutionFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.EDUCONTENT,
              eduContent: new EduContentFixture({ contentType: 'exercise' })
            });

            beforeEach(() => {
              quickLinkActions.openEduContentAsExercise.handler = mockOpenEduContentAsExerciseFunction;
              quickLinkActions.openEduContentAsSolution.handler = mockOpenEduContentAsSolutionFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'exercise:open',
                tooltip: 'Open oefening zonder oplossingen',
                handler: mockOpenEduContentAsExerciseFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [
                {
                  actionType: 'open',
                  label: 'Toon oplossing',
                  icon: 'exercise:finished',
                  tooltip: 'Open oefening met oplossingen',
                  handler: mockOpenEduContentAsSolutionFunction
                }
              ];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: eduContent - not an exercise', () => {
            const mockOpenEduContentAsStreamFunction = () => {};
            const mockOpenEduContentAsDownloadFunction = () => {};
            let mockFavorite: FavoriteInterface;

            beforeEach(() => {
              quickLinkActions.openEduContentAsStream.handler = mockOpenEduContentAsStreamFunction;
              quickLinkActions.openEduContentAsDownload.handler = mockOpenEduContentAsDownloadFunction;
            });

            describe('educContent is streamable', () => {
              beforeEach(() => {
                mockFavorite = new FavoriteFixture({
                  type: FavoriteTypesEnum.EDUCONTENT,
                  eduContent: new EduContentFixture(
                    {
                      contentType: 'not an exercise'
                    },
                    new EduContentMetadataFixture({ streamable: true })
                  )
                });

                vmQuickLinks$.next([mockFavorite]);
                fixture.detectChanges();

                // only 1 category with 1 quickLink
                quickLink$ = component.filterTextInput.result$.pipe(
                  map(cD => cD[0].quickLinks[0])
                );
              });

              it('should add a defaultAction', () => {
                const expectedDefaultAction = {
                  actionType: 'open',
                  label: 'Openen',
                  icon: 'lesmateriaal',
                  tooltip: 'Open het lesmateriaal',
                  handler: mockOpenEduContentAsStreamFunction
                };

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  defaultAction: expectedDefaultAction
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });

              it('should add alternativeOpenActions', () => {
                const expectedAlternativeOpenActions = [
                  {
                    actionType: 'open',
                    label: 'Downloaden',
                    icon: 'download',
                    tooltip: 'Download het lesmateriaal',
                    handler: mockOpenEduContentAsDownloadFunction
                  }
                ];

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  alternativeOpenActions: expectedAlternativeOpenActions
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });
            });

            describe('educContent is not streamable', () => {
              beforeEach(() => {
                mockFavorite = new FavoriteFixture({
                  type: FavoriteTypesEnum.EDUCONTENT,
                  eduContent: new EduContentFixture(
                    {
                      contentType: 'not an exercise'
                    },
                    new EduContentMetadataFixture({ streamable: false })
                  )
                });

                vmQuickLinks$.next([mockFavorite]);
                fixture.detectChanges();

                // only 1 category with 1 quickLink
                quickLink$ = component.filterTextInput.result$.pipe(
                  map(cD => cD[0].quickLinks[0])
                );
              });

              it('should add a defaultAction', () => {
                const expectedDefaultAction = {
                  actionType: 'open',
                  label: 'Downloaden',
                  icon: 'download',
                  tooltip: 'Download het lesmateriaal',
                  handler: mockOpenEduContentAsDownloadFunction
                };

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  defaultAction: expectedDefaultAction
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });

              it('should not add alternativeOpenActions', () => {
                const expectedAlternativeOpenActions = [];

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  alternativeOpenActions: expectedAlternativeOpenActions
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });
            });
          });
        });

        describe('manage actions', () => {
          const mockUpdateFunction = () => {};
          const mockRemoveFunction = () => {};
          let mockFavorite;

          beforeEach(() => {
            // replace functions that should be added as handlers with mocks
            // tests need same instance reference
            // there are other tests to check if clicks call the correct handler
            quickLinkActions.edit.handler = mockUpdateFunction;
            quickLinkActions.remove.handler = mockRemoveFunction;

            mockFavorite = new FavoriteFixture({ type: 'task' });
            vmQuickLinks$.next([mockFavorite]);
            fixture.detectChanges();

            // only 1 category with 1 quickLink
            quickLink$ = component.filterTextInput.result$.pipe(
              map(cD => cD[0].quickLinks[0])
            );
          });

          it('should add manageActions', () => {
            const expectedManageActions = [
              {
                actionType: 'manage',
                label: 'Bewerken',
                icon: 'edit',
                tooltip: 'Pas de naam van het item aan',
                handler: mockUpdateFunction
              },
              {
                actionType: 'manage',
                label: 'Verwijderen',
                icon: 'delete',
                tooltip: 'Verwijder het item',
                handler: mockRemoveFunction
              }
            ];

            const expected = jasmine.objectContaining({
              ...mockFavorite,
              manageActions: expectedManageActions
            });

            expect(quickLink$).toBeObservable(hot('a', { a: expected }));
          });
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
    it('openEduContentAsExercise should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openExercise = jest.fn();

      component.openEduContentAsExercise(mockQuickLink);

      expect(quickLinkViewModel.openExercise).toHaveBeenCalled();
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledWith(
        mockQuickLink.eduContent
      );
    });

    it('openEduContentAsSolution should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openExercise = jest.fn();

      component.openEduContentAsSolution(mockQuickLink);

      expect(quickLinkViewModel.openExercise).toHaveBeenCalled();
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openExercise).toHaveBeenCalledWith(
        mockQuickLink.eduContent,
        true
      );
    });

    it('openEduContentAsStream should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openStaticContent = jest.fn();

      component.openEduContentAsStream(mockQuickLink);

      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalled();
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledWith(
        mockQuickLink.eduContent,
        true
      );
    });

    it('openEduContentAsDownload should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openStaticContent = jest.fn();

      component.openEduContentAsDownload(mockQuickLink);

      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalled();
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledWith(
        mockQuickLink.eduContent
      );
    });

    it('openBundle should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        bundle: new BundleFixture()
      }) as any;

      quickLinkViewModel.openBundle = jest.fn();

      component.openBundle(mockQuickLink);

      expect(quickLinkViewModel.openBundle).toHaveBeenCalled();
      expect(quickLinkViewModel.openBundle).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openBundle).toHaveBeenCalledWith(
        mockQuickLink.bundle
      );
    });

    it('openTask should call the correct method on the viewmodel', () => {
      const mockQuickLink = {
        ...new FavoriteFixture(),
        task: new TaskFixture(),
        defaultAction: null,
        alternativeOpenActions: [],
        manageActions: []
      };

      quickLinkViewModel.openTask = jest.fn();

      component.openTask(mockQuickLink);

      expect(quickLinkViewModel.openTask).toHaveBeenCalled();
      expect(quickLinkViewModel.openTask).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openTask).toHaveBeenCalledWith(
        mockQuickLink.task
      );
    });

    it('openArea should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        learningArea: new LearningAreaFixture()
      }) as any;

      quickLinkViewModel.openArea = jest.fn();

      component.openArea(mockQuickLink);

      expect(quickLinkViewModel.openArea).toHaveBeenCalled();
      expect(quickLinkViewModel.openArea).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openArea).toHaveBeenCalledWith(
        mockQuickLink.learningArea
      );
    });

    it('openSearch should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture() as any;

      quickLinkViewModel.openSearch = jest.fn();

      component.openSearch(mockQuickLink);

      expect(quickLinkViewModel.openSearch).toHaveBeenCalled();
      expect(quickLinkViewModel.openSearch).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openSearch).toHaveBeenCalledWith(
        mockQuickLink,
        mockInjectedData.mode
      );
    });

    it('openBoeke should call the correct method on the viewmodel', () => {
      const mockQuickLink = new FavoriteFixture({
        eduContent: new EduContentFixture()
      }) as any;

      quickLinkViewModel.openStaticContent = jest.fn();

      component.openBoeke(mockQuickLink);

      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalled();
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledTimes(1);
      expect(quickLinkViewModel.openStaticContent).toHaveBeenCalledWith(
        mockQuickLink.eduContent
      );
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
