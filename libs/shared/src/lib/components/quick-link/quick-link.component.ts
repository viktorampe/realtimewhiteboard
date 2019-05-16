import {
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  EduContent,
  EffectFeedbackInterface,
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface
} from '@campus/dal';
import { ContentEditableComponent, FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import { QuickLinkViewModel } from './quick-link.viewmodel';

@Component({
  selector: 'campus-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.scss'],
  providers: [QuickLinkViewModel]
})
export class QuickLinkComponent implements OnInit {
  public contentData$: Observable<QuickLinkInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public dialogTitle: string;
  public dialogTitleIcon: string;

  @ViewChildren(ContentEditableComponent)
  private contentEditables: QueryList<ContentEditableComponent>;
  private activeContentEditable: ContentEditableComponent;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    QuickLinkInterface[],
    ContentDataInterface
  >;

  private dialogTitles = new Map<
    QuickLinkTypeEnum,
    { title: string; icon: string }
  >([
    [QuickLinkTypeEnum.FAVORITES, { title: 'Favorieten', icon: 'favorites' }],
    [QuickLinkTypeEnum.HISTORY, { title: 'Recente items', icon: 'unfinished' }]
  ]);

  private categories = new Map<
    FavoriteTypesEnum | string,
    { label: string; order: number }
  >([
    // Favorites
    [FavoriteTypesEnum.BOEKE, { label: 'Bordboeken', order: 0 }],
    [FavoriteTypesEnum.EDUCONTENT, { label: 'Lesmateriaal', order: 1 }],
    [FavoriteTypesEnum.SEARCH, { label: 'Zoekopdrachten', order: 2 }],
    [FavoriteTypesEnum.BUNDLE, { label: 'Bundels', order: 3 }],
    [FavoriteTypesEnum.TASK, { label: 'Taken', order: 4 }],
    // History
    ['boek-e', { label: 'Bordboeken', order: 0 }],
    ['educontent', { label: 'Lesmateriaal', order: 1 }],
    ['search', { label: 'Zoekopdrachten', order: 2 }],
    ['bundle', { label: 'Bundels', order: 3 }],
    ['task', { label: 'Taken', order: 4 }]
  ]);

