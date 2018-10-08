import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  ListViewItemDirective,
  SideSheetComponent
} from '@campus/ui';
import { Observable, of, Subscription } from 'rxjs';
import {
  Bundle,
  Content,
  ContentAction,
  Teacher
} from './bundle-detail-classes';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  // contents$: Observable<Content[]>;
  // teacher$: Observable<Teacher[]>;
  // filter$: Observable<string>;
  // listFormat$: Observable<ListFormat>;
  // selectedItems$: Observable<ListViewItemDirective[]>;
  // currentBundle$: Observable<Bundle>;

  subscriptions = new Subscription();
  bundle: Bundle;
  contents: Content[];
  filteredContents: Content[];
  selectedItems: ListViewItemDirective[] = [];
  listFormat = ListFormat;
  currentListFormat = ListFormat.GRID;

  public get selectedContent(): object {
    return (this.selectedItems[0]
      .dataObject as Content).transformToContentForInfoPanel();
  }

  public get selectedContents(): object[] {
    return this.selectedItems.map(x =>
      (x.dataObject as Content).transformToContentsForInfoPanel()
    );
  }

  @ViewChild(ListViewComponent) list: ListViewComponent;
  @ViewChild(SideSheetComponent) sideSheet: SideSheetComponent;
  @ViewChild(FilterTextInputComponent) filter: FilterTextInputComponent;

  ngOnInit() {
    this.subscriptions.add(
      this.getMockBundle().subscribe(x => (this.bundle = x))
    );
    this.subscriptions.add(
      this.getMockContents().subscribe(x => (this.contents = x))
    );
    this.filteredContents = this.contents;
    this.subscriptions.add(
      this.filter.text.subscribe(x => {
        if (x) {
          this.filteredContents = this.contents.filter(c =>
            c.title.includes(x)
          );
        } else {
          this.filteredContents = this.contents;
        }
      })
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.list.selectedItems$.subscribe(x => {
        if (x.length > 0) {
          this.sideSheet.toggle(true);
        }
        this.selectedItems = x;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setListFormat(format: ListFormat) {
    this.currentListFormat = format;
    console.log(this.currentListFormat);
  }

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
      title: 'Dit is een titel',
      description: 'Dit is een beschrijving',
      methodLogo: 'vbtl',
      status: 'string',
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
      title: 'Dit is een titel2',
      description: 'Dit is een beschrijving2',
      methodLogo: 'mundo',
      status: 'string',
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

    const contents: Content[] = [item1, item2, item1];

    return of(contents);
  }
}
