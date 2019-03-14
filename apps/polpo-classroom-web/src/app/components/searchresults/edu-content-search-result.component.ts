import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ResultItemBase } from '@campus/search';
import { EduContentSearchResultInterface } from './interfaces/educontent-search-result';

@Component({
  // tslint:disable-next-line
  selector: 'edu-content-search-result',
  templateUrl: './edu-content-search-result.component.html',
  styleUrls: ['./edu-content-search-result.component.scss'],
  animations: [
    trigger('collapseExpandTrigger', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('.2s ease-out', style({ height: '*' }))
      ])
    ])
  ]
})
export class EduContentSearchResultComponent extends ResultItemBase
  implements OnInit, OnChanges {
  @Input() data: EduContentSearchResultInterface;

  protected normalizedEduContentToc: any;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.normalizedEduContentToc = this.getNormalizedEduContentToc();
  }

  public linkTask() {}

  public linkBundle() {}

  public unlinkTask() {}

  public unlinkBundle() {}

  public toggleFavorite() {}

  public openStatic() {}
  public openExercise(answers: boolean) {}

  public stream() {}

  get isEduContentInCurrentBundle(): boolean {
    return (
      this.data.currentBundle.eduContents.filter(
        e => e.id === this.data.eduContent.id
      ).length !== 0
    );
  }

  get isEduContentInCurrentTask(): boolean {
    return (
      this.data.currentTask.eduContents.filter(
        e => e.id === this.data.eduContent.id
      ).length !== 0
    );
  }

  /**
   * Returns an array containing objects with the title and tocs list of every book
   */
  private getNormalizedEduContentToc() {
    const root = this.data.eduContent.publishedEduContentMetadata.eduContentTOC;
    return root.map(rootTOC => {
      return {
        title: rootTOC.eduContentBook.title,
        tocs: [rootTOC, ...rootTOC.eduContentBook.eduContentTOC]
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.normalizedEduContentToc = this.getNormalizedEduContentToc();
    }
  }
}
