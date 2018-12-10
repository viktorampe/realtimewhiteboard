import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BundleInterface,
  ContentInterface,
  LearningAreaInterface,
  PersonInterface
} from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import {
  FilterableItem,
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SideSheetComponent
} from '@campus/ui';
import { Observable, Subscription } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent
  implements
    OnInit,
    OnDestroy,
    AfterViewInit,
    FilterableItem<ContentInterface[], ContentInterface> {
  protected listFormat = ListFormat; //enum beschikbaar maken in template

  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;

  learningArea$: Observable<LearningAreaInterface>;
  bundle$: Observable<BundleInterface>;
  bundleOwner$: Observable<PersonInterface>;
  contents$: Observable<ContentInterface[]>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    ContentInterface[],
    ContentInterface
  >;

  list: ListViewComponent<ContentInterface>;
  @ViewChild('bundleListview')
  set listViewComponent(list: ListViewComponent<ContentInterface>) {
    this.list = list;
  }
  private sideSheet: SideSheetComponent;
  @ViewChild('bundleSidesheet')
  set sideSheetComponent(sidesheet: SideSheetComponent) {
    this.sideSheet = sidesheet;
  }

  private routeParams$ = this.route.params.pipe(shareReplay(1));
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    public bundlesViewModel: BundlesViewModel,
    private cd: ChangeDetectorRef,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit(): void {
    this.learningArea$ = this.getLearningArea();
    this.bundle$ = this.getBundle();
    this.bundleOwner$ = this.bundlesViewModel.getBundleOwner(this.bundle$);
    this.contents$ = this.getBundleContents();

    this.filterTextInput.setFilterableItem(this);
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.list.selectedItems$.subscribe(
        (selectedItems: ContentInterface[]) => {
          if (selectedItems.length > 0) {
            this.sideSheet.toggle(true);
          }
        }
      )
    );

    // Needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(value);
  }

  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.bundlesViewModel.getLearningAreaById(params.area);
      })
    );
  }

  private getBundle(): Observable<BundleInterface> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.bundlesViewModel.getBundleById(params.bundle);
      })
    );
  }

  private getBundleContents(): Observable<ContentInterface[]> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.bundlesViewModel.getBundleContents(params.bundle);
      })
    );
  }

  filterFn(source: ContentInterface[], filterText: string): ContentInterface[] {
    if (this.list) {
      this.list.deselectAllItems();
    }
    return this.filterService.filter(source, {
      name: filterText
    });
  }
}
