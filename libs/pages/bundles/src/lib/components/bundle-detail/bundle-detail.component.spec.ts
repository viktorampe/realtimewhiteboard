import { CommonModule } from '@angular/common';
import { Inject, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BundleInterface,
  EduContentInterface,
  UserContentInterface
} from '@campus/dal';
import { ListFormat, ListViewItemDirective } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PagesBundlesModule } from './../../pages-bundles.module';
import { BundleDetailComponent } from './bundle-detail.component';
import { BundleDetailViewModel } from './bundle-detail.viewmodel';
import { DataConverterService } from './services/data-converter.service';

@Inject(DataConverterService)
export class MockBundleDetailViewModel {
  selectedBundle$ = this.getMockBundle();

  bundleContents$ = combineLatest(
    // mockdata - Educontents
    this.getMockEducontents().pipe(
      map(educontentsArray =>
        educontentsArray.map(e =>
          this.dataConverter.mapEduContentToContentInterface(e)
        )
      )
    ),
    // mockdata - Usercontents
    this.getMockUsercontents().pipe(
      map(usercontentsArray =>
        usercontentsArray.map(u =>
          this.dataConverter.mapUserContentToContentInterface(u)
        )
      )
    )
  ).pipe(
    map(arrays => Array.prototype.concat.apply([], arrays)) //flatten arrays
  );

  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  constructor(private dataConverter: DataConverterService) {}

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  private getMockBundle(): Observable<BundleInterface> {
    const bundle = {
      icon: 'icon-tasks',
      name: 'Algemeen',
      description: 'Dit is een subtitel',
      start: new Date('2018-09-01 00:00:00'),
      end: new Date('2018-09-01 00:00:00'),
      learningArea: {
        name: 'Aardrijkskunde',
        icon: 'icon-aardrijkskunde',
        color: '#485235'
      },
      teacher: {
        firstName: 'Ella',
        name: 'Kuipers',
        email: 'teacher2@mailinator.com'
      }
    };

    return of(bundle);
  }

  private getMockEducontents(): Observable<EduContentInterface[]> {
    const eduContent = {
      type: 'boek-e',
      id: 1,
      publishedEduContentMetadata: {
        version: 1,
        metaVersion: '0.1',
        language: 'be',
        title: 'De wereld van de getallen',
        description: 'Lorem ipsum dolor sit amet ... ',
        created: new Date('2018-09-04 14:21:19'),
        fileName: 'EXT_powerpoint_meetkunde.ppt',
        thumbSmall: 'https://www.polpo.be/assets/images/home-laptop-books.jpg',
        methods: [
          { name: 'Beautemps', icon: 'beautemps', logoUrl: 'beautemps.svg' },
          { name: 'Kapitaal', icon: 'kapitaal', logoUrl: 'kapitaal.svg' }
        ],
        eduContentProductType: {
          name: 'aardrijkskunde',
          icon: 'icon-aardrijkskunde'
        }
      }
    };
    return of([eduContent, eduContent]);
  }

  private getMockUsercontents(): Observable<UserContentInterface[]> {
    const userContent = {
      type: 'link',
      name: 'Omschrijving thesis 0',
      description: 'Omschrijving vereisten voor thesis op google drive',
      link: 'http://www.google.be?q=thesisomschrijving',
      teacher: {
        firstName: 'Ella',
        name: 'Kuipers',
        email: 'teacher2@mailinator.com'
      }
    };
    return of([userContent, userContent]);
  }
}

@NgModule({
  imports: [CommonModule, PagesBundlesModule],
  providers: [
    DataConverterService,
    { provide: BundleDetailViewModel, useClass: MockBundleDetailViewModel }
  ]
})
export class TestModule {}

describe('BundleDetailComponent', () => {
  let component: BundleDetailComponent;
  let fixture: ComponentFixture<BundleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
    Analyse bundle detail page (Student version)
  */

  // it('should show a toolbar at the top of the page', () => {});

  // it('should show a pageheader with the bundle icon, name and description ', () => {});

  it('should show the number of available items', async(() => {
    const expectedAmount = 4;

    component.filteredContents$.subscribe(x =>
      expect(x.length).toBe(expectedAmount)
    );

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const amountDE = fixture.debugElement.query(By.css('.itemsAmount'));
      expect(amountDE.nativeElement.textContent).toContain(expectedAmount);
    });
  }));

  it('should show a list of all available items in the bundle', async(() => {
    const expectedAmount = 4;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const listDE = fixture.debugElement.query(By.css('campus-list-view'));
      const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
      expect(listItems.length).toBe(expectedAmount);
    });
  }));

  it('should be able to filter the available items', async(() => {
    const expectedAmount = 2;

    component.filter.text.next('0');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const listDE = fixture.debugElement.query(By.css('campus-list-view'));
      const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
      expect(listItems.length).toBe(expectedAmount);
    });
  }));

  it('should be able to toggle the list between list and grid view', () => {
    component.currentListFormat$.next(ListFormat.GRID);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const listDE = fixture.debugElement.query(By.css('campus-list-view'));
      expect(listDE.nativeElement.className).toContain(
        'ui-list-view__list--grid'
      );
    });

    component.currentListFormat$.next(ListFormat.LINE);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const listDE = fixture.debugElement.query(By.css('campus-list-view'));
      expect(listDE.nativeElement.className).toContain(
        'ui-list-view__list--line'
      );
    });
  });

  // TODO: info komt uit store?
  // it('should start the list in grid view on desktop', () => {});

  // TODO: info komt uit store?
  // it('should start the list in list view on mobile', () => {});

  // it('should show an infopanel', () => {});

  // it('should show the infopanel next to the the list on desktop', () => {});

  // it('should show the infopanel as a side drawer on mobile', () => {});

  it('should show the teacher info in the infopanel if no item is selected', () => {
    component.list.deselectAllItems();
    fixture.detectChanges();

    expect(component.selectedItems$.value.length).toBe(0);

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

    expect(component.selectedItems$.value.length).toBe(1);

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

  // TODO
  // it('should be able to set the item status in the infopanel if an item is selected', () => { });

  it('should show the item descriptions in the infopanel if multiple items are selected', () => {
    component.list.multiSelect = true;
    component.list.selectAllItems();
    fixture.detectChanges();

    expect(component.selectedItems$.value.length).toBe(4);

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

  // TODO
  // it('should show an error message if a bundle is no longer available', () => {});
});
