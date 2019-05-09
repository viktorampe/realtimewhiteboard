import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface
} from '@campus/dal';
import { QuickLinkTypeEnum } from '@campus/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkViewModel } from './quick-link.viewmodel';
import { MockQuickLinkViewModel } from './quick-link.viewmodel.mock';

@Component({
  selector: 'campus-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.scss'],
  providers: [{ provide: QuickLinkViewModel, useClass: MockQuickLinkViewModel }]
  // TODO: use actual viewModel
  // providers: [  QuickLinkViewModel ]
})
export class QuickLinkComponent implements OnInit {
  public contentData$: Observable<ContentDataInterface[]>;
  public dialogTitle = '';
  public diablogTitleIcon = '';

  private quickLinkActions: {
    [key: string]: QuickLinkActionInterface;
  } = {
    openAsExercise: {
      actionType: 'open',
      label: 'Openen',
      icon: 'edit',
      tooltip: 'open oefening zonder oplossingen',
      handler: this.openAsExercise
    },
    openAsSolution: {
      actionType: 'open',
      label: 'met oplossing',
      icon: 'edit',
      tooltip: 'open oefening met oplossingen',
      handler: this.openAsSolution
    },
    edit: {
      actionType: 'manage',
      label: 'Bewerken',
      icon: 'edit',
      tooltip: 'naam aanpassen',
      handler: this.update
    },
    delete: {
      actionType: 'manage',
      label: 'Verwijderen',
      icon: 'verwijder',
      tooltip: 'item verwijderen',
      handler: this.delete
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
  }

  closeDialog() {
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

  public delete(quickLink: QuickLinkInterface) {
    console.log('delete', quickLink);
    this.quickLinkViewModel.delete(quickLink.id, this.data.mode);
  }

  private setupStreams() {
    this.contentData$ = this.quickLinkViewModel.quickLinks$.pipe(
      map(qL => this.convertToQuickLinkData(qL))
    );
  }

  private convertToQuickLinkData(
    values: FavoriteInterface[] | HistoryInterface[]
  ): ContentDataInterface[] {
    return values
      .reduce(
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
      .sort(this.quickLinkDataSorter);
  }

  // adds actions to Favorites and Histories
  private convertToQuickLink(
    value: FavoriteInterface | HistoryInterface
  ): QuickLinkInterface {
    return {
      ...value,
      defaultAction: this.getDefaultAction(value),
      alternativeOpenActions: this.getAlternativeOpenActions(value),
      manageActions: [this.quickLinkActions.edit, this.quickLinkActions.delete]
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

  private quickLinkDataSorter(
    a: ContentDataInterface,
    b: ContentDataInterface
  ): number {
    return a.type > b.type ? 1 : -1; // TODO: write actual sorting,  sorting alphabetically for now
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
