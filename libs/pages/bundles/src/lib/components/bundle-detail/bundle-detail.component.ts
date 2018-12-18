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
  PersonInterface,
  UnlockedContent
} from '@campus/dal';
import {
  FilterableItem,
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SideSheetComponent
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
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
    FilterableItem<UnlockedContent[], UnlockedContent> {
  protected listFormat = ListFormat; //enum beschikbaar maken in template

  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;

  learningArea$: Observable<LearningAreaInterface>;
  bundle$: Observable<BundleInterface>;
  bundleOwner$: Observable<PersonInterface>;
  unlockedContents$: Observable<UnlockedContent[]>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<UnlockedContent[], UnlockedContent>;

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
    this.setupAlertsSubscription();
    this.unlockedContents$ = this.getBundleContents();

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

  clickOpenContent(unlockedcontent: UnlockedContent): void {
    this.bundlesViewModel.openContent(unlockedcontent);
  }

  private setupAlertsSubscription(): void {
    this.subscriptions.add(
      this.routeParams$.subscribe(params =>
        this.bundlesViewModel.setBundleAlertRead(+params.bundle)
      )
    );
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

  private getBundleContents(): Observable<UnlockedContent[]> {
    return this.routeParams$.pipe(
      switchMap(params => {
        console.log(params);
        return this.bundlesViewModel.getBundleContents(params.bundle);
      })
    );
  }

  filterFn(source: UnlockedContent[], filterText: string): UnlockedContent[] {
    if (this.list) {
      this.list.deselectAllItems();
    }

    console.log(source);

    return this.filterService.filter(source, {
      content: { name: filterText }
    });
  }
}
