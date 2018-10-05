import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ListViewComponent,
  ListViewItemDirective,
  SideSheetComponent
} from '@campus/ui';
import { Observable, of, Subscription } from 'rxjs';

class Bundle {
  icon: string;
  name: string;
  description: string;
  teacher: Teacher;

  public constructor(init?: Partial<Bundle>) {
    Object.assign(this, init);
  }
}

class Teacher {
  displayName: string;
  avatar: string;
  name?: string;
  firstName?: string;

  public constructor(init?: Partial<Teacher>) {
    Object.assign(this, init);
  }
}
class ContentAction {
  text: string;
  icon: string;
  function: string;

  public constructor(init?: Partial<ContentAction>) {
    Object.assign(this, init);
  }
}
class Content {
  productType: string;
  fileExtension: string;
  previewImage: string;
  title: string;
  description: string;
  methodLogo: string;
  actions: ContentAction[];
  status: string;

  public constructor(init?: Partial<Content>) {
    Object.assign(this, init);
  }

  transformToContentForInfoPanel(): object {
    const contentForInfoPanel = new ContentForInfoPanel({
      name: this.title,
      description: this.description,
      extention: this.fileExtension,
      productType: this.productType,
      methods: [this.methodLogo],
      status: this.status
    });

    return contentForInfoPanel;
  }
}

class ContentForInfoPanel {
  preview?: string;
  name: string;
  description: string;
  extention: string;
  productType: string;
  methods: string[];
  status: any;

  public constructor(init?: Partial<ContentForInfoPanel>) {
    Object.assign(this, init);
  }
}

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
  selectedItems: ListViewItemDirective[] = [];

  @ViewChild(ListViewComponent) list: ListViewComponent;
  @ViewChild(SideSheetComponent) sideSheet: SideSheetComponent;

  constructor() {}

  ngOnInit() {
    this.subscriptions.add(
      this.getMockBundle().subscribe(x => (this.bundle = x))
    );
    this.subscriptions.add(
      this.getMockContents().subscribe(x => (this.contents = x))
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
          text: 'Action tekst 1',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2',
          icon: 'icon-book'
        })
      ]
    });

    const contents: Content[] = [item1, item1, item1];

    return of(contents);
  }
}
