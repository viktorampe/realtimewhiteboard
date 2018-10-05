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
}

class Teacher {
  displayName: string;
  avatar: string;
  name?: string;
  firstName?: string;
}
class ContentAction {
  text: string;
  icon: string;
  function: string;
}
class Content {
  icon: string;
  fileExtension: string;
  previewImage: string;
  title: string;
  description: string;
  methodLogo: string;
  actions: ContentAction[];
  status: string;
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
    const bundle = new Bundle();
    bundle.icon = 'icon-tasks';
    bundle.name = 'Dit is een titel';
    bundle.description = 'Dit is een subtitel';

    const teacher = new Teacher();
    teacher.displayName = 'Leerkracht Naam';
    teacher.firstName = 'Leerkracht';
    teacher.name = 'Naam';
    bundle.teacher = teacher;

    return of(bundle);
  }

  getMockContents(): Observable<Content[]> {
    const item1 = new Content();
    item1.icon = 'icon-bundles';
    item1.fileExtension = 'zip';
    item1.previewImage = 'string';
    item1.title = 'Dit is een titel';
    item1.description = 'Dit is een beschrijving';
    item1.methodLogo = 'vbtl';
    item1.status = 'string';

    const actions1: ContentAction[] = [];
    const action1 = new ContentAction();
    action1.text = 'Action tekst';
    action1.icon = 'icon-tasks';
    actions1.push(action1);
    actions1.push(action1);
    item1.actions = actions1;

    const contents: Content[] = [];
    contents.push(item1);
    contents.push(item1);
    contents.push(item1);

    return of(contents);
  }
}
