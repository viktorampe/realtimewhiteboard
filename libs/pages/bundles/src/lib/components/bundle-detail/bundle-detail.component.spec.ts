import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListFormat, ListViewItemDirective } from '@campus/ui';
import { ContentStatus } from '@diekeure/polpo-api-angular-sdk/models/ContentStatus';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PagesBundlesModule } from './../../pages-bundles.module';
import {
  Bundle,
  Content,
  ContentAction,
  Teacher
} from './bundle-detail-classes';
import { BundleDetailComponent } from './bundle-detail.component';
import { BundleDetailViewModel } from './bundle-detail.viewmodel';

export class MockBundleDetailViewModel {
  selectedBundle$ = this.getMockBundle();
  bundleContents$ = this.getMockContents();
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  getMockBundle(): Observable<Bundle> {
    const bundle = new Bundle({
      icon: 'icon-tasks',
      name: 'Dit is een titel',
      description: 'Dit is een subtitel',
      teacher: new Teacher({
        displayName: 'Leerkracht Naam',
        firstName: 'Leerkracht',
        name: 'Naam'
      })
    });

    return of(bundle);
  }

  getMockContents(): Observable<Content[]> {
    const item1 = new Content({
      productType: 'icon-bundles',
      fileExtension: 'zip',
      previewImage: 'string',
      name: 'Dit is een titel',
      description: 'Dit is een beschrijving',
      methodLogo: 'vbtl',
      status: new ContentStatus(),
      actions: [
        new ContentAction({
          text: 'Action tekst 1a',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2a',
          icon: 'icon-book'
        })
      ]
    });

    const item2 = new Content({
      productType: 'icon-bundles',
      fileExtension: 'xlsx',
      previewImage: 'string',
      name: 'Dit is een titel2',
      description: 'Dit is een beschrijving2',
      methodLogo: 'mundo',
      status: new ContentStatus(),
      actions: [
        new ContentAction({
          text: 'Action tekst 1b',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2b',
          icon: 'icon-book'
        })
      ]
    });

    const contents: Content[] = [item1, item2, item1, item2];

    return of(contents);
  }
}

@NgModule({
  imports: [CommonModule, PagesBundlesModule],
  providers: [
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

    component.filter.text.next('2');

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

    expect(component.selectedItems.length).toBe(0);

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

    expect(infoPanelBundle.nativeElement.textContent).toContain('Leerkracht');
  });

  it('should show the item info in the infopanel if an item is selected', () => {
    component.list.deselectAllItems();
    const listDE = fixture.debugElement.query(By.css('campus-list-view'));
    const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
    listItems[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedItems.length).toBe(1);

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

    expect(infoPanelContent.nativeElement.textContent).toContain(
      'Dit is een titel'
    );
  });

  // TODO
  // it('should be able to set the item status in the infopanel if an item is selected', () => { });

  it('should show the item descriptions in the infopanel if multiple items are selected', () => {
    component.list.selectAllItems();
    fixture.detectChanges();

    expect(component.selectedItems.length).toBe(4);

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

    const regExp = new RegExp('Dit is een titel', 'gi');
    expect(
      (infoPanelContents.nativeElement.textContent.match(regExp) || []).length
    ).toBe(4);
  });

  // TODO
  // it('should show an error message if a bundle is no longer available', () => {});

  /*
    Analyse needed data bundle detail page (Student version)
  */
  // it('should get the page header info', () => {});
  // bundle icon
  // title
  // subtitle

  // it('should get an array of educontents', () => {});
  // type icon
  // file extension
  // preview image
  // title
  // description
  // method logo src
  // current status

  // it('should get an array of actions per educontent', () => {});
  // action icon
  // tooltip
  // function to call
  // function parameters

  // it('should get a marker when there are afwijkende instellingen per educontent', () => {});

  // it('should get the teacherinfo', () => {});
  // name
  // avatar

  // it('should get the errormessage when there isnt any content', () => {});

  // it('should get the default list layout (grid/line) ?', () => {});
  // is dit iets wat de pagina bijhoudt? of komt dat uit de store?
});
