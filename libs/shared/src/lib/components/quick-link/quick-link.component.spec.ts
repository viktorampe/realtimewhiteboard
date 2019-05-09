//file.only
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
  MatIconModule,
  MatIconRegistry,
  MatList,
  MatListItem,
  MatListModule,
  MatListSubheaderCssMatStyler,
  MatTooltipModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FavoriteFixture,
  FavoriteInterface,
  HistoryInterface
} from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { ButtonComponent, InfoPanelComponent, UiModule } from '@campus/ui';
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

  const mockInjectedData = { mode: 'foo' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        MatIconModule,
        MatTooltipModule,
        MatListModule,
        MatDialogModule,
        RouterTestingModule
      ],
      declarations: [QuickLinkComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockInjectedData },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    })
      .overrideComponent(QuickLinkComponent, {
        set: {
          providers: [
            { provide: QuickLinkViewModel, useClass: MockQuickLinkViewModel }
          ]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // provided on component level
    quickLinkViewModel = component['quickLinkViewModel'];

    // in the mockViewmodel this is a BehaviorSubject
    vmQuickLinks$ = quickLinkViewModel.quickLinks$ as BehaviorSubject<
      FavoriteInterface[] | HistoryInterface[]
    >;
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
      it('should show the learning area icon', () => {});
      it('should show quickLink name', () => {});
      it('should show the alternativeOpenActions as links', () => {});
      it('should show the manageActions as buttons', () => {});
      it('should call the correct action handler on element click', () => {});
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
            new FavoriteFixture({ type: 'foo' }),
            new FavoriteFixture({ type: 'foo' }),
            new FavoriteFixture({ type: 'bar' }),
            new FavoriteFixture({ type: 'baz' })
          ];

          vmQuickLinks$.next(mockFavorites);

          // doesn't test array order
          const expected = jasmine.arrayContaining([
            {
              type: 'foo',
              title: 'foo',
              quickLinks: [
                // add actions on quickLink that are not tested
                withIgnoredActions(mockFavorites[0]),
                withIgnoredActions(mockFavorites[1])
              ]
            },
            {
              type: 'bar',
              title: 'bar',
              quickLinks: [withIgnoredActions(mockFavorites[2])]
            },
            {
              type: 'baz',
              title: 'baz',
              quickLinks: [withIgnoredActions(mockFavorites[3])]
            }
          ]);

          expect(component.contentData$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should sort the quicklink categories', () => {
          const mockFavorites = [
            new FavoriteFixture({ type: 'foo' }),
            new FavoriteFixture({ type: 'foo' }),
            new FavoriteFixture({ type: 'bar' }),
            new FavoriteFixture({ type: 'baz' })
          ];

          vmQuickLinks$.next(mockFavorites);

          // only test category order
          // TODO: fix order when component sorter is refactored
          const expected = [
            {
              type: 'bar',
              title: jasmine.anything(),
              quickLinks: jasmine.anything()
            },
            {
              type: 'baz',
              title: jasmine.anything(),
              quickLinks: jasmine.anything()
            },
            {
              type: 'foo',
              title: jasmine.anything(),
              quickLinks: jasmine.anything()
            }
          ];

          expect(component.contentData$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should sort the quicklinks [per category] on created date, descending', () => {
          const mockFavorites = [
            new FavoriteFixture({ id: 1, type: 'foo', created: new Date(1) }),
            new FavoriteFixture({ id: 2, type: 'foo', created: new Date(4) }),
            new FavoriteFixture({ id: 3, type: 'foo', created: new Date(2) }),
            new FavoriteFixture({ id: 4, type: 'foo', created: new Date(3) })
          ];

          vmQuickLinks$.next(mockFavorites);

          // only need quickLinks, only 1 category
          const quickLinks$ = component.contentData$.pipe(
            map(cD => cD[0].quickLinks)
          );

          // only test quickLink order
          const expected = [
            withIgnoredActions(mockFavorites[1]),
            withIgnoredActions(mockFavorites[3]),
            withIgnoredActions(mockFavorites[2]),
            withIgnoredActions(mockFavorites[0])
          ];

          expect(quickLinks$).toBeObservable(hot('a', { a: expected }));
        });
      });

      describe('actions on a quickLink', () => {
        it('should add a defaultAction', () => {
          const mockFavorite = new FavoriteFixture({ type: 'foo' });

          vmQuickLinks$.next([mockFavorite]);

          // only 1 category with 1 quickLink
          const quickLink$ = component.contentData$.pipe(
            map(cD => cD[0].quickLinks[0])
          );

          const expectedDefaultAction = {
            actionType: 'open',
            label: 'Openen',
            icon: 'exercise:open',
            tooltip: 'open oefening zonder oplossingen',
            handler: component.openAsExercise
          };

          const expected = {
            ...mockFavorite,
            defaultAction: expectedDefaultAction,
            alternativeOpenActions: jasmine.anything(),
            manageActions: jasmine.anything()
          };

          expect(quickLink$).toBeObservable(hot('a', { a: expected }));
        });
        it('should add alternativeOpenActions', () => {
          const mockFavorite = new FavoriteFixture({ type: 'foo' });

          vmQuickLinks$.next([mockFavorite]);

          // only 1 category with 1 quickLink
          const quickLink$ = component.contentData$.pipe(
            map(cD => cD[0].quickLinks[0])
          );

          const expectedAlternativeOpenActions = [
            {
              actionType: 'open',
              label: 'met oplossing',
              icon: 'exercise:finished',
              tooltip: 'open oefening met oplossingen',
              handler: component.openAsSolution
            }
          ];

          const expected = {
            ...mockFavorite,
            defaultAction: jasmine.anything(),
            alternativeOpenActions: expectedAlternativeOpenActions,
            manageActions: jasmine.anything()
          };

          expect(quickLink$).toBeObservable(hot('a', { a: expected }));
        });
        it('should add manageActions', () => {
          const mockFavorite = new FavoriteFixture({ type: 'foo' });

          vmQuickLinks$.next([mockFavorite]);

          // only 1 category with 1 quickLink
          const quickLink$ = component.contentData$.pipe(
            map(cD => cD[0].quickLinks[0])
          );

          const expectedManageActions = [
            {
              actionType: 'manage',
              label: 'Bewerken',
              icon: 'edit',
              tooltip: 'naam aanpassen',
              handler: component.update
            },
            {
              actionType: 'manage',
              label: 'Verwijderen',
              icon: 'verwijder',
              tooltip: 'item verwijderen',
              handler: component.delete
            }
          ];

          const expected = {
            ...mockFavorite,
            defaultAction: jasmine.anything(),
            alternativeOpenActions: jasmine.anything(),
            manageActions: expectedManageActions
          };

          expect(quickLink$).toBeObservable(hot('a', { a: expected }));
        });
      });
    });

    describe('feedback$', () => {
      it('should get the feedback data from the quickLinkViewmodel', () => {
        expect(component.feedback$).toBe(quickLinkViewModel.feedback$);
      });
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

function withIgnoredActions(expectedItem) {
  return {
    ...expectedItem,
    defaultAction: jasmine.anything(),
    alternativeOpenActions: jasmine.anything(),
    manageActions: jasmine.anything()
  };
}
