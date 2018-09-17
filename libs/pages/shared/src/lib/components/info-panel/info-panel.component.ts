import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {
  @Input() titleText: string;
  @Input() person = {
    displayName: 'Leerkracht Naam',
    orientation: 'left'
  };
  @Input() preview = {
    preview: 'https://d1fh3heiqa6frl.cloudfront.net/890f054414a06a81489f35e6b27fc23c9ee12d0ce4e0a867801a569a073438de/7bc034592d6ea1a4ec2f3e99eb63ad56_340-1.png',
    titleText: 'Bundle title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    productTypeIcon: 'polpo-presentatie',
    fileExtentionIcon: 'xls',
    methods: ['topos']
  };
  @Input() inputs = [
    {
      titleText: 'Titel',
      text: 'The Bundle'
    },
    {
      titleText: 'Omschrijving',
      text: 'The Bundle description'
    }
  ]
  @Input() adaptableListItems = {
    titleText: 'Geselecteerde items:',
    items: [
      {
        text: 'De Tijd'
      },
      {
        text: 'De schaal'
      }
    ]
  };
  @Input() dropdown = {
    options: ['option-one', 'option-two'],
    label: 'the label',
    text: ';lkasd  klasdjf;lkasd f;lasjdkf ja;sdkf asdkfj ;akjsdf '
  };

  // @Input() titleText: string;
  // @Input() items: { text: string; count?: number; eventId?: number }[];
  // @Input() showIcon: boolean;
  // @Output() iconClicked = new EventEmitter<boolean>();
  // @Output() itemIconClicked = new EventEmitter<number>();

  actionIconClickedEvent(text: string): void {
    console.log(text + ' icon clicked');
  }
  listItemIconClickedEvent(id: number): void {
    console.log('item ' + id + ' icon clicked');
  }
  listIconClickedEvent(): void {
    console.log('list icon clicked');
  }

  saveTitleEvent(title: string): void {
    console.log('title save: ' + title);
  }

  saveDescriptionEvent(description: string): void {
    console.log('description save: ' + description);
  }

  savePeriodEvent(start: Date, end: Date): void {
    console.log('start: ' + start + ' end: ' + end);
  }

  editStartEvent(): void {
    console.log('editing start');
  }

  editEndEvent(): void {
    console.log('editing end');
  }
}
