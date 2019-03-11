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

    console.log(this.data.eduContent);
  }
}
