import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ResultItemBase } from '@campus/search';
import { EduContentSearchResultInterface } from './interfaces/educontent-search-result';

@Component({
  selector: 'edu-content-search-result',
  templateUrl: './edu-content-search-result.component.html',
  styleUrls: ['./edu-content-search-result.component.scss'],
  animations: [
    trigger('collapseExpandTrigger', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('.2s ease-out', style({ height: '*' }))
      ]),
      transition(':leave', [
        //style({ height: '*' }),
        //animate('.2s ease-out', style({ height: '0px' }))
      ])
    ])
  ]
})
export class EduContentSearchResultComponent extends ResultItemBase
  implements OnInit {
  @Input() data: EduContentSearchResultInterface;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
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
      ).length != 0
    );
  }

  get isEduContentInCurrentTask(): boolean {
    return (
      this.data.currentTask.eduContents.filter(
        e => e.id === this.data.eduContent.id
      ).length != 0
    );
  }

  /**
   * Returns an array containing objects with the title and tocs list of every book
   */
  getNormalizedEduContentToc() {
    let root = this.data.eduContent.publishedEduContentMetadata.eduContentTOC;
    return root.map(rootTOC => {
      return {
        title: rootTOC.eduContentBook.title,
        tocs: [rootTOC].concat(rootTOC.eduContentBook.eduContentTOC)
      };
    });
  }
}