  private quickLinkActions: {
    [key: string]: QuickLinkActionInterface;
  } = {
    openEduContentAsExercise: {
      actionType: 'open',
      label: 'Openen',
      icon: 'exercise:open',
      tooltip: 'Open oefening zonder oplossingen',
      handler: (input: QuickLinkInterface): void =>
        this.openEduContentAsExercise(input)
    },
    openEduContentAsSolution: {
      actionType: 'open',
      label: 'Toon oplossing',
      icon: 'exercise:finished',
      tooltip: 'Open oefening met oplossingen',
      handler: (input: QuickLinkInterface): void =>
        this.openEduContentAsSolution(input)
    },
    openEduContentAsStream: {
      actionType: 'open',
      label: 'Openen',
      icon: 'lesmateriaal',
      tooltip: 'Open het lesmateriaal',
      handler: (input: QuickLinkInterface): void =>
        this.openEduContentAsStream(input)
    },
    openEduContentAsDownload: {
      actionType: 'open',
      label: 'Downloaden',
      icon: 'download',
      tooltip: 'Download het lesmateriaal',
      handler: (input: QuickLinkInterface): void =>
        this.openEduContentAsDownload(input)
    },
    openBundle: {
      actionType: 'open',
      label: 'Openen',
      icon: 'bundle',
      tooltip: 'Navigeer naar de bundel pagina',
      handler: (input: QuickLinkInterface): void => this.openBundle(input)
    },
    openTask: {
      actionType: 'open',
      label: 'Openen',
      icon: 'task',
      tooltip: 'Navigeer naar de taken pagina',
      handler: (input: QuickLinkInterface): void => this.openTask(input)
    },
    openArea: {
      actionType: 'open',
      label: 'Openen',
      icon: 'lesmateriaal',
      tooltip: 'Navigeer naar de leergebied pagina',
      handler: (input: QuickLinkInterface): void => this.openArea(input)
    },
    openBoeke: {
      actionType: 'open',
      label: 'Openen',
      icon: 'boeken',
      tooltip: 'Open het bordboek',
      handler: (input: QuickLinkInterface): void => this.openBoeke(input)
    },
    openSearch: {
      actionType: 'open',
      label: 'Openen',
      icon: 'magnifier',
      tooltip: 'Open de zoekopdracht',
      handler: (input: QuickLinkInterface): void => this.openSearch(input)
    },
    edit: {
      actionType: 'manage',
      label: 'Bewerken',
      icon: 'edit',
      tooltip: 'Pas de naam van het item aan',
      handler: (input: QuickLinkInterface): void => this.enableEditing(input)
    },
    remove: {
      actionType: 'manage',
      label: 'Verwijderen',
      icon: 'delete',
      tooltip: 'Verwijder het item',
      handler: (input: QuickLinkInterface): void => this.remove(input)
    },
    none: {
      actionType: 'open',
      label: '',
      icon: '',
      tooltip: '',
      handler: () => {}
    }
  };

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
    source: QuickLinkInterface[],
    searchText: string
  ): ContentDataInterface[] {
    if (searchText.trim().length > 0) {
      const results = this.filterService
        .filter(source, { name: searchText })
        .sort(this.quickLinkSorter);

      const contentData: ContentDataInterface = {
        type: 'Gevonden items',
        title: 'Gevonden items',
        quickLinks: results
      };

      return [contentData];
    } else {
      return this.convertToQuickLinkData(source);
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
  }

  public openEduContentAsDownload(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openStaticContent(quickLink.eduContent);
  }

  public openBundle(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openBundle(quickLink.bundle);
  }

  public openTask(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openTask(quickLink.task);
  }

  public openArea(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openArea(quickLink.learningArea);
  }

  public openSearch(quickLink: QuickLinkInterface) {
    this.quickLinkViewModel.openSearch(quickLink, this.data.mode);
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

  private setupStreams() {
    this.contentData$ = this.quickLinkViewModel
      .getQuickLinks$(this.data.mode)
      .pipe(
        map(quickLinks =>
          quickLinks.map(quickLink => this.convertToQuickLink(quickLink))
        )
      );

    this.feedback$ = this.quickLinkViewModel.feedback$;
  }

  private convertToQuickLinkData(
    values: QuickLinkInterface[]
  ): ContentDataInterface[] {
    return values
      .reduce(
        // group into categories
        (acc, value) => {
          let category = acc.find(cD => cD.type === value.type);

          if (!category) {
            category = {
              type: value.type,
              title: this.getCategoryTitle(value),
              quickLinks: []
            };
            acc.push(category);
          }

          category.quickLinks.push(value);

          return acc;
        },
        [] as ContentDataInterface[]
      )
      .map(category => ({
        ...category,
        quickLinks: category.quickLinks.sort((a, b) =>
          this.quickLinkSorter(a, b)
        ) // order items in category
      }))
      .sort((a, b) => this.quickLinkDataCategorySorter(a, b)); // order categories
  }

  // adds actions to Favorites and Histories
  private convertToQuickLink(
    value: FavoriteInterface | HistoryInterface
  ): QuickLinkInterface {
    return {
      ...value,
      eduContent: value.eduContent as EduContent,
      defaultAction: this.getDefaultAction(value),
      alternativeOpenActions: this.getAlternativeOpenActions(value),
      manageActions: [this.quickLinkActions.edit, this.quickLinkActions.remove]
    };
  }

  private getDefaultAction(
    quickLink: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface {
    switch (quickLink.type) {
      case FavoriteTypesEnum.AREA:
      case 'area':
        return this.quickLinkActions.openArea;
      case FavoriteTypesEnum.BOEKE:
      case 'boek-e':
        return this.quickLinkActions.openBoeke;
      case FavoriteTypesEnum.EDUCONTENT:
      case 'educontent':
        const eduContent = quickLink.eduContent as EduContent;
        if (eduContent.contentType === 'exercise') {
          return this.quickLinkActions.openEduContentAsExercise;
        } else if (eduContent.streamable) {
          return this.quickLinkActions.openEduContentAsStream;
        } else {
          return this.quickLinkActions.openEduContentAsDownload;
        }
      case FavoriteTypesEnum.BUNDLE:
      case 'bundle':
        return this.quickLinkActions.openBundle;
      case FavoriteTypesEnum.TASK:
      case 'task':
        return this.quickLinkActions.openTask;
      case FavoriteTypesEnum.SEARCH:
      case 'search':
        return this.quickLinkActions.openSearch;
      default:
        return this.quickLinkActions.none;
    }
  }

  private getAlternativeOpenActions(
    quickLink: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface[] {
    switch (quickLink.type) {
      case FavoriteTypesEnum.EDUCONTENT:
      case 'educontent':
        const eduContent = quickLink.eduContent as EduContent;
        if (eduContent.contentType === 'exercise') {
          return [this.quickLinkActions.openEduContentAsSolution];
        } else if (eduContent.streamable) {
          return [this.quickLinkActions.openEduContentAsDownload];
        }
    }
    return [];
  }

  private quickLinkDataCategorySorter(
    a: ContentDataInterface,
    b: ContentDataInterface
  ): number {
    let aIndex, bIndex: number;
    if (this.categories.has(a.type)) {
      aIndex = this.categories.get(a.type).order;
    } else {
      return 1;
    }

    if (this.categories.has(b.type)) {
      bIndex = this.categories.get(b.type).order;
    } else {
      return -1;
    }

    return aIndex - bIndex;
  }

  private quickLinkSorter(
    a: QuickLinkInterface,
    b: QuickLinkInterface
  ): number {
    return new Date(b.created).getTime() - new Date(a.created).getTime(); // sorting descending
  }

  private getCategoryTitle(quickLink: FavoriteInterface | HistoryInterface) {
    return this.categories.has(quickLink.type)
      ? this.categories.get(quickLink.type).label
      : quickLink.type;
  }
}

interface ContentDataInterface {
  type: FavoriteTypesEnum | string; //history has string as type type
  title: string;
  quickLinks: QuickLinkInterface[];
}

interface QuickLinkInterface extends FavoriteInterface, HistoryInterface {
  defaultAction: QuickLinkActionInterface;
  alternativeOpenActions: QuickLinkActionInterface[];
  manageActions: QuickLinkActionInterface[];
  // override eduContent property -> is always cast to EduContent
  eduContent?: EduContent;
}

interface QuickLinkActionInterface {
  actionType: 'open' | 'manage';
  label: string;
  icon: string;
  tooltip: string;
  handler: (quickLink: QuickLinkInterface) => void;
}
