import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  EffectFeedbackInterface,
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import { QuickLinkViewModel } from './quick-link.viewmodel';
import { MockQuickLinkViewModel } from './quick-link.viewmodel.mock';

@Component({
  selector: 'campus-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.scss'],
  providers: [{ provide: QuickLinkViewModel, useClass: MockQuickLinkViewModel }]
})
export class QuickLinkComponent implements OnInit {
  public contentData$: Observable<ContentDataInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public dialogTitle: string;
  public dialogTitleIcon: string;

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
    openAsExercise: {
      actionType: 'open',
      label: 'Openen',
      icon: 'exercise:open',
      tooltip: 'open oefening zonder oplossingen',
      handler: (input: QuickLinkInterface): void => this.openAsExercise(input)
    },
    openAsSolution: {
      actionType: 'open',
      label: 'Toon oplossing',
      icon: 'exercise:finished',
      tooltip: 'open oefening met oplossingen',
      handler: (input: QuickLinkInterface): void => this.openAsSolution(input)
    },
    edit: {
      actionType: 'manage',
      label: 'Bewerken',
      icon: 'edit',
      tooltip: 'naam aanpassen',
      handler: (input: QuickLinkInterface): void => this.update(input)
    },
    remove: {
      actionType: 'manage',
      label: 'Verwijderen',
      icon: 'verwijder',
      tooltip: 'item verwijderen',
      handler: (input: QuickLinkInterface): void => this.remove(input)
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: QuickLinkTypeEnum },
    private dialogRef: MatDialogRef<QuickLinkComponent>,
    private quickLinkViewModel: QuickLinkViewModel
  ) {}

  ngOnInit() {
    this.setupStreams();

    if (this.dialogTitles.has(this.data.mode)) {
      const titleData = this.dialogTitles.get(this.data.mode);
      this.dialogTitle = titleData.title;
      this.dialogTitleIcon = titleData.icon;
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public openAsExercise(quickLink: QuickLinkInterface) {
    console.log('openExercise', quickLink);
  }

  public openAsSolution(quickLink: QuickLinkInterface) {
    console.log('openAsSolution', quickLink);
  }

  public update(quickLink: QuickLinkInterface) {
    console.log('update', quickLink);
  }

  public remove(quickLink: QuickLinkInterface) {
    console.log('remove', quickLink);
    this.quickLinkViewModel.delete(quickLink.id, this.data.mode);
  }

  private setupStreams() {
    this.contentData$ = this.quickLinkViewModel
      .getQuickLinks$(this.data.mode)
      .pipe(map(qL => this.convertToQuickLinkData(qL)));

    this.feedback$ = this.quickLinkViewModel.feedback$;
  }

  private convertToQuickLinkData(
    values: FavoriteInterface[] | HistoryInterface[]
  ): ContentDataInterface[] {
    return values
      .reduce(
        // group into categories
        (acc, value) => {
          const found = acc.find(cD => cD.type === value.type);
          let newObject: ContentDataInterface;
          if (found) {
            acc = acc.filter(obj => obj !== found);
            newObject = {
              ...found,
              quickLinks: [...found.quickLinks, this.convertToQuickLink(value)]
            };
          } else {
            newObject = {
              type: value.type,
              title: value.type, // TODO: add actual name -> function? enum?
              quickLinks: [this.convertToQuickLink(value)]
            };
          }

          return [...acc, newObject];
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
      defaultAction: this.getDefaultAction(value),
      alternativeOpenActions: this.getAlternativeOpenActions(value),
      manageActions: [this.quickLinkActions.edit, this.quickLinkActions.remove]
    };
  }

  private getDefaultAction(
    value: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface {
    return this.quickLinkActions.openAsExercise;
  }

  private getAlternativeOpenActions(
    value: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface[] {
    return [this.quickLinkActions.openAsSolution];
  }

  private quickLinkDataCategorySorter(
    a: ContentDataInterface,
    b: ContentDataInterface
  ): number {
    let aIndex, bIndex: number;
    const numberOfKeys = Array.from(this.categories.keys()).length;

    if (this.categories.has(a.type)) {
      aIndex = this.categories.get(a.type).order;
    } else {
      aIndex = numberOfKeys; // not in map -> always last
    }

    if (this.categories.has(b.type)) {
      bIndex = this.categories.get(b.type).order;
    } else {
      bIndex = numberOfKeys; // not in map -> always last
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
}

interface QuickLinkActionInterface {
  actionType: 'open' | 'manage';
  label: string;
  icon: string;
  tooltip: string;
  handler: (quickLink: QuickLinkInterface) => void;
}
