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
  MatTooltipModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FavoriteFixture,
  FavoriteInterface,
  HistoryInterface,
  LearningAreaFixture
} from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import {
  ButtonComponent,
  ContentEditableComponent,
  InfoPanelComponent,
  UiModule
} from '@campus/ui';
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
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [QuickLinkComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockInjectedData },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
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
    vmQuickLinks$ = quickLinkViewModel.getQuickLinks$(null) as BehaviorSubject<
      FavoriteInterface[] | HistoryInterface[]
    >;
    // from now on, this particular instance of the stream is always returned
    quickLinkViewModel.getQuickLinks$ = jest
      .fn()
      .mockReturnValue(vmQuickLinks$);
    // make component 'attach' to mocked stream
    component['setupStreams']();
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

      it('should show the alternativeOpenActions as links', () => {
        const listItemLinks = fixture.debugElement
          .query(By.directive(MatListItem))
          .queryAll(By.css('a'));

        expect(listItemLinks.length).toBe(1);
        expect(listItemLinks[0].nativeElement.textContent.trim()).toBe(
          'Toon oplossing'
        );
      });

      it('should show the manageActions as buttons', () => {
        const listItemButtons = fixture.debugElement
          .query(By.directive(MatListItem))
          .queryAll(By.directive(ButtonComponent))
          .map(dE => dE.componentInstance as ButtonComponent);

        expect(listItemButtons.length).toBe(2);
        expect(listItemButtons[0].iconClass).toBe('edit');
        expect(listItemButtons[1].iconClass).toBe('verwijder');
      });

      it('should call the correct action handler on element click', fakeAsync(() => {
        const listItem = fixture.debugElement.query(By.directive(MatListItem));

        const listItemLinks = fixture.debugElement
          .query(By.directive(MatListItem))
          .queryAll(By.css('a'));

        const listItemButtons = fixture.debugElement
          .query(By.directive(MatListItem))
          .queryAll(By.directive(ButtonComponent));

        // default action
        spyOn(component, 'openAsExercise');
        listItem.triggerEventHandler('click', null);
        expect(component.openAsExercise).toHaveBeenCalled();

        // alternative open action
        spyOn(component, 'openAsSolution');
        listItemLinks[0].triggerEventHandler('click', null);
        expect(component.openAsSolution).toHaveBeenCalled();

        // manage actions - update
        spyOn(component, 'update');
        listItemButtons[0].triggerEventHandler('click', null);
        expect(component.update).toHaveBeenCalled();

        // manage actions - remove
        spyOn(component, 'remove');
        listItemButtons[1].triggerEventHandler('click', null);
        expect(component.remove).toHaveBeenCalled();
      }));
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
                // ignore missing properties
                jasmine.objectContaining(mockFavorites[0]),
                jasmine.objectContaining(mockFavorites[1])
              ]
            },
            {
              type: 'bar',
              title: 'bar',
              quickLinks: [jasmine.objectContaining(mockFavorites[2])]
            },
            {
              type: 'baz',
              title: 'baz',
              quickLinks: [jasmine.objectContaining(mockFavorites[3])]
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
            jasmine.objectContaining({
              type: 'bar'
            }),
            jasmine.objectContaining({
              type: 'baz'
            }),
            jasmine.objectContaining({
              type: 'foo'
            })
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
        const mockOpenAsExerciseFunction = () => {};
        const mockOpenAsSolutionFunction = () => {};
        const mockUpdateFunction = () => {};
        const mockRemoveFunction = () => {};

        beforeEach(() => {
          // replace functions that should be added as handlers with mocks
          // tests need same instance reference
          // there are other tests to check if clicks call the correct handler
          quickLinkActions = component['quickLinkActions'];
          quickLinkActions.openAsExercise.handler = mockOpenAsExerciseFunction;
          quickLinkActions.openAsSolution.handler = mockOpenAsSolutionFunction;
          quickLinkActions.edit.handler = mockUpdateFunction;
          quickLinkActions.remove.handler = mockRemoveFunction;
        });

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
            handler: mockOpenAsExerciseFunction
          };

          const expected = jasmine.objectContaining({
            ...mockFavorite,
            defaultAction: expectedDefaultAction
          });

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
              label: 'Toon oplossing',
              icon: 'exercise:finished',
              tooltip: 'open oefening met oplossingen',
              handler: mockOpenAsSolutionFunction
            }
          ];

          const expected = jasmine.objectContaining({
            ...mockFavorite,
            alternativeOpenActions: expectedAlternativeOpenActions
          });

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
              handler: mockUpdateFunction
            },
            {
              actionType: 'manage',
              label: 'Verwijderen',
              icon: 'verwijder',
              tooltip: 'item verwijderen',
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

    describe('feedback$', () => {
      it('should get the feedback data from the quickLinkViewmodel', () => {
        expect(component.feedback$).toBe(quickLinkViewModel.feedback$);
      });
    });
  });

  describe('manageActions implementation', () => {
    describe('update', () => {
      it('should activate the right ContentEditable when clicking update', () => {
        const updateButton = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.directive(ButtonComponent));

        const contentEditable = fixture.debugElement
          .query(By.directive(MatListItem))
          .query(By.directive(ContentEditableComponent));

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

        spyOn(component, 'rename');

        updateButton.nativeElement.click();
        contentEditable.componentInstance.textChanged.emit(newText);

        expect(component.rename).toHaveBeenCalled();
        expect(component.rename).toHaveBeenCalledWith(
          contentEditable.componentInstance.relatedItem,
          newText
        );
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
