import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContentInterface } from '@campus/dal';

@Component({
  selector: 'campus-info-panel-contents',
  templateUrl: './info-panel-contents.component.html',
  styleUrls: ['./info-panel-contents.component.scss']
})
export class InfoPanelContentsComponent implements OnChanges {
  items: { text: string; count?: number; editable?: boolean; data?: any }[];

  @Input() contents: ContentInterface[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contents) {
      this.items = this.contents.map(content =>
        Object.assign(
          {},
          {
            text: content.name
          }
        )
      );
    }
  }
}
