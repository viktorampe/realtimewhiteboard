import {
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EffectFeedbackInterface } from '@campus/dal';
import { ContentEditableComponent, FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import {
  QuickLinkActionInterface,
  QuickLinkCategoryInterface,
  QuickLinkInterface
} from './quick-link.interface';
import { QuickLinkViewModel } from './quick-link.viewmodel';

@Component({
  selector: 'campus-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.scss'],
  providers: [QuickLinkViewModel]
})
export class QuickLinkComponent implements OnInit {
  public quickLinkCategories$: Observable<QuickLinkCategoryInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public dialogTitle: string;
  public dialogTitleIcon: string;

  @ViewChildren(ContentEditableComponent)
  private contentEditables: QueryList<ContentEditableComponent>;
  private activeContentEditable: ContentEditableComponent;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    QuickLinkCategoryInterface[],
    QuickLinkCategoryInterface
  >;

  private dialogTitles = new Map<
    QuickLinkTypeEnum,
    { title: string; icon: string }
  >([
    [QuickLinkTypeEnum.FAVORITES, { title: 'Favorieten', icon: 'favorites' }],
    [QuickLinkTypeEnum.HISTORY, { title: 'Recente items', icon: 'unfinished' }]
  ]);

  private actionHandlers = new Map<
    string,
    (quickLink: QuickLinkInterface) => void
  >([
    [
      'openEduContentAsExercise',
      (input: QuickLinkInterface): void => this.openEduContentAsExercise(input)
    ],
    [
      'openEduContentAsSolution',
      (input: QuickLinkInterface): void => this.openEduContentAsSolution(input)
    ],
    [
      'openEduContentAsStream',
      (input: QuickLinkInterface): void => this.openEduContentAsStream(input)
    ],
    [
      'openEduContentAsDownload',
      (input: QuickLinkInterface): void => this.openEduContentAsDownload(input)
    ],
    ['openBundle', (input: QuickLinkInterface): void => this.openBundle(input)],
    ['openTask', (input: QuickLinkInterface): void => this.openTask(input)],
    ['openArea', (input: QuickLinkInterface): void => this.openArea(input)],
    ['openBoeke', (input: QuickLinkInterface): void => this.openBoeke(input)],
    ['openSearch', (input: QuickLinkInterface): void => this.openSearch(input)],
    ['edit', (input: QuickLinkInterface): void => this.enableEditing(input)],
    ['remove', (input: QuickLinkInterface): void => this.remove(input)]
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: QuickLinkTypeEnum },
    private dialogRef: MatDialogRef<QuickLinkComponent>,
    private quickLinkViewModel: QuickLinkViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.setupStreams();
    this.filterTextInput.setFilterableItem(this);

    if (this.dialogTitles.has(this.data.mode)) {
      const titleData = this.dialogTitles.get(this.data.mode);
      this.dialogTitle = titleData.title;
      this.dialogTitleIcon = titleData.icon;
    }
  }

  filterFn(
    source: QuickLinkCategoryInterface[],
    searchText: string
  ): QuickLinkCategoryInterface[] {
    if (searchText.trim().length > 0) {
      const results = this.filterService
        .filter(
          //eliminate categories
          ([] as QuickLinkInterface[]).concat(
            ...source.map(cat => cat.quickLinks)
          ),
          { name: searchText }
        )
        .sort(this.quickLinkSorter);

      const contentData: QuickLinkCategoryInterface = {
        type: 'Gevonden items',
        title: 'Gevonden items',
        order: 1,
        quickLinks: results
      };

      return [contentData];
    } else {
      return source;
    }
  }

  public onActionClick(
    action: QuickLinkActionInterface,
    quickLink: QuickLinkInterface
  ) {
    if (this.actionHandlers.has(action.handler)) {
      this.actionHandlers.get(action.handler)(quickLink);
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public openEduContentAsExercise(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openExercise(quickLink.eduContent);
  }

  public openEduContentAsSolution(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openExercise(quickLink.eduContent, true);
  }

  public openEduContentAsStream(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openStaticContent(quickLink.eduContent, true);
    this.closeDialog();
  }

  public openEduContentAsDownload(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openStaticContent(quickLink.eduContent);
  }

  public openBundle(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openBundle(quickLink.bundle);
    this.closeDialog();
  }

  public openTask(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openTask(quickLink.task);
    this.closeDialog();
  }

  public openArea(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openArea(quickLink.learningArea);
    this.closeDialog();
  }

  public openSearch(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openSearch(quickLink, this.data.mode);
    this.closeDialog();
  }

  public openBoeke(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openStaticContent(quickLink.eduContent);
  }

  public update(quickLink: QuickLinkInterface, newName: string) {
    this.quickLinkViewModel.update(quickLink.id, newName, this.data.mode);
  }

  public enableEditing(quickLink: QuickLinkInterface) {
    if (this.activeContentEditable) {
      this.activeContentEditable.active = false;
    }

    const contentEditable = this.contentEditables.find(
      editable => editable.relatedItem === quickLink
    );

    if (contentEditable) {
      this.activeContentEditable = contentEditable;
      this.activeContentEditable.active = true;
    }
  }

  public remove(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.remove(quickLink.id, this.data.mode);
  }

  public onBannerDismiss(event) {
    this.quickLinkViewModel.onFeedbackDismiss(event);
  }

  private setupStreams() {
    this.quickLinkCategories$ = this.quickLinkViewModel
      .getQuickLinkCategories$(this.data.mode)
      .pipe(
        map(
          categories =>
            categories.sort((a, b) => this.quickLinkDataCategorySorter(a, b)) // order categories
        )
      );

    this.feedback$ = this.quickLinkViewModel.getFeedback$();
  }

  private quickLinkDataCategorySorter(
    a: QuickLinkCategoryInterface,
    b: QuickLinkCategoryInterface
  ): number {
    if (a.order === -1) return 1;
    if (b.order === -1) return -1;

    return a.order - b.order;
  }

  private quickLinkSorter(
    a: QuickLinkInterface,
    b: QuickLinkInterface
  ): number {
    return new Date(b.created).getTime() - new Date(a.created).getTime(); // sorting descending
  }
}
