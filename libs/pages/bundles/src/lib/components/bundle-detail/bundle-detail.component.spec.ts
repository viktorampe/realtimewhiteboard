import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import { ContentFixture } from '@campus/dal';
import { FILTER_SERVICE_TOKEN } from '@campus/shared';
import { ListFormat, ListViewItemDirective, UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';
import { MockViewModel } from '../bundles.viewmodel.mocks';
import { BundleDetailComponent } from './bundle-detail.component';

describe('BundleDetailComponent', () => {
  let params: BehaviorSubject<Params>;
  let bundlesViewModel: BundlesViewModel;
  let component: BundleDetailComponent;
  let fixture: ComponentFixture<BundleDetailComponent>;

  beforeEach(async(() => {
    params = new BehaviorSubject<Params>({ area: 1, bundle: 1 });
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), UiModule, BrowserAnimationsModule],
      declarations: [BundleDetailComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: { params: params } },
        { provide: BundlesViewModel, useClass: MockViewModel },
        {
          provide: FILTER_SERVICE_TOKEN,
          useValue: {
            filter: () => [
              new ContentFixture(),
              new ContentFixture(),
              new ContentFixture(),
              new ContentFixture()
            ]
          }
        },
        Store
      ]
    }).compileComponents();
    bundlesViewModel = TestBed.get(BundlesViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(bundlesViewModel, 'changeListFormat');
    component.clickChangeListFormat(ListFormat.GRID);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });

  it('should get the listFormat$ from the vm', () => {
    expect(component.listFormat$).toBe(bundlesViewModel.listFormat$);
  });

  it('should show the teacher info in the infopanel if no item is selected', () => {
    component.list.deselectAllItems();
    fixture.detectChanges();

    expect(component.list.selectedItems$.value.length).toBe(0);

    const infoPanelDE = fixture.debugElement.query(
      By.css('campus-side-sheet-body')
    );
    const infoPanelBundle = infoPanelDE.query(
      By.css('campus-info-panel-bundle')
    );
    const infoPanelContent = infoPanelDE.query(
      By.css('campus-info-panel-content')
    );
    const infoPanelContents = infoPanelDE.query(
      By.css('campus-info-panel-contents')
    );
    expect(infoPanelBundle).toBeTruthy();
    expect(infoPanelContent).toBeFalsy();
    expect(infoPanelContents).toBeFalsy();
  });

  it('should show the item info in the infopanel if an item is selected', () => {
    component.list.deselectAllItems();
    const listDE = fixture.debugElement.query(By.css('campus-list-view'));
    const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
    listItems[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.list.selectedItems$.value.length).toBe(1);

    const infoPanelDE = fixture.debugElement.query(
      By.css('campus-side-sheet-body')
    );
    const infoPanelBundle = infoPanelDE.query(
      By.css('campus-info-panel-bundle')
    );
    const infoPanelContent = infoPanelDE.query(
      By.css('campus-info-panel-content')
    );
    const infoPanelContents = infoPanelDE.query(
      By.css('campus-info-panel-contents')
    );
    expect(infoPanelBundle).toBeFalsy();
    expect(infoPanelContent).toBeTruthy();
    expect(infoPanelContents).toBeFalsy();
  });

  it('should show the item descriptions in the infopanel if multiple items are selected', () => {
    component.list.multiSelect = true;
    component.list.selectAllItems();
    fixture.detectChanges();

    expect(component.list.selectedItems$.value.length).toBe(4);

    const infoPanelDE = fixture.debugElement.query(
      By.css('campus-side-sheet-body')
    );
    const infoPanelBundle = infoPanelDE.query(
      By.css('campus-info-panel-bundle')
    );
    const infoPanelContent = infoPanelDE.query(
      By.css('campus-info-panel-content')
    );
    const infoPanelContents = infoPanelDE.query(
      By.css('campus-info-panel-contents')
    );
    expect(infoPanelBundle).toBeFalsy();
    expect(infoPanelContent).toBeFalsy();
    expect(infoPanelContents).toBeTruthy();
  });

  it('should show an error message if a bundle is no longer available', () => {
    component.bundle$ = of(null);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('campus-side-sheet'))).toBeFalsy();
    expect(fixture.debugElement.nativeElement.textContent).toContain(
      'Deze bundel is niet beschikbaar'
    );
  });
});
