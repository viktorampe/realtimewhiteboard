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
  SelectOption,
  SideSheetComponent
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
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
  contentStatusOptions$: Observable<SelectOption[]>;
  selectedUnlockedContent$: Observable<UnlockedContent>;
  selectedUnlockedContentStatus$: Observable<number>;

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
    this.contentStatusOptions$ = this.bundlesViewModel.contentStatusOptions$;
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

    this.selectedUnlockedContent$ = this.getSelectedUnlockedContent();
    this.selectedUnlockedContentStatus$ = this.getSelectedUnlockedContentStatus();

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

  onSaveStatus(value: SelectOption): void {
    this.selectedUnlockedContent$.pipe(take(1)).subscribe(unlockedContent => {
      this.bundlesViewModel.saveContentStatus(unlockedContent.id, value.value);
    });
  }

  /**
   * Get the UnlockedContent from the selected EduContent
   * when there is only a single element selected
   *
   * @private
   * @returns {Observable<UnlockedContent>}
   */
  private getSelectedUnlockedContent(): Observable<UnlockedContent> {
    return combineLatest(this.list.selectedItems$, this.unlockedContents$).pipe(
      map(([selectedContent, unlockedContents]) => {
        if (selectedContent.length !== 1) {
          return null;
        }
        return unlockedContents.find(uc => uc.content === selectedContent[0]);
      }),
      filter(unlockedContent => !!unlockedContent),
      shareReplay(1)
    );
  }

  private getSelectedUnlockedContentStatus(): Observable<number> {
    return this.selectedUnlockedContent$.pipe(
      switchMap(unlockedContent => {
        return this.bundlesViewModel.getStudentContentStatusByUnlockedContentId(
          unlockedContent.id
        );
      }),
      map(studentContentStatus => {
        return studentContentStatus ? studentContentStatus.contentStatusId : 0;
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

  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.bundlesViewModel.getLearningAreaById(params.area);
      })
    );
  }

  private getBundle(): Observable<BundleInterface> {
    return this.routeParams$.pipe(
      switchMap(params => this.bundlesViewModel.getBundleById(params.bundle)),
      shareReplay(1)
    );
  }

  private getBundleContents(): Observable<UnlockedContent[]> {
    return this.routeParams$.pipe(
      switchMap(params =>
        this.bundlesViewModel.getBundleContents(params.bundle)
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
