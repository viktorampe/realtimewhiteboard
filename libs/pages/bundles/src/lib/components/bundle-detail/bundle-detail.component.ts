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
  LearningAreaInterface,
  PersonInterface,
  StudentContentStatusInterface,
  UnlockedContent
} from '@campus/dal';
import {
  FilterableItem,
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SelectOption,
  SideSheetComponent
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
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
  listFormat = ListFormat; //enum beschikbaar maken in template

  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;

  learningArea$: Observable<LearningAreaInterface>;
  bundle$: Observable<BundleInterface>;
  bundleOwner$: Observable<PersonInterface>;
  unlockedContents$: Observable<UnlockedContent[]>;
  contentStatusOptions$: Observable<SelectOption[]>;
  selectedUnlockedContent$: Observable<UnlockedContent>;
  unlockedContentStatuses$: Observable<
    Dictionary<StudentContentStatusInterface[]>
  >;

  @ViewChild(FilterTextInputComponent, { static: true })
  filterTextInput: FilterTextInputComponent<UnlockedContent[], UnlockedContent>;

  list: ListViewComponent<UnlockedContent>;
  @ViewChild('bundleListview', { static: false })
  set listViewComponent(list: ListViewComponent<UnlockedContent>) {
    this.list = list;
  }
  private sideSheet: SideSheetComponent;
  @ViewChild('bundleSidesheet', { static: false })
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
    this.contentStatusOptions$ = this.bundlesViewModel.contentStatusOptions$;
    this.bundle$ = this.getBundle();
    this.bundleOwner$ = this.bundlesViewModel.getBundleOwner(this.bundle$);
    this.setupAlertsSubscription();
    this.unlockedContents$ = this.getBundleContents();
    this.filterTextInput.setFilterableItem(this);
    this.setupHistorySubscription();
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.list.selectedItems$.subscribe((selectedItems: UnlockedContent[]) => {
        if (selectedItems.length > 0) {
          this.sideSheet.toggle(true);
        }
      })
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

  onSaveStatus(value: SelectOption, unlockedContent: UnlockedContent): void {
    this.bundlesViewModel.saveContentStatus(unlockedContent.id, value.value);
  }

  protected getSelectedUnlockedContentStatus(
    unlockedContent
  ): Observable<number> {
    return this.bundlesViewModel
      .getStudentContentStatusByUnlockedContentId(unlockedContent.id)
      .pipe(
        map(studentContentStatus => {
          return studentContentStatus
            ? studentContentStatus.contentStatusId
            : 0;
        })
      );
  }

  private setupAlertsSubscription(): void {
    this.subscriptions.add(
      this.routeParams$.subscribe(params =>
        this.bundlesViewModel.setBundleAlertRead(+params.bundle)
      )
    );
  }

  private setupHistorySubscription(): void {
    // check for permissions is done in the viewmodel
    this.subscriptions.add(
      this.routeParams$.subscribe(params =>
        this.bundlesViewModel.setBundleHistory(+params.bundle)
      )
    );
  }

  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.bundlesViewModel.getLearningAreaById(+params.area);
      })
    );
  }

  private getBundle(): Observable<BundleInterface> {
    return this.routeParams$.pipe(
      switchMap(params => this.bundlesViewModel.getBundleById(+params.bundle)),
      shareReplay(1)
    );
  }

  private getBundleContents(): Observable<UnlockedContent[]> {
    return this.routeParams$.pipe(
      switchMap(params =>
        this.bundlesViewModel.getBundleContents(+params.bundle)
      ),
      shareReplay(1)
    );
  }

  protected allowMultiSelect(bundle): boolean {
    return this.bundlesViewModel.currentUserHasWriteAccessToBundle(bundle);
  }

  filterFn(source: UnlockedContent[], filterText: string): UnlockedContent[] {
    if (this.list) {
      this.list.deselectAllItems();
    }

    return this.filterService.filter(source, {
      content: { name: filterText }
    });
  }
}
